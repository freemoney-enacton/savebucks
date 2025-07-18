import axios from "axios";
import { determineAndAssignCategoryToTask, getNetworkDetails, RemoveTaskAndGoals, sluggify, UpsertData, UpsertGoalsData } from "./baseImportTask";
import { isBuffer } from "util";
import { platform } from "os";

export async function handleRevlumTasksImport(){
    const networkDetails = await getNetworkDetails("revlum");
    const apiUrl = `https://revlum.com/api/offers`;
    let import_id = "revlum_" + Math.random().toString(36).substr(2, 9);

    const response = await axios.get(apiUrl, {
      params: { apikey: networkDetails.api_key},
    });

    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }
    
    const data: any = response.data;
    if (data.status !== "success") {
      throw new Error("Revlum API Exception");
    }
    const offers = data.data;
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
    RemoveTaskAndGoals("revlum", import_id);    
}

async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {
  const tasks = offers.map(async (offer: any) => {
      
    return {
    network: "revlum",
    offer_id: `revlum_${offer.id}`,
    campaign_id: offer.id,
    name: JSON.stringify({ en: offer.name }),
    slug: 'revlum-'+sluggify(offer.name),
    daily_cap:Number(offer.daily_cap),
    description: JSON.stringify({ en: offer.description }),
    network_image: offer.creatives.icon,
    payout: parseDecimal(offer.payout.usd)*Number(networkDetails.cashback_percent),
    url: offer.url.replace("{userId}", "#USER_ID"),
    countries: JSON.stringify(
      offer.geo_targeting.countries.map((country: any) => country.country_code.toUpperCase())
    ),
    platforms: JSON.stringify(
      fetchPlatforms(offer.devices)
    ),
    network_goals: offer.events && Array.isArray(offer.events)
      ? JSON.stringify(
          offer.events.map((event: any) => ({
            name: event.name,
            payout: parseFloat(event.payout),
          }))
        )
      : null,
    goals_count: offer.events && Array.isArray(offer.events) ? offer.events.length : 0,
    category_id: await determineAndAssignCategoryToTask(offer),
    import_id: import_id,
    created_date:new Date(offer.added)
  }
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
    return Array.isArray(offer.events)
      ? offer.events.map((event: any,index:number) => ({
          network: "revlum",
          task_offer_id: `revlum_${offer.id}`,
          network_task_id: offer.id,
          network_goal_id: `${offer.id}_${index}`,
          network_goal_name: event.name,
          sort_order: event.sort_order,
          name: JSON.stringify({en:event.name}),
          cashback: parseDecimal(event.payout.reward),
          revenue: parseDecimal(event.payout.usd),
          import_id: import_id,
        }))
      : [];
  });
  return tasks;
}

export function parseDecimal(value: any): number {
  if (!value) return 0;
  
  // If it's already a number, return it
  if (typeof value === 'number') return value;
  
  // If it's a string, clean it and parse it
  if (typeof value === 'string') {
    // Remove any commas and ensure it uses period as decimal separator
    const cleanValue = value.replace(/,/g, '');
    const parsedValue = parseFloat(cleanValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  
  return 0;
}

function fetchPlatforms(platforms: any): string[] {
  return Array.isArray(platforms) 
    ? platforms.flatMap((platform: any) => 
        platform.name === "all" 
          ? ["android", "web", "ios"] 
          : platform.name
      ) 
    : [];
}
