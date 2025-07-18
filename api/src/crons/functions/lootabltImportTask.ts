import axios from "axios";
import {
  getNetworkDetails,
  cleanCountries,
  getPlatformFromDevice,
  determineAndAssignCategoryToTask,
  UpsertData,
  UpsertGoalsData,
  RemoveTaskAndGoals,
  sluggify,
} from "./baseImportTask";
import { config } from "../../config/config";
import { number } from "zod";

export async function handleLootablyTasksImport() {
  const networkDetails = await getNetworkDetails("lootably");
  const apiUrl = "https://api.lootably.com/api/v2/offers/get";

  let import_id = "lootably_" + new Date().getTime();
  console.log("🚀 ~ handleLootablyTasksImport ~ import_id:19 ", import_id)

  const response = await axios.post(apiUrl, {
    apiKey: networkDetails.api_key,
    placementID: networkDetails.app_id,
  });

  if (response.status !== 200) {
    throw new Error("API request failed with status: " + response.status);
  }
  const data: any = response.data;
  if (data.success == false) {
    throw new Error("Lootably API Exception");
  }

  const offers = data.data?.offers ?? []; console.log("all offers", offers, "all offers");
  if (offers.length > 0) {
    console.log("if  offers");
    const transformedTaskData = await transformResponse(offers, import_id);

    const networkGoals = transformGoals(offers, import_id);
    if (networkGoals.length > 0) {
      UpsertData(transformedTaskData);
      UpsertGoalsData(networkGoals);
    } else {
      UpsertData(transformedTaskData);
    }
  }
  else console.log("else no offers");
  await RemoveTaskAndGoals("Lootably", import_id);

  console.log("🚀 ~ handleLootablyTasksImport ~ import_id:50 ", import_id)
  await RemoveTaskAndGoals("lootably", import_id);

  fetch(`${config.env.admin.url}/downloadTaskImage/lootably`).then(() => {
    console.log("lootably tasks imported successfully.");
  });
}

async function transformResponse(offers: any[], import_id: string) {
  const tasks = offers.map(async (offer: any) => {

  let  payout;
  if (offer.type === 'multistep' && Array.isArray(offer.goals)) {  
    payout = calculatePayout(offer.goals.map((goal: any) => goal.currencyReward));
  } else {
    payout = calculatePayout([offer.currencyReward]);
  }
    return {
      network: "lootably",
      offer_id: `lootably_${offer.offerID}`,
      campaign_id: offer.offerID,
      name: JSON.stringify({ en: offer.name }),
      slug: 'lootably-'+sluggify(offer.name),
      description: JSON.stringify({ en: offer.description }),
      instructions: null,
      network_image: offer.image,
      payout: payout,
      url: offer.link.replace("{userID}", "#USER_ID"),
      countries: JSON.stringify(
        cleanCountries(offer.countries.map((c: any) => c))
      ),
      devices: JSON.stringify(cleanDevices(offer.devices)),
      platforms: JSON.stringify(
        getPlatformFromDevice(offer.devices.map((os: any) => os))
      ),
      conversion_rate: offer.conversionRate ?? 0,
      network_categories: JSON.stringify(offer.categories) ?? null,
      goals_count: offer.goals ? offer.goals.length : 0,
      category_id: await determineAndAssignCategoryToTask(offer),
      import_id: import_id,
    };
  });

  return Promise.all(tasks);
}
function cleanDevices(devices: any) {
  if (devices.includes("*")) {
    return null;
  }
  return devices.map((device: any) => device.toLowerCase());
}
function generateSlug(name: any) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-|-$/g, '') // Remove leading and trailing hyphens
    .trim(); // Trim any whitespace
}
function transformGoals(offers: any[], import_id: string) {
  const goals = offers
  .map((offer:any)=>(
    {...offer,goals:offer.goals?.map((goal
    :any,index:number)=>(
      {...goal,sort_order:index})) || []
    }))
  .flatMap((offer: any) => {
    if (!offer.goals) return [];
    return Array.isArray(offer.goals)
      ? offer.goals.map((goal: any) => ({
        network: "lootably",
        task_offer_id: `lootably_${offer.offerID}`,
        network_task_id: offer.offerID,
        network_goal_id: goal.goalID,
        network_goal_name: goal.description,
        sort_order: goal.sort_order,
        name: JSON.stringify({ en: goal.description }),
        cashback: goal.currencyReward,
        revenue: goal.revenue,
        import_id: import_id,
      }))
      : [];
  });
  return goals;
}

const calculatePayout = (rewards: any[]) => {
  return rewards.reduce((total, reward) => {
    // Check if the reward is a string and convert it to a number
    const value = 
      typeof reward === "string" 
        ? parseFloat(reward) // Convert string to number
        : reward; // If it's already a number, use it directly

    
    return total + (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0);
  }, 0);
};
