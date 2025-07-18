import { sql } from "kysely";
import { db } from "../../../database/database";
import transformResponse from "../../../utils/transformResponse";
import app from "../../../app";

export const columns = {
  translatable: ["name"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: [],
};

export const lists = async (
  userId: number,
  status: "open" | "hold" | "answered" | "closed" | null,
  month_year: string | null,
  limit: number | null,
  pageNumber: number | undefined,
  lang: string
) => {
  const result = await db
    .selectFrom("user_claims")
    .leftJoin("stores", "stores.id", "user_claims.store_id")
    .select([
      "stores.name as store_name",
      "stores.logo as store_logo",
      "user_claims.id",
      "user_claims.user_id",
      "user_claims.click_id",
      "user_claims.click_code",
      "user_claims.store_id",
      "user_claims.click_time",
      "user_claims.order_id",
      "user_claims.receipt",
      "user_claims.currency",
      "user_claims.order_amount",
      "user_claims.transaction_date",
      "user_claims.platform",
      "user_claims.admin_note",
      "user_claims.status",
      "user_claims.created_at",
      "user_claims.updated_at",
    ])
    .$if(month_year != null, (qb) =>
      qb.where(
        sql`DATE_FORMAT(user_claims.created_at,"%m_%Y")`,
        "=",
        month_year
      )
    )
    .where("user_claims.user_id", "=", userId)
    .$if(pageNumber !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && pageNumber
            ? (pageNumber - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )
    .orderBy("user_claims.id", "desc") 
    .execute();

  const count = await db
    .selectFrom("user_claims")
    .select(sql`COUNT(*)`.as("count"))
    .$if(month_year != null, (qb) =>
      qb.where(sql`DATE_FORMAT(created_at,"%m_%Y")`, "=", month_year)
    )
    .$if(status != null, (qb) => qb.where("status", "=", status))
    .where("user_id", "=", userId)
    .executeTakeFirst();
  
  return { claims: result, count: count?.count };
};

export const dateFormat = async () => {
  const query = await db
    .selectFrom("user_claims")
    .select([
      sql`DATE_FORMAT(created_at,'%M_%Y')`.as("created_month_name"),
      sql`DATE_FORMAT(created_at,'%m_%Y')`.as("created_month_number"),
    ])
    .distinct()
    .execute();
  return query;
};

export const claimableClicks=async(userId:number,storeId:number,minDate:Date,maxDate:Date)=>{
  const result =await db
  .selectFrom("clicks")
  .where('user_id','=',userId)
  .where('store_id','=',storeId)
  .where('cashback_type','=','cashback')
  .where('click_time', '<=', minDate)
  .where('click_time', '>=', maxDate)
  .where('can_claim','=',1)
  .select([
    'id',
    sql`DATE_FORMAT(click_time, '%M %d, %Y %h:%i:%s %p')`.as("click_time"),
    'store_id',
    'user_id',
  ])
  .execute();
  return result;
}


export const storesWithClaimableClicks=async(userId:number,minDate:Date,maxDate:Date,lang:any,default_lang:string)=>{
  const result = await db
    .selectFrom('stores')
    .innerJoin('clicks', 'clicks.store_id', 'stores.id')
    .leftJoin('user_claims', (join) => 
      join
        .onRef('user_claims.store_id', '=', 'stores.id')
        .on('user_claims.user_id', '=', userId)
    )
    .where('clicks.user_id',"=",userId)
    .where('clicks.cashback_type','=','cashback')
    .where('clicks.click_time', '<=', minDate)
    .where('clicks.click_time', '>=', maxDate)
    .where('clicks.can_claim', '=', 1) 
    .where('stores.is_claimable', '=', 1)
    .where((eb) => eb.or([
      eb('user_claims.id', 'is', null),
    ]))
    .select([
      'stores.id',
      'stores.name',
      'stores.slug',
    ])
    .execute();
    const transformedResponse=await transformResponse(
      result,
      columns,
      default_lang,
      lang?.toString()||"en",
      null
    )
    return transformedResponse;
}

export const userExists = async (email: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};

export const insertClaim = async (
  click_id:any,
  click_code:any,
  currency:any,
  click_time:any,
  network_id:any,
  network_campaign_id:any,
  order_amount:any,
  order_id:any,
  platform:any,
  receipt:any,
  store_id:any,
  transaction_date:any,
  user_id:any,
  user_message:any
) => {
  const result = await db
    .insertInto("user_claims")
    .values({
      //admin_note, click_code,closed_by,
      click_id:click_id,
      click_code:click_code,
      click_time:click_time,
      currency:currency,
      network_id:network_id,
      network_campaign_id:network_campaign_id,
      order_amount:order_amount,
      order_id:order_id,
      platform:platform,
      receipt:receipt,
      status:"open",
      store_id:store_id,
      transaction_date:transaction_date,
      user_id:user_id,
      user_message:user_message,
      created_at: new Date(),
      updated_at:new Date()
    })
    .executeTakeFirstOrThrow();
};


export const getClaim=async(click_id:number,user_id:number)=>{
  const result = await db
      .selectFrom('user_claims')
      .where('click_id', '=', click_id)
      .where('user_id','=',user_id)
      .selectAll()
      .executeTakeFirst();
    return result
}
// get claimable clicks
// get stores that has claimable clicks
