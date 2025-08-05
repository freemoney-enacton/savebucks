import { sql } from "kysely";
import { db } from "../../database/database";
import { date } from "zod";
export const clickInsert = async (
  userId: number,
  platform: string,
  network: string,
  task_type: string,
  task_offer_id: string,
  campaign_id: string,
  locale: string,
  countries: string,
  userAgent: string,
  ip: any,
  referer: string,
  click_code: string,
) => {
  const query = await db
    .insertInto("user_task_clicks")
    .values({
      user_id: userId,
      platform: platform,
      task_type: task_type,
      network: network,
      task_offer_id: task_offer_id,
      campaign_id: campaign_id,
      locale: locale,
      countries: countries,
      user_agent: userAgent,
      referer: referer,
      ip: ip,
      click_code:click_code
    })
    .execute();
  return query;
};
export const fetch = async (
  pageNumber: number | null,
  limit: number | null,
  network: string | null,
  task_type: string | null,
  platform: string | null,
  date: string | null,
  userId: number
) => {
  const query = await db
    .selectFrom("user_task_clicks")
    .selectAll()
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`, "=", date)
    )
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .$if(platform != null, (qb) => qb.where("platform", "=", platform))
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .where("user_id", "=", userId)
    .execute();
  const count = await db
    .selectFrom("user_task_clicks")
    .select(sql`COUNT(*)`.as("count"))
    .$if(date != null, (qb) =>
      qb.where(sql`DATE_FORMAT(clicked_on,"%m_%Y")`, "=", date)
    )
    .$if(network != null, (qb) => qb.where("network", "=", network))
    .$if(task_type != null, (qb) => qb.where("task_type", "=", task_type))
    .$if(platform != null, (qb) => qb.where("platform", "=", platform))
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return { clicks: query, count: count?.count };
};
export const clickStats = async (userId: number) => {
  const task_type_count = await db
    .selectFrom("user_task_clicks")
    .select(["task_type", sql`count(*)`.as("task_type_count")])
    .where("user_id", "=", userId)
    .groupBy("task_type")
    .execute();
  const platform_count = await db
    .selectFrom("user_task_clicks")
    .select(["platform", sql`count(*)`.as("platform_count")])
    .where("user_id", "=", userId)
    .groupBy("platform")
    .execute();
  const network_count = await db
    .selectFrom("user_task_clicks")
    .select(["network", sql`count(*)`.as("network_count")])
    .where("user_id", "=", userId)
    .groupBy("network")
    .execute();
  return {
    task_type_count,
    platform_count,
    network_count,
  };
};
export const fetchTrends = async (userId: number) => {
  const result = await db
    .selectFrom("user_task_clicks")
    .select([
      sql` SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 ELSE 0 END)`.as(
        "clickedLastDay"
      ),
      sql`SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END)`.as(
        "clickedLast30Days"
      ),
      sql` SUM(CASE WHEN clicked_on >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END)`.as(
        "clickedLast7Days"
      ),
    ])
    .where("user_id", "=", userId)
    .execute();
  return result;
};
export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_task_clicks")
    .select([
      sql`DATE_FORMAT(clicked_on,'%M_%Y')`.as("clicked_month_name"),
      sql`DATE_FORMAT(clicked_on,'%m_%Y')`.as("clicked_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};
export const taskClickUpdate = async (offer_id: string) => {
  const query = await db
    .updateTable("offerwall_tasks")
    .set("clicks", sql`clicks + 1`)
    .where("offer_id", "=", offer_id)
    .execute();
  return query;
};

export const doesClickCodeExist=async(code:string)=>{
  const query = await db
    .selectFrom("user_task_clicks")
    .select(["id"])
    .where("click_code", "=", code)
    .executeTakeFirst();
  return query;
}