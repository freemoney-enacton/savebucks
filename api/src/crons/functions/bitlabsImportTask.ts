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

export async function handleBitlabsTasksImport() {
  const networkDetails = await getNetworkDetails("bitlabs");
  const apiUrl = "https://api.bitlabs.ai/v2/publishers/offers";
  let offset = 500;
  let limit = 1000;
  let continueFetching = false;
  let import_id = "bitlabs_" + new Date().toISOString();

  do {
    const headers = {
      "X-S2S-Token": networkDetails.api_key,
    };
    const response = await axios.get(apiUrl, {
      headers,
      params: { limit, skip: offset },
    });

    if (response.status !== 200) {
      throw new Error("API request failed with status: " + response.status);
    }

    const data: { status: string; data: { offers: any[] } } = response.data;
    if (data.status !== "success") {
      throw new Error("Bitlabs API Exception");
    }

    const offers = data.data.offers;
    if (offers.length > 0) {
      const transformedTaskData = await transformResponse(
        offers,
        networkDetails,
        import_id
      );
      const networkGoals = transformGoals(offers, import_id);
      UpsertData(transformedTaskData);
      UpsertGoalsData(networkGoals);
    }

    offset = limit + offset;
    continueFetching = offers.length === limit;
  } while (continueFetching);
  RemoveTaskAndGoals("bitlabs", import_id);
}

async function transformResponse(
  offers: any[],
  networkDetails: any,
  import_id: string
) {
  const tasks = offers.map(async (offer: any) => ({
    network: "bitlabs",
    offer_id: `bitlabs_${offer.id}`,
    campaign_id: offer.id,
    name: JSON.stringify({ en: offer.anchor }),
    slug: sluggify(networkDetails.code, offer.name, offer.id),
    description: JSON.stringify({ en: offer.description }),
    instructions: JSON.stringify({
      en: offer.requirements.replace(/<\s*\/\s*/g, "</"),
    }),
    network_image: offer.icon,
    payout: getPayout(offer, Number(networkDetails.cashback_percent)),
    url: offer.click_url + "#USER_ID",
    countries: JSON.stringify(
      cleanCountries(
        offer.geo_targeting.countries.map((c: any) => c.country_code)
      )
    ),
    devices: JSON.stringify(
      cleanDevices(offer.device_targeting.operating_systems)
    ),
    platforms: JSON.stringify(
      getPlatformFromDevice(
        offer.device_targeting.operating_systems.map((os: any) => os.name)
      )
    ),
    conversion_rate: offer.conversion_rate ?? 0,
    network_categories: JSON.stringify(offer.categories) ?? null,
    network_goals: JSON.stringify(
      offer.events.map((event: any) => ({
        id: event.id,
        name: event.name,
        payout: parseFloat(event.payout),
        cashback: parseFloat((event.payout * 0.5).toFixed(2)),
      }))
    ),
    goals_count: offer.events.length,
    category_id: await determineAndAssignCategoryToTask(offer),
    import_id: import_id,
  }));

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
          network: "bitlabs",
          task_offer_id: `bitlabs_${offer.id}`,
          network_task_id: offer.id,
          network_goal_id: event.id,
          network_goal_name: event.name,
          sort_order: event.sort_order,
          name: JSON.stringify({ en: event.name }),
          cashback: Number(event.payout) * 0.5,
          revenue: event.payout,
          import_id: import_id,
        }))
        : [
          {
            network: "bitlabs",
            task_offer_id: `bitlabs_${offer.id}`,
            network_task_id: offer.id,
            network_goal_id: offer.events.id,
            network_goal_name: offer.events.name,
            name: JSON.stringify({ en: offer.events.name }),
            cashback: Number(offer.events.payout) * 0.5,
            revenue: offer.events.payout,
            import_id: import_id,
          },
        ];
    });
  return tasks;
}
function getPayout(offer: any, rate: number) {
  const totalPayout = offer.events.reduce(
    (sum: number, event: any) => sum + parseFloat(event.payout),
    0
  );
  return totalPayout * rate * 0.01;
}

handleBitlabsTasksImport()
  .then(() => {
    // check below api is called or not

    fetch(`${config.env.admin.url}/downloadTaskImage/bitlabs`).then((data) => {
      console.log("bitlabs tasks imported successfully.");
    });
  })
  .catch((error) => {
    console.error("Failed to import Bitlabs tasks:", error);
  });
