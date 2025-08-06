import axios from "axios";
import { config } from "../../../config/config";
import { sluggify } from "../../../crons/functions/baseImportTask";
import { db } from "../../../database/database";

const imagePrefix = `${config.env.app.image_url}`;
export const fetchRevuTasks = async (
  network: any,
  userDetails: any,
  device: any,
  cip: any,
  pageNumber: any,
  pageSize: any,
  defaultLimit: any,
  platform: any,
  currency: any
) => {
  try {
    // Fetch all offers from the external API
    const response = await axios.get(
      "http://publishers.revenueuniverse.com/hotoffers_api.php",
      {
        params: {
          wall: network?.app_id,
          uid: userDetails.id,
          numoffers: defaultLimit,
          version: 2,
          ip: cip,
          device,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const offers = response.data || [];

    if (!Array.isArray(offers) || offers.length < 0) {
      throw new Error("No offers found");
    }

    // Pagination logic
    const totalOffers = offers.length;
    const totalPages = Math.ceil(totalOffers / pageSize);

    // Ensure page doesn't exceed max pages
    if (pageNumber > totalPages && totalOffers > 0) {
      throw new Error("Invalid page number");
    }

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const paginatedOffers = offers.slice(start, end);

    // Map only the current page's offers

    const mappedResponse = paginatedOffers.map((offer: any, index: number) => {
      return {
        id: start + index + 1,
        name: offer.name,
        description: offer.description,
        instructions: offer.terms + offer.extra_terms,
        network: network.code,
        task_id: offer.cid,
        offer_id: `${network.code}_${offer.cid}`,
        category_id: null,
        image: offer.image_url,
        url: offer.offer_url,
        payout:
          offer.tiers && offer.currency_award_with_tiers
            ? Number(offer.currency_award_with_tiers)
            : offer.currency_award,
        goal_url: offer.tiers ? offer.tiers_url : null,
        payout_type: "fixed",
        countries: null,
        platforms: platform,
        status: "publish",
        tier: null,
        is_featured: 0,
        banner_image: null,
        tracking_speed: null,
        slug: sluggify(network.code, offer.name, offer.cid),
        open_external_browser: network.open_task_external_browser,
        screenshot_upload: 0,
        screenshot_instructions: null,
        goals_count: null,
        goals: null,
        provider: {
          code: network.code,
          name: network.name,
          icon:
            network.icon?.includes("http") || !network.icon
              ? network.icon
              : `${imagePrefix}/${network.icon}`,
          logo:
            network.logo?.includes("http") || !network.logo
              ? network.logo
              : `${imagePrefix}/${network.logo}`,
          render_type: network.render_type,
        },
        category: {
          name: null,
          id: null,
          icon: null,
          bg_color: null,
          sort_order: null,
        },
        userDetails: userDetails,
        user_screenshot_upload: null,
        currency: currency,
      };
    });

    return { mappedResponse, pageNumber, totalPages };
  } catch (error: any) {
    console.error("Error fetching Revu offers:", error);
    throw error;
  }
};

export const fetchAyetTasks = async (
  network: any,
  userDetails: any,
  device: any,
  cip: any,
  pageNumber: any,
  pageSize: any,
  defaultLimit: any,
  platform: any,
  currency: any
) => {
  // Fetch all offers from the Ayet API
  const response = await axios.get(
    `https://www.ayetstudios.com/offers/offerwall_api/21936`,
    {
      params: {
        external_identifier: userDetails.id,
        os: device,
        ip: cip,
        num_offers: defaultLimit,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error(`API request failed with status: ${response.status}`);
  }

  const responseData = response.data;

  if (responseData.status !== "success") {
    throw new Error("API response status is not success");
  }

  const offers = responseData.offers || [];

  if (!Array.isArray(offers) || offers.length === 0) {
    throw new Error("No offers found");
  }

  // Pagination logic
  const totalOffers = offers.length;
  const totalPages = Math.ceil(totalOffers / pageSize);

  // Ensure page doesn't exceed max pages
  if (pageNumber > totalPages && totalOffers > 0) {
    throw new Error("Invalid page number");
  }

  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  const paginatedOffers = offers.slice(start, end);

  // Map only the current page's offers
  const mappedResponse = paginatedOffers.map((offer: any, index: number) => {
    return {
      id: start + index + 1,
      name: offer.name,
      description: offer.description,
      instructions:
        offer.conversion_instructions || offer.conversion_instructions_long,
      network: network.code,
      task_id: offer.id,
      offer_id: `${network.code}_${offer.id}`,
      category_id: null,
      image: offer.icon,
      url: offer.tracking_link,
      payout: Number(offer.payout),
      goal_url: offer.landing_page,
      payout_type: "fixed",
      countries: null,
      platforms: platform,
      status: "publish",
      tier: null,
      is_featured: 0,
      banner_image: offer.icon_large || null,
      tracking_speed: null,
      slug: sluggify(network.code, offer.name, offer.id),
      open_external_browser: network.open_task_external_browser,
      screenshot_upload: 0,
      screenshot_instructions: null,
      goals_count: null,
      goals: null,
      provider: {
        code: network.code,
        name: network.name,
        icon:
          network.icon?.includes("http") || !network.icon
            ? network.icon
            : `${imagePrefix}/${network.icon}`,
        logo:
          network.logo?.includes("http") || !network.logo
            ? network.logo
            : `${imagePrefix}/${network.logo}`,
        render_type: network.render_type,
      },
      category: {
        name: null,
        id: null,
        icon: null,
        bg_color: null,
        sort_order: null,
      },
      userDetails: userDetails,
      user_screenshot_upload: null,
      currency: currency,
    };
  });

  return { mappedResponse, pageNumber, totalPages };
};

export const getNetwork = async () => {
  const net = await db
    .selectFrom("settings")
    .select(["val"])
    .where("name", "=", "recommended_network")
    .executeTakeFirst();
  return net?.val;
};
