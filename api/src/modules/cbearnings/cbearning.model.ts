import { sql } from "kysely";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
import app from "../../app";

export const columns = {
  translatable: ["name", "goal_name", "network_name"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: [],
};

export const stats = async (userId: number) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "status",
      "task_type",
      "network",
      sql`COUNT(*)`.as("earnings_count"),
      sql`SUM(amount)`.as("earnings_amount"),
    ])
    .groupBy(["status", "task_type", "network"])
    .where("user_id", "=", userId)
    .execute();
  return result;
};
export const trends = async (userId: number) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .select([
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "LastDay"
      ),
      sql` SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "Last7Days"
      ),
      sql`SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "Last30Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  return result;
};

export const providerLists = async (
  userId: number,
  type: string | null,
  lang: string
) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "user_offerwall_sales.network"
    )
    .select([
      sql<string>`DISTINCT offerwall_networks.code`.as('network_code'),
      "offerwall_networks.name as network_name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
    ])
    .$if(type != null, (qb) =>
      qb.where("user_offerwall_sales.task_type", "=", type)
    )
    .where("user_offerwall_sales.status", "!=", "declined")
    .where("user_offerwall_sales.user_id", "=", userId)
    .where("offerwall_networks.hidden","=",0)
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

  return { providers: transformedData};
};

export const lists = async (
  userId: number,
  task_type: string | null,
  network: string | null,
  status: "pending" | "confirmed" | "declined" | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined,
  lang: string
) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "user_offerwall_sales.network"
    )
    .leftJoin(
      "offerwall_tasks",
      "offerwall_tasks.offer_id",
      "user_offerwall_sales.task_offer_id"
    )
    .leftJoin(
      "offerwall_task_goals",
      "offerwall_task_goals.network_goal_id",
      "user_offerwall_sales.network_goal_id"
    )
    .selectAll(["user_offerwall_sales"])
    .select([
      "offerwall_networks.name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
      
      "offerwall_tasks.image as taskImage",
      "offerwall_tasks.slug as task_slug",
      "offerwall_tasks.offer_id as task_offer_id",
      "offerwall_tasks.network as network",
      "offerwall_tasks.campaign_id as campaign_id",
      "offerwall_task_goals.network_goal_id as goal_id",
      "offerwall_task_goals.name as goal_name",
    ])
    .$if(month_year != null, (qb) =>
      qb.where(
        sql`DATE_FORMAT(user_offerwall_sales.created_at,"%m_%Y")`,
        "=",
        month_year
      )
    )
    .$if(network != null, (qb) =>
      qb.where("user_offerwall_sales.network", "=", network)
    )
    .$if(task_type != null, (qb) =>
      qb.where("user_offerwall_sales.task_type", "=", task_type)
    )
    .where("user_offerwall_sales.status", "!=", "declined")
    .where("user_offerwall_sales.user_id", "=", userId)
    .where("user_offerwall_sales.is_chargeback",'=',0)
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("created_at desc")
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

  const count = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`COUNT(*)`.as("count"))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .where("user_id", "=", userId)
    .where("status", "!=", "declined")
    .executeTakeFirst();
  return { earnings: transformedData, count: count?.count };
};


export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_offerwall_sales")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};
export const fetchBonus = async (
  userId: number,
  task_type: string | null,
  network: string | null,
  status: "pending" | "confirmed" | "declined" | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined
) => {
  const result = await db
    .selectFrom("user_bonus")
    .selectAll()
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", userId)
    .where("status", "!=", "declined")
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("created_at desc")
    .execute();
  const count = await db
    .selectFrom("user_bonus")
    .select(sql`COUNT(*)`.as("count"))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", userId)
    .where("status", "!=", "declined")
    .orderBy("created_at desc")
    .executeTakeFirst();
  return { bonuses: result, count: count?.count };
};
export const fetchChargeBacks = async (
  userId: number,
  task_type: string | null,
  network: string | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined,
  lang: string
) => {
  const result = await db
    .selectFrom("user_offerwall_sales")
    .leftJoin(
      "offerwall_networks",
      "offerwall_networks.code",
      "user_offerwall_sales.network"
    )
    .leftJoin(
      "offerwall_tasks",
      "offerwall_tasks.offer_id",
      "user_offerwall_sales.task_offer_id"
    )
    .selectAll(["user_offerwall_sales"])
    .select([
      "offerwall_networks.name",
      "offerwall_networks.logo as network_logo",
      "offerwall_networks.icon as network_icon",
      "offerwall_tasks.image as taskImage",

      "offerwall_tasks.slug as task_slug",
      "offerwall_tasks.offer_id as task_offer_id",
      "offerwall_tasks.network as network",
      "offerwall_tasks.campaign_id as campaign_id",
    ])
    .$if(month_year != null, (qb) =>
      qb.where(
        sql`DATE_FORMAT(user_offerwall_sales.created_at,"%m_%Y")`,
        "=",
        month_year
      )
    )
    .$if(network != null, (qb) =>
      qb.where("user_offerwall_sales.network", "=", network)
    )
    .$if(task_type != null, (qb) =>
      qb.where("user_offerwall_sales.task_type", "=", task_type)
    )
    .where("user_offerwall_sales.is_chargeback", "=", 1)
    .where("user_offerwall_sales.user_id", "=", userId)
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("created_at desc")
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
  const count = await db
    .selectFrom("user_offerwall_sales")
    .select(sql`COUNT(*)`.as("count"))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .where("is_chargeback", "=", 1)
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return { chargeBacks: transformedData, count: count?.count };
};
