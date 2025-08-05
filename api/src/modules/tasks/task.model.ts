import { collect } from "collect.js";
import { QueryCreator, sql } from "kysely";
import app from "../../app";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
import { getSetCachedData } from "../../utils/getCached";

export const columns = {
  translatable: ["Name", "description", "name", "instructions", "network_name"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: ["created_at", "updated_at", "start_date", "end_date"],
};

export const getUserTaskGoalsStatus = async (network: string, campaign_id: string, user_id: number, lang: string) => {
  const networkGoals = await db.selectFrom("offerwall_task_goals")
    .select([
      "network_goal_id as id",
      "network_goal_id",
      "name",
      "cashback",
      "task_offer_id",
    ])
    .where("network", "=", network)
    .where("status", "=", 'publish')
    .where("network_task_id", "=", campaign_id)
    .where("revenue", "<>", '0')
    .orderBy("sort_order asc")
    .execute();

  const userNetworkGoals = await db.selectFrom("user_offerwall_sales")
    .select([
      "network",
      "offer_id",
      "transaction_id",
      "network_goal_id",
      "status"
    ])
    .where("network", "=", network)
    .where("offer_id", "=", campaign_id)
    .where("user_id", "=", user_id)
    .where("status", "=", "confirmed")
    .execute();

  const completedGoals = new Set(userNetworkGoals.map(goal => goal.network_goal_id));

  let foundFirstPending = false;

  for (let i = 0; i < networkGoals.length; i++) {
    const goal = networkGoals[i];

    if (completedGoals.has(goal.network_goal_id)) {
      // @ts-ignore
      goal.user_status = 'completed';
    } else if (!foundFirstPending) {
      // @ts-ignore
      goal.user_status = 'pending';
      foundFirstPending = true;
    } else {
      // @ts-ignore
      goal.user_status = 'not_started';
    }
  }

  const currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      networkGoals,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return transformedData;
  }

  return networkGoals;
}

export const findCategoryId = async (slug: string) => {
  const result = await db
    .selectFrom("offerwall_categories")
    .select(["id"])
    .where("slug", "=", slug)
    .executeTakeFirst();
  return result;
};

export const recommended = async (
  name: string | null,
  platform: string[] | null,
  lang: string,
  countries: string,
  pageNumber: number | null,
  limit: number | null,
) => {
  getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  const result = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
      "offerwall_networks.open_task_external_browser",
      "offerwall_networks.render_type",
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .$if(name != null, (qb) =>
      qb.where(sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.countries, JSON_ARRAY(${countries}))`)
    )
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("offerwall_tasks.redemptions", "desc")
    .orderBy("offerwall_tasks.clicks", "desc")
    .orderBy(sql`(offerwall_tasks.redemptions/offerwall_tasks.clicks)`, "desc")
    .where("offerwall_tasks.status", "=", "publish")
    .where("offerwall_networks.enabled", '=', 1)
    .execute();

  const count = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([sql`COUNT(*)`.as("task_count")])
    .$if(name != null, (qb) =>
      qb.where(sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.countries, JSON_ARRAY(${countries}))`)
    )
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("offerwall_tasks.redemptions", "desc")
    .orderBy("offerwall_tasks.clicks", "desc")
    .orderBy(sql`(offerwall_tasks.redemptions/offerwall_tasks.clicks)`, "desc")
    .where("offerwall_tasks.status", "=", "publish")
    .where("offerwall_networks.enabled", '=', 1)
    .executeTakeFirst();


  const currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      result,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return { transformedData, count: count?.task_count ?? 0 };
  }
}

export const vip = async (
  name: string | null,
  platform: string[] | null,
  lang: string,
  countries: string,
  userTier: number
) => {
  getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );

  const result = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
      "offerwall_networks.open_task_external_browser",
      "offerwall_networks.render_type",
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .$if(name != null, (qb) =>
      qb.where(sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`JSON_OVERLAPS(offerwall_tasks.countries, JSON_ARRAY(${countries}))`)
    )
    .orderBy("offerwall_tasks.redemptions", "desc")
    .orderBy("offerwall_tasks.clicks", "desc")
    .orderBy(sql`(offerwall_tasks.redemptions/offerwall_tasks.clicks)`, "desc")
    .where("offerwall_tasks.status", "=", "publish")
    .where("offerwall_networks.enabled", '=', 1)
    .where("offerwall_tasks.tier", ">", userTier)
    .execute();

  const currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      result,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return transformedData;
  }
}


export const list = async (
  name: string | null,
  sort_by: string | null,
  countries: string[] | null,
  pageNumber: number | null,
  limit: number | null,
  platform: string[] | null,
  featured: number | null,
  recommended: number | null,
  network: string | null,
  category: number | null,
  lang: string
) => {
  getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  const networkArray = network ? network.split(',').map(n => n.trim()) : null;
  const count = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([sql`COUNT(*)`.as("task_count")])

    .$if(name != null, (qb) =>
      qb.where(
        sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`
      )
    )
    .$if(networkArray != null && networkArray.length > 0, (qb) =>
      qb.where("offerwall_tasks.network", "in", networkArray)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`
  JSON_OVERLAPS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`
  JSON_OVERLAPS(offerwall_tasks.countries, JSON_ARRAY(${countries}))
`)
    )
    .$if(featured != null, (qb) =>
      qb.where("offerwall_tasks.is_featured", "=", featured)
    )
    .$if(recommended != null, (qb) =>
      qb
        .orderBy("offerwall_tasks.redemptions", "desc")
        .orderBy("offerwall_tasks.clicks", "desc")
        .orderBy(sql`(offerwall_tasks.redemptions/offerwall_tasks.clicks)`, "desc")
    )
    .$if(sort_by === "highest_reward", (qb) =>
      qb.orderBy("offerwall_tasks.payout", "desc")
    )
    .$if(sort_by === "lowest_reward", (qb) =>
      qb.orderBy("offerwall_tasks.payout", "asc")
    )
    .$if(sort_by === "popular", (qb) =>
      qb.orderBy("offerwall_tasks.clicks", "desc")
    )
    .$if(sort_by === "latest_featured", (qb) =>
      qb
        .orderBy("is_featured", "desc")
        .orderBy("offerwall_tasks.created_at", "desc")
    )
    .$if(category != null, (qb) =>
      qb.where("offerwall_tasks.category_id", "=", category)
    )
    .where("offerwall_tasks.status", "=", "publish")
    .where("offerwall_networks.enabled", '=', 1)
    // .orderBy("offerwall_tasks.id", "asc")
    .executeTakeFirst();
  const result = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.logo as network_icon",
      "offerwall_networks.open_task_external_browser",
      "offerwall_networks.render_type",
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])

    .$if(name != null, (qb) =>
      qb.where(
        sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`
      )
    )
    .$if(networkArray != null && networkArray.length > 0, (qb) =>
      qb.where("offerwall_tasks.network", "in", networkArray)
    )
    .$if(platform?.length != null, (qb) =>
      qb.where(sql<any>`
    JSON_OVERLAPS(offerwall_tasks.platforms, JSON_ARRAY(${platform}))`)
    )
    .$if(countries != null, (qb) =>
      qb.where(sql<any>`
    JSON_OVERLAPS(offerwall_tasks.countries, JSON_ARRAY(${countries}))
`)
    )
    .$if(featured != null, (qb) =>
      qb.where("offerwall_tasks.is_featured", "=", featured)
    )
    .$if(recommended != null, (qb) =>
      qb
        .orderBy("offerwall_tasks.clicks", "desc")
        .orderBy("offerwall_tasks.payout", "desc")
    )
    .$if(sort_by === "highest_reward", (qb) =>
      qb.orderBy("offerwall_tasks.payout", "desc")
    )
    .$if(sort_by === "lowest_reward", (qb) =>
      qb.orderBy("offerwall_tasks.payout", "asc")
    )
    .$if(sort_by === "popular", (qb) =>
      qb.orderBy("offerwall_tasks.clicks", "desc")
    )
    .$if(sort_by === "latest_featured", (qb) =>
      qb
        .orderBy("is_featured", "desc")
        .orderBy("offerwall_tasks.created_at", "desc")
    )
    .$if(category != null, (qb) =>
      qb.where("offerwall_tasks.category_id", "=", category)
    )
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .where("offerwall_tasks.status", "=", "publish")
    .where("offerwall_networks.enabled", '=', 1)
    // .orderBy("offerwall_tasks.id", "asc")
    .execute();
  const currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      result,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return { transformedData, count: count?.task_count };
  }
};

export const details = async (
  network: string,
  task_id: string,
  userId: number,
  lang: string
) => {
  const goals = await db
    .selectFrom("offerwall_task_goals")
    .select(sql`COUNT(*)`.as("task_goals"))
    .where("revenue", "<>", '0')
    .where("task_offer_id", "=", `${network}_${task_id}`)
    .executeTakeFirst();
  const completedGoals = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`COUNT(*)`.as("completed_goals"))
    .where("task_offer_id", "=", `${network}_${task_id}`)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  const task = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.goals_count",
      "offerwall_tasks.network_goals",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.screenshot_instructions",
      "offerwall_tasks.screenshot_upload",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.render_type",
      "offerwall_networks.open_task_external_browser",
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .where("offerwall_tasks.offer_id", "=", `${network}_${task_id}`)
    .executeTakeFirst();
  let currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      task,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return {
      ...transformedData,
      status:
        Number(completedGoals?.completed_goals) == 0
          ? "not_started"
          : Number(goals?.task_goals) > Number(completedGoals?.completed_goals)
            ? "pending"
            : Number(goals?.task_goals) == Number(completedGoals?.completed_goals)
              ? "completed"
              : "not_started",
    };
  }
};
export const detailsBySlug = async (
  slug: string,
  userId: number,
  lang: string
) => {
  const task = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.goals_count",
      "offerwall_tasks.network_goals",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.screenshot_instructions",
      "offerwall_tasks.screenshot_upload",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
      "offerwall_networks.open_task_external_browser",
      "offerwall_networks.render_type",
      'offerwall_networks.sub_id',
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .where("offerwall_tasks.slug", "=", `${slug}`)
    .executeTakeFirst();

  let network = task?.network;
  let campaign_id = task?.campaign_id;

  const goals = await db
    .selectFrom("offerwall_task_goals")
    .select(sql`COUNT(*)`.as("task_goals"))
    .where("revenue", "<>", '0')
    .where("task_offer_id", "=", `${network}_${campaign_id}`)
    .executeTakeFirst();
  const completedGoals = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`COUNT(*)`.as("completed_goals"))
    .where("task_offer_id", "=", `${network}_${campaign_id}`)
    .where("user_id", "=", userId)
    .executeTakeFirst();

  let currency = await app.redis.get("default_currency");
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      task,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return {
      ...transformedData,
      status:
        Number(completedGoals?.completed_goals) == 0
          ? "not_started"
          : Number(goals?.task_goals) > Number(completedGoals?.completed_goals)
            ? "pending"
            : Number(goals?.task_goals) == Number(completedGoals?.completed_goals)
              ? "completed"
              : "not_started",
    };
  }
};

export const activeTaskProviders = async (
  userId: number,
  lang: string
) => {
  // const result = await db
  //   .selectFrom("user_task_clicks")
  //   .leftJoin(
  //     "offerwall_networks",
  //     "offerwall_networks.code",
  //     "user_task_clicks.network"
  //   )
  //   .select([
  //     sql<string>`DISTINCT offerwall_networks.code`.as('network_code'),
  //     "offerwall_networks.name as network_name",
  //     "offerwall_networks.logo as network_logo",
  //     "offerwall_networks.icon as network_icon",
  //   ])
  //   .where("user_task_clicks.user_id", "=", userId)
  //   .execute();


  // return { providers: result};

  const result = await db
    .selectFrom("offerwall_networks")
    .select([
      "code as network_code",
      "name as network_name",
      "logo as network_logo",
      "icon as network_icon",
    ])
    .execute();

  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  const transformedData = await transformResponse(
    result,
    columns,
    fallback_lang?.val,
    lang,
    null
  );

  return { providers: transformedData };
}

export const userActiveTask = async (
  name: string | null,
  userId: number,
  lang: string,
  network: string,
  pageNumber: any,
  limit: any
) => {
  const clickedTask = await db
    .selectFrom("user_task_clicks")
    .select(["task_offer_id", "clicked_on"])
    .where("user_id", "=", userId)
    .orderBy("clicked_on desc")
    .execute();

  const taskOfferIds = clickedTask.map((uc) => ({
    id: uc.task_offer_id,
    clickedOn: uc.clicked_on,
  }));

  if (taskOfferIds.length == 0) {
    return null;
  }
  const offerIds = taskOfferIds.map((t) => t.id);

  const completedGoals = await db
    .selectFrom("user_offerwall_sales")
    .select(["task_offer_id", sql`COUNT(*)`.as("completed_goals")])
    .where("user_id", "=", userId)
    .groupBy("task_offer_id")
    .where("task_offer_id", "in", offerIds)
    .execute();

  const completedGoalsMap = new Map(
    completedGoals.map((item) => [item.task_offer_id, item.completed_goals])
  );
  const paginateTasks = (tasks: any[], pageNumber: any, limit: any) => {
    // Calculate the starting index
    const startIndex = (pageNumber - 1) * limit;
    // Slice the  array from the startIndex up to the startIndex + limit
    return tasks.slice(startIndex, startIndex + limit);
  };
  const activeTasksDetails = await db
    .selectFrom(["offerwall_tasks"])
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "offerwall_tasks.network"
    )
    .leftJoin(
      "offerwall_categories",
      "offerwall_categories.id",
      "offerwall_tasks.category_id"
    )
    .select([
      "offerwall_tasks.id as task_id",
      "offerwall_tasks.name as Name",
      "offerwall_tasks.description",
      "offerwall_tasks.instructions",
      "offerwall_tasks.network",
      "offerwall_tasks.offer_id",
      "offerwall_tasks.campaign_id",
      "offerwall_tasks.category_id",
      "offerwall_tasks.goals_count",
      "offerwall_tasks.image",
      "offerwall_tasks.url",
      "offerwall_tasks.countries",
      "offerwall_tasks.platforms",
      "offerwall_tasks.payout",
      "offerwall_tasks.payout_type",
      "offerwall_tasks.is_featured",
      "offerwall_tasks.tier",
      "offerwall_tasks.banner_image",
      "offerwall_tasks.slug",
      "offerwall_tasks.tracking_speed",
      "offerwall_tasks.app_open_external_browser",
      "offerwall_networks.code",
      "offerwall_networks.name as network_name",
      "offerwall_networks.support_url",
      "offerwall_networks.icon as network_icon",
      "offerwall_networks.logo as network_logo",
      "offerwall_categories.id",
      "offerwall_categories.icon as category_icon",
      "offerwall_categories.name as name",
      "offerwall_categories.bg_color",
      "offerwall_categories.sort_order",
    ])
    .$if(name != null, (qb) =>
      qb.where(sql<any>`JSON_SEARCH(LOWER(offerwall_tasks.name), 'one', LOWER(${name}))   IS NOT NULL`)
    )
    .$if(network != null, (qb) =>
      qb.where("offerwall_networks.code", "=", network)
    )
    .where("offer_id", "in", offerIds)
    .execute();
  // Attach `clicked_on` time to each task detail based on `offer_id`
  const taskDetailsWithClickedOn = activeTasksDetails.map((task) => {
    const taskClickInfo = taskOfferIds.find((t) => t.id === task.offer_id);
    return {
      ...task,
      clicked_on: taskClickInfo ? taskClickInfo.clickedOn : null,
    };
  });
  // Apply your existing filter logic
  const filteredActiveTasks = taskDetailsWithClickedOn.filter((task: any) => {
    const completed: any = completedGoalsMap.has(task.offer_id)
      ? completedGoalsMap.get(task.offer_id)
      : 0;
    return (
      task.goals_count > completed || !completedGoalsMap.has(task.offer_id)
    );
  });

  const sortedActiveTasks = filteredActiveTasks.sort((a, b) => {
    // Handle null values (items without clicked_on timestamps)
    if (!a.clicked_on) return 1;  // Push items without timestamp to the end
    if (!b.clicked_on) return -1; // Keep items with timestamp at the beginning

    // Compare timestamps (newer first)
    return new Date(b.clicked_on).getTime() - new Date(a.clicked_on).getTime();
  });
  // Your existing pagination function
  const paginatedTasks = paginateTasks(
    sortedActiveTasks,
    pageNumber ? pageNumber : 1,
    limit ? limit : 20
  );
  // Transform and return data as before
  let currency = await app.redis.get("default_currency");
  const count = filteredActiveTasks.length;
  //@ts-ignore
  const fallback_lang = JSON.parse(await app.redis.get("fallback_lang"));
  if (currency) {
    const transformedData = await transformResponse(
      paginatedTasks,
      columns,
      fallback_lang?.val,
      lang,
      currency
    );
    return { transformedData, count };
  }
};

export const insert = async (
  network: string,
  offer_id: string,
  platform: string,
  upload_path: string,
  user_id: number
) => {
  const result = await db
    .insertInto("user_task_uploads")
    .values({
      network: network,
      offer_id: offer_id,
      platform: platform,
      task_offer_id: `${network}_${offer_id}`,
      upload_path: upload_path,
      user_id: user_id,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now())
    })
    .executeTakeFirstOrThrow()
  return result
}

export const fetchUserUpload = async (
  user_Id: number,
  network: string,
  campaign_Id: string
) => {
  const result = await db
    .selectFrom("user_task_uploads")
    .selectAll()
    .where("user_id", "=", user_Id)
    .where("task_offer_id", "=", `${network}_${campaign_Id}`)
    .executeTakeFirst()
  return result
}
