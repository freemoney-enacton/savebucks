import axios from "axios";
import {
  getNetworkDetails,
  cleanCountries,
  cleanDevices,
  getPlatformFromDevice,
  determineAndAssignCategoryToTask,
  UpsertData,
  UpsertGoalsData,
  RemoveTaskAndGoals,
  sluggify,
} from "./baseImportTask";
import { config } from "../../config/config";
import { taskGoalSchema } from "../../modules/tasks/task.schemas";

interface Instruction {
  conversion_instructions_short: string;
  conversion_instructions_long: string;
}
export async function handleAyetTasksImport() {
  const networkDetails = await getNetworkDetails("ayet");
  const apiUrl = `https://www.ayetstudios.com/offers/get/${networkDetails.app_id}`;
  let offset = 0;
  let limit = 1000;
  let continueFetching = false;
  let import_id = "ayet_" + Math.random().toString(36).substr(2, 9);
  console.log("ayet importid",import_id)
  do {
    const headers = {
      "X-S2S-Token": networkDetails.api_key,
    };
    const response = await axios.get(apiUrl, {
      headers,
      params: { apiKey: networkDetails.api_key, limit, skip: offset },
    });

    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }

    const data: any = response.data;
    if (data.status !== "success") {
      throw new Error("Ayte API Exception");
    }
    const offers = data.offers;
    if (offers.length > 0) {
      const transformedTaskData = await transformResponse(
        offers,
        networkDetails,
        import_id
      );
      const networkGoals = transformGoals(offers, import_id);
      if (networkGoals.length > 0) {
        await UpsertData(transformedTaskData);
        await UpsertGoalsData(networkGoals);
      } else {
        await UpsertData(transformedTaskData);
      }
    }

    offset = limit + offset;
    continueFetching = offers.length === limit;
  } while (continueFetching);
  await RemoveTaskAndGoals("ayet", import_id.trim());
}
async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {
  const tasks = offers.map(async (offer: any) => {
    const longInstructions = Object.fromEntries(
      Object.entries(offer.i18n).map(([lang, instructions]) => {
        // Ensure TypeScript knows the structure of instructions
        const { conversion_instructions_long } = instructions as Instruction;
        return [lang, conversion_instructions_long];
      })
    );
    const task= {
    network: "ayet",
    offer_id: `ayet_${offer.id}`,
    campaign_id: offer.id,
    name: JSON.stringify({ en: offer.name }),
    slug: sluggify(networkDetails.code,offer.name,offer.id),
    description: JSON.stringify({ en: offer.description }),
    instructions: JSON.stringify(longInstructions),
    network_image: offer.icon,
    payout: offer.currency_amount,
    url: offer.tracking_link.replace("{external_identifier}", "#USER_ID"),
    countries: JSON.stringify(
      cleanCountries(offer.countries.map((c: any) => c))
    ),
    devices: JSON.stringify(offer.devices),
    platforms: JSON.stringify(getPlatformFromDevice(offer.platforms)),
    conversion_rate: offer.conversion_rate ?? 0,
    network_categories: offer.tag?.categories ? JSON.stringify(offer.categories) : null,
    network_goals: offer.tasks
      ? JSON.stringify(
          offer.tasks.map((task: any) => ({
            id: task.id,
            name: task.name,
            payout: parseFloat(task.payout),
            cashback: parseFloat(task.currency_amount),
          }))
        )
      : null,
    goals_count: offer.tasks ? offer.tasks.length : 0,
    category_id: null,
    import_id: import_id.trim(),
  }
  task.category_id=await determineAndAssignCategoryToTask(task)
  return task
  });
  return await Promise.all(tasks);
}
function transformGoals(offers: any[], import_id: string) {
  const tasks = offers
  .map((offer:any)=>(
    {...offer,tasks:offer.tasks?.map((task
    :any,index:number)=>(
      {...task,sort_order:index})) || []
    }))
  .flatMap((offer: any) => {
    if (!offer.tasks) return [];
    return Array.isArray(offer.tasks)
      ? offer.tasks.map((task: any) => ({
          network: "ayet",
          task_offer_id: `ayet_${offer.id}`,
          network_task_id: offer.id,
          network_goal_id: task.uuid,
          network_goal_name: task.name,
          sort_order: task.sort_order,
          name: JSON.stringify(task.i18n),
          cashback: task.currency_amount,
          revenue: task.payout,
          import_id: import_id.trim(),
        }))
      : [];
  });
  return tasks;
}
// handleAyetTasksImport()
//   .then(() => {
//     fetch(`${config.env.admin.url}/downloadTaskImage/ayet`).then(() => {
//       console.log("Ayet tasks imported successfully.");
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to import Ayet tasks:", error);
//   });


/* currency amount - caluclaueted amount to be shown to user*/
