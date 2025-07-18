import crypto from "crypto";
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

export async function handleToroImportTask() {
  const networkDetails = await getNetworkDetails("torox");
  const apiUrl = "https://torox.io/api/";
  let import_id = "torox_" + new Date().toISOString();

  const response = await axios.get(apiUrl, {
    params: {
      pubid: networkDetails.pub_id,
      appid: networkDetails.app_id,
      secretkey: networkDetails.api_key,
      format: "json",
    },
  });
  /*console.log("🚀 ~ handleToroImportTask ~ ", {
    apiUrl,
    params: {
      pubid: networkDetails.pub_id,
      appid: networkDetails.app_id,
      secretkey: networkDetails.api_key,
      format: "json",
    },
  })*/

  if (response.status !== 200) {
    throw new Error("API request failed with status: " + response.status);
  }
  const data: any = response.data;

  const offers = data.response.offers;
  //console.log("🚀 ~ handleToroImportTask ~ offers:", offers.length)
  if (offers.length > 0) {
    const transformedTaskData = await transformResponse(
      offers,
      import_id,
      networkDetails.countries ? networkDetails.countries.split(",") : [],
      networkDetails.cashback_percent ? Number(networkDetails.cashback_percent) : 50.00,
      networkDetails.code
    );

    const networkGoals = transformGoals(offers, import_id);
    //console.log("🚀 ~ handleToroImportTask ~ networkGoals:", networkGoals)

    await UpsertData(transformedTaskData);
    await UpsertGoalsData(networkGoals);
  }
  await RemoveTaskAndGoals("torox", import_id.trim());

  await fetch(`${config.env.admin.url}/downloadTaskImage/torox`).then((data) => {
    console.log("torox tasks imported successfully.");
  });
}
async function transformResponse(
  offers: any[],
  import_id: string,
  countries: any[],
  cashback_percent: number,
  network_code: string
) {
  const tasks = offers.map(async (offer: any) => {
    // Create the task object first
    const task = {
      network: "torox",
      offer_id: `torox_${offer.offer_id}`,
      campaign_id: offer.offer_id,
      name: JSON.stringify({ en: offer.offer_name }),
      slug: sluggify(network_code, offer.offer_name, offer.offer_id),
      description: JSON.stringify({ en: offer.offer_desc }),
      instructions: JSON.stringify({
        en:
          offer.call_to_action.replace(/<\s*\/\s*/g, "</") +
          "." +
          offer.disclaimer.replace(/<\s*\/\s*/g, "</"),
      }),
      network_image: offer.image_url ? offer.image_url.trim() : null,
      payout: offer.amount * cashback_percent * 0.01,
      url: offer.offer_url_easy.replace("[USER_ID]", "#USER_ID"),
      countries: JSON.stringify(cleanCountries(offer.countries.map((c: any) => c))),
      devices: JSON.stringify([offer.device]),
      platforms: JSON.stringify(getPlatformFromDevice([offer.platform])),
      conversion_rate: offer.conversion_rate ?? 0,
      network_categories: JSON.stringify(offer.vertical_name) ?? null,
      network_goals: JSON.stringify(
        Array.isArray(offer.events)
          ? offer.events.map((event: any) => ({
            id: crypto.createHash("md5").update(event.event_name).digest("hex"),
            name: event.event_name,
            description: event.call_to_action,
            payout: parseFloat(event.payout),
            cashback: parseFloat(event.amount),
          }))
          : []
      ),
      goals_count: Array.isArray(offer.events) ? offer.events.length : 0,
      category_id: null,
      import_id: import_id.trim(),
    };

    // Now determine and assign the category
    task.category_id = await determineAndAssignCategoryToTask(task);

    return task;
  });

  return Promise.all(tasks);
}
function transformGoals(offers: any[], import_id: string) {
  const tasks = offers
    .map((offer: any) => (
      {
        ...offer, events: offer.events?.map((event
          : any, index: number) => (
          { ...event, sort_order: index })) || []
      }))
    .flatMap((offer: any) => {
      if (!offer.events) return [];
      return Array.isArray(offer.events)
        ? offer.events.map((event: any) => ({
          network: "torox",
          task_offer_id: `torox_${offer.offer_id}`,
          network_task_id: offer.offer_id,
          network_goal_id: crypto
            .createHash("md5")
            .update(event.event_name)
            .digest("hex"),
          sort_order: event.sort_order,
          network_goal_name: event.event_name,
          name: JSON.stringify({ en: event.event_name }),
          cashback: Number(event.amount),
          revenue: event.payout,
          import_id: import_id.trim()
        }))
        : [
          {
            network: "torox",
            task_offer_id: `torox_${offer.offer_id}`,
            network_task_id: offer.offer_id,
            network_goal_id: crypto
              .createHash("md5")
              .update(offer.events.event_name)
              .digest("hex"),
            network_goal_name: offer.events.event_name,
            name: JSON.stringify({ en: offer.events.event_name }),
            description: offer.events.call_to_action,
            cashback: Number(offer.events.amount),
            revenue: offer.events.payout,
            import_id: import_id.trim(),
          },
        ];
    });
  return tasks;
}

// handleToroImportTask()
//   .then(() => {
//     fetch(`${config.env.admin.url}/downloadTaskImage/torox`).then(() => {
//       console.log("Torox tasks imported successfully.");
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to import Torox tasks:", error);
//   });
