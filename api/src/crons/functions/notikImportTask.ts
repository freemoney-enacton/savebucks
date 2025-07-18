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

export async function handleNotikTasksImport() {
  const networkDetails = await getNetworkDetails("notik"); 
  let apiUrl = `https://notik.me/api/v2/get-offers/all?api_key=${networkDetails.api_key}&pub_id=${networkDetails.pub_id}&app_id=${networkDetails.app_id}`;

  
  let continueFetching = false;
  let import_id = "notik_" + Math.random().toString(36).substr(2, 9);
  console.log("import_id: " + import_id);
  do {
 
    const response = await axios.get(apiUrl);
    
    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }

    const responseData: any = response.data;  
    console.log(responseData)
    const offers = responseData.offers.data;  
    if (offers.length > 0) {
      const transformedTaskData = await transformResponse(
        offers,
        networkDetails,
        import_id
      );
      console.log(transformedTaskData)
      const networkGoals = transformGoals(offers, import_id,networkDetails);
      
      if (networkGoals.length > 0) { 
        await UpsertData(transformedTaskData);
        await UpsertGoalsData(networkGoals);
      } else { 
        await UpsertData(transformedTaskData);
      }
    }
    
    continueFetching = responseData.offers.has_more_pages;
    apiUrl = responseData.offers.next_page_url;
    console.log(continueFetching)
    await delay(30000);
  } while (continueFetching);
  console.log("remove notik import_id: " + import_id);

   RemoveTaskAndGoals("notik", import_id);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {   
  const tasks = offers.map(async (offer: any) => {
  

  //console.log("offer", offer,JSON.stringify(getPlatformFromDevice(offer.os)));
//console.log("offer id",offer.offer_id,"if events",offer.events ?? [],offer.offer_id);
    return { 
      network: "notik",
      offer_id: `notik_${offer.offer_id}`,
      campaign_id: offer.offer_id,
      name: JSON.stringify({ en: offer.name }),
      slug: 'notik-'+sluggify(offer.name),
      description: JSON.stringify({ en: offer.description1 }),
      instructions: JSON.stringify({ en: offer.description2 ?? null }),
      network_image: offer.image_url.trim(),
      payout: (offer.events && offer.events?.length > 0) ? getPayout(offer,networkDetails.cashback_percent) : (offer.payout * 0.5),
      url: offer.click_url.replace('[user_id]', '#USER_ID'),
      countries: JSON.stringify(
        cleanCountries(offer.country_code.map((c: any) => c))
      ),
      devices: JSON.stringify(offer.devices),
      platforms: JSON.stringify(getPlatformFromDevice(offer.os)),  
      conversion_rate: offer.conversion_rate_network ?? 0, 
      network_categories: JSON.stringify(offer.categories) ?? null,
      network_goals: offer.events
        ? JSON.stringify(
            offer.events.map((event: any) => ({
              id: event.id,
              name: event.name,
              payout: parseFloat(event.payout),
              cashback: parseFloat((event.payout *  networkDetails.cashback_percent*0.01).toFixed(2)),
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
function transformGoals(offers: any[], import_id: string,networkDetails:any) {
  const tasks = offers
  .map((offer:any)=>(
    {...offer,events:offer.events?.map((event
    :any,index:number)=>(
      {...event,sort_order:index})) || []
    }))
  .flatMap((offer: any) => { //console.log("offer_id",offer.offer_id,"if events",offer.events ?? []);
    if (!offer.events) return [];
    return Array.isArray(offer.events)
    ? offer.events.map((event: any) => {
      if(event.id) {  
        
       

        return { 
          network: "notik",
          task_offer_id: `notik_${offer.offer_id}`,
          network_task_id: offer.offer_id,
          network_goal_id: event.id,
          network_goal_name: event.name,
          sort_order: event.sort_order,
          name: JSON.stringify({ en: event.name }),
          cashback: parseFloat((event.payout * networkDetails.cashback_percent*0.01).toFixed(2)),
          revenue: parseFloat(event.payout),
          import_id: import_id,
        };
      }
      return undefined;

      })
      : [];
  }).filter(task => task !== undefined);
  return tasks;
}

function getPayout(offer: any,rate:number) { 
  const totalPayout = offer.events?.reduce(
    (sum: number, event: any) => sum + parseFloat(event.payout),
    0
  );
  return totalPayout * rate * 0.01;
}

// handleNotikTasksImport()
//   .then(() => {
//     fetch(`${config.env.admin.url}/downloadTaskImage/notik`).then(() => {
//       console.log("Notik tasks imported successfully.");
//     });
//   })
//   .catch((error) => {
//     console.error("Failed to import Notik tasks:", error);
//   });

//notik only provides payout
