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

export async function handleCPALeadTasksImport() {
  const networkDetails = await getNetworkDetails("cpalead");
  const apiUrl = `https://www.cpalead.com/api/offers?id=${networkDetails.app_id}`;
  let offset = 0;
  let limit = 1000;
  let continueFetching = false;
  let import_id = "cpalead_" + Math.random().toString(36).substr(2, 9);
  console.log("cpalead importid", import_id);
  
  do {
    const response = await axios.get(apiUrl, {
      params: { limit, offset },
    });

    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }

    const data: any = response.data;
    if (data.status !== "success") {
      throw new Error("CPA Lead API Exception");
    }
    
    const offers = data.offers;
    if (offers && offers.length > 0) {
      const transformedTaskData = await transformResponse(
        offers,
        networkDetails,
        import_id
      );
      
      // CPALead doesn't seem to have multi-step goals based on the sample data
      // Only upsert task data
      await UpsertData(transformedTaskData);
    }

    offset = limit + offset;
    continueFetching = offers && offers.length === limit;
  } while (continueFetching);
  
  await RemoveTaskAndGoals("cpalead", import_id.trim());
}

async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {
  const tasks = offers.map(async (offer: any) => {
    const task = {
      network: "cpalead",
      offer_id: `cpalead_${offer.id}`,
      campaign_id: offer.id,
      name: JSON.stringify({ en: offer.title }),
      slug: sluggify(networkDetails.code, offer.title, offer.id),
      description: JSON.stringify({ en: offer.description || "" }),
      instructions: null,
      network_image: offer?.creatives?.og_image || offer?.creatives?.url,
      payout: parseFloat(offer.amount) || 0,
      url: `${offer.link}&subid=#USER_ID`,
      countries: JSON.stringify(
        cleanCountries(offer.countries || [])
      ),
      devices: JSON.stringify([]),
      platforms: JSON.stringify(getPlatformFromDevice([offer.device])),
      conversion_rate: offer.conversion_rate ?? 0,
      network_categories: null,
      network_goals: null,
      goals_count: 0,
      category_id: null,
      import_id: import_id.trim(),
    };
    
    task.category_id = await determineAndAssignCategoryToTask(task);
    return task;
  });
  
  return await Promise.all(tasks);
}
