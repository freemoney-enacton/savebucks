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

export async function handleAdscendMediaTasksImport() {
  const networkDetails = await getNetworkDetails("adscendmedia"); 
  const apiUrl = `https://api.adscendmedia.com/v1/publisher/${networkDetails. pub_id}/offers.json`;

  let import_id = "adscendmedia_" + new Date().toISOString();

  const headers = {
    "Authorization": `Basic ${Buffer.from(`${networkDetails.pub_id}:${networkDetails.api_key}`).toString('base64')}`,
  };
    const response = await axios.get(apiUrl, {
      headers,
    });

    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }

    const data: any = response.data; 
  
    const offers = data.offers; 
    if (offers.length > 0) {
      const transformedTaskData = await transformResponse(
        offers,
        networkDetails,
        import_id
      );
      const networkGoals = transformGoals(offers, import_id);
      if (networkGoals.length > 0) {
        UpsertData(transformedTaskData);
        UpsertGoalsData(networkGoals);
      } else {
        UpsertData(transformedTaskData);
      }
    }

  
   RemoveTaskAndGoals("adscendmedia", import_id);
}
async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {   
  const tasks = offers.map(async (offer: any) => {
    // Log the individual offer data
  

    return { 
      network: "adscendmedia",
      offer_id: `adscendmedia_${offer.offer_id}`,
      campaign_id: offer.offer_id,
      name: JSON.stringify({ en: offer.name }),
      slug: 'adscend-'+sluggify(offer.name),
      description: JSON.stringify({ en: offer.description }),
      instructions: JSON.stringify({ en: offer.conversion_notes }),
      network_image: offer.creatives.length > 0 ? offer.creatives[0].url : null, // Use the first creative image URL
      payout: offer.events.length > 0 ? getPayout(offer,Number(networkDetails.cashback_percent)) : (offer.payout * Number(networkDetails.cashback_percent)),
      url: offer.click_url.includes('?') 
      ? `${offer.click_url}&sub1=#USER_ID` 
      : `${offer.click_url}?sub1=#USER_ID`,
      countries: JSON.stringify(
        cleanCountries(offer.countries.map((c: any) => c))
      ),
      platforms:getPlatformFromDeviceAdscend(offer.target_system),
      conversion_rate: offer.conversion_rate_network ?? 0, // Use the network conversion rate
      network_categories: JSON.stringify(offer.category_id) ?? null, // Use category_id directly
      network_goals: offer.events
        ? JSON.stringify(
            offer.events.map((event: any) => ({
              id: event.event_id,
              name: event.event_name,
              payout: parseFloat(event.event_revenue),
              cashback: parseFloat((event.event_revenue * 0.5).toFixed(2)),
            }))
          )
        : null,
      goals_count: offer.events ? offer.events.length : 0,
      category_id: await determineAndAssignCategoryToTask(offer),
      import_id: import_id,
    };  
  });

  return await Promise.all(tasks);
}
function transformGoals(offers: any[], import_id: string) {
  const tasks = offers
  .map((offer:any)=>(
    {...offer,events:offer.events?.map((event
    :any,index:number)=>(
      {...event,sort_order:index})) || []
    }))
  .flatMap((offer: any) => {
    if (!offer.events) return [];
    return Array.isArray(offer.tasks)
      ? offer.events.map((event: any) => ({
          network: "adscendmedia",
          task_offer_id: `adscendmedia_${offer.id}`,
          network_task_id: offer.id,
          network_goal_id: event.event_id,
          network_goal_name: event.event_name,
          sort_order: event.sort_order,
          name: JSON.stringify({ en: event.event_name }),
          cashback: parseFloat((event.event_revenue * 0.5).toFixed(2)),
          revenue: parseFloat(event.event_revenue),
          import_id: import_id,
        }))
      : [];
  });
  return tasks;
}

export function getPayout(offer: any,rate:number) {
  const totalPayout = offer.events.reduce(
    (sum: number, event: any) => sum + parseFloat(event.event_revenue),
    0
  );
  return totalPayout * rate * 0.01;
}

handleAdscendMediaTasksImport()
  .then(() => {
    fetch(`${config.env.admin.url}/downloadTaskImage/adscendmedia`).then(() => {
      console.log("Adscendmedia tasks imported successfully.");
    });
  })
  .catch((error) => {
    console.error("Failed to import Adscendmedia tasks:", error);
  });

  export function getPlatformFromDeviceAdscend(platform: any) {
    const config: any = {
      0:["android","ios","web"],
      31:["web"],
      18:["web"],
      19:["web"],
      10:["web"],
      11:["web"],
      12:["web"],
      13:["web"],
      20:["web"],
      30:["android","ios"],
      40:["android"],
      56:["android"],
      50:["ios"],
      51:["ios"],
      52:["ios"],
    };
    return JSON.stringify(config[platform] || []);
  }