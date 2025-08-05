import { sql } from "kysely";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";

export const fetch = async (offset: number, limit: number) => {
  const result = await db
    .selectFrom("users")
    .select(["id", "name"])
    .offset(offset)
    .limit(limit)
    .orderBy("id", "asc")
    .execute();
  return result;
};
export const deleteUser = async (id: number) => {
  const nullifyPayment = await db
    .updateTable("user_payments")
    .set({
      payment_input: "{}",
    })
    .where("user_id", "=", id)
    .execute();
  const userMasked = await db
    .updateTable("users")
    .set({
      name: sql<any>`CONCAT('***',name)`,
      email: sql<any>`CONCAT('***',email)`,
      is_deleted: 1,
      deleted_at: new Date(),
    })
    .where("id", "=", id)
    .execute();
  if (!userMasked && !nullifyPayment) {
    return false;
  }
  return true;
};
export const findUser = async (id: number) => {
  const result = await db
    .selectFrom("users")
    .select([
      "id",
      "name",
      "email",
      "phone_no",
      "referral_code",
      "is_email_verified",
      "is_phone_no_verified",
      "status",
      "country_code",
      "is_private",
      "referrer_code",
      "created_at",
      "provider_type",
      "current_tier",
      "affiliate_commission",
      "affiliate_earnings",
      "promotion_update",
      "total_tokens",
      "current_level",
      "current_level_tokens",
      "kyc_verified",
      "kyc_verification_status",
      "kyc_verified_at",
      "avatar"
    ])
    .where("id", "=", id)
    .executeTakeFirst();
  if (!result) {
    return null;
  }
  if (result?.referrer_code) {
    const userReferrer = await db
      .selectFrom("users")
      .select("name")
      .where("referral_code", "=", result?.referrer_code)
      .executeTakeFirst();
    return { ...result, referrerName: userReferrer?.name };
  } else {
    return { ...result, referrerName: null };
  }
};

export const getTierInfo = async (tier: number | null) => {
  const result = await db
    .selectFrom("tiers")
    .select([
      "tier",
      "label",
      "icon",
      "affiliate_commission",
      "required_affiliate_earnings",
    ])
    .where("tier", "=", tier)
    .executeTakeFirst();
  if (!result) return null;
  return result;
};

export const updateEmailPhone = async (
  id: number,
  email?: string,
  phone_no?: string
) => {
  if (email != undefined || email != null) {
    const result = await db
      .updateTable("users")
      .set({
        email: email,
      })
      .where("id", "=", id)
      .execute();
    return result;
  }
  if (phone_no != undefined || phone_no != null) {
    const result = await db
      .updateTable("users")
      .set({
        phone_no: phone_no,
      })
      .where("id", "=", id)
      .execute();
    return result;
  }
};
export const updateUser = async (
  id: number,
  email?: string,
  phone_no?: string,
  name?: string,
  is_private?: boolean,
  promotion_update?: boolean,
  lang?: string,
  avatar?:string,
) => {
  const result = await db
    .updateTable("users")
    .set({
      name: name,
      email: email,
      phone_no: phone_no,
      avatar:avatar,
      lang
    })
    .where("id", "=", id)
    .execute();
  return result;
};

export const updateUserSettings = async (
  id: number,
  is_private?: boolean,
  promotion_update?: boolean,
  country_code?: string
) => {
  const result = await db
    .updateTable("users")
    .set({
      is_private: Number(is_private),
      promotion_update: Number(promotion_update),
      country_code: country_code,
    })
    .where("id", "=", id)
    .execute();
  return result;
};
export const referCodeUser = async (referCode: string) => {
  const result = await db
    .selectFrom("users")
    .select(["id"])
    .where(sql<any>`referral_code COLLATE utf8mb4_bin =${referCode}`)
    .executeTakeFirst();
  return result;
};

export const searchUserWithQuery = async (q: string) => {
  const result = await db
    .selectFrom("users")
    .innerJoin("tiers","tiers.tier", "users.current_tier")
    .select([
      "users.id",
      "users.name",
      "users.referral_code",
      "users.country_code",
      "users.is_private",
      "users.current_tier",
      "tiers.icon as tier_icon",
      "tiers.label as tier_label",
      "tiers.tier as tier_tier",
    ])
    .where('deleted_at', 'is', null)
    .where('status','=','active')
    .where("name", "like", `%${q}%`)
    .limit(10)
    .execute();
  return result;
};

export const getUserFromReferCode = async (referCode: string) => {
  const result = await db
    .selectFrom("users")
    .select([
      "id",
      "name",
      "phone_no",
      "avatar",
      "referral_code",
      "country_code",
      "is_private",
      "created_at",
      "current_tier",
    ])
    .where(sql<any>`referral_code COLLATE utf8mb4_bin =${referCode}`)
    .executeTakeFirst();
  return result;
};

export const existingReferCode = async (referCode: string) => {
  const userReferCode = await db
    .selectFrom("users")
    .select("referral_code")
    .where("referral_code", "=", referCode)
    .executeTakeFirst();
  return userReferCode;
};

export const updateReferCode = async (userId: number, referCode: string) => {
  const userReferCode = await db
    .selectFrom("users")
    .select("referral_code")
    .where("id", "=", userId)
    .executeTakeFirst();
  if (userReferCode?.referral_code) {
    await db
      .updateTable("users")
      .set({
        referrer_code: referCode,
      })
      .where("referrer_code", "=", userReferCode?.referral_code)
      .execute();
  }
  const result = await db
    .updateTable("users")
    .set({
      referral_code: referCode,
    })
    .where("id", "=", userId)
    .execute();
  return result;
};

// export const checkPaymentMode = (userId: number, account: string) => {
//   const result = db
//     .selectFrom("user_payment_modes")
//     .select(["id", "name", "account", "payment_inputs", "enabled"])
//     .where("user_id", "=", userId)
//     .where("account", "=", account)
//     .executeTakeFirst();
//   return result;
// };
// export const addPaymentMode = (
//   userId: number,
//   name: string,
//   account: string,
//   payment_inputs: string,
//   enabled: number,
//   payment_method_code: string
// ) => {
//   const result = db
//     .insertInto("user_payment_modes")
//     .values({
//       user_id: userId,
//       name: name,
//       payment_method_code: payment_method_code,
//       account: account,
//       payment_inputs: payment_inputs,
//       enabled: enabled,
//     })
//     .execute();
//   return result;
// };
export const getPaymentMode = async (userId: number, methodCode: string) => {
  const result = await db
    .selectFrom("user_payments")
    .select(["account", "payment_input", "payment_method_code"])
    .where("user_id", "=", userId)
    .where("payment_method_code", "=", methodCode)
    .orderBy("created_at desc")
    .executeTakeFirst();
  return result;
};
export const getNotification = async (
  userID: number,
  default_lang: string,
  lang: string
) => {
  const columns = {
    translatable: ["message"],
    money: [],
    date: [],
  };
  const result = await db
    .selectFrom("user_notifications")
    .select(["id", "message", "meta_data", "is_read", "created_at","route"])
    .where("user_id", "=", userID)
    .orderBy("is_read asc")
    .orderBy("created_at desc")
    .execute();
  const transformedResponse = await transformResponse(
    result,
    columns,
    default_lang,
    lang,
    null
  );
  return transformedResponse;
};

export const readNotification = async (id: any, userId: any) => {
  const result = await db
    .updateTable("user_notifications")
    .set({ is_read: 1 })
    .where("user_id", "=", userId)
    .where("id", "=", id)
    .executeTakeFirst();
  return result;
};
export const readAllNotification = async (userId: any) => {
  const result = await db
    .updateTable("user_notifications")
    .set({ is_read: 1 })
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return result;
};

export const findByPhone = async (phone_no: any, ignore_user_id: any) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("id", "!=", ignore_user_id)
    .where("phone_no", "=", phone_no)
    .where("phone_no","!=",null)
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};
export const findByEmail = async (email: any) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};

export const getUserPublicStats = async (user_id: any, refer_code: any) => {
  const offersCompleted = await db
    .selectFrom("user_offerwall_sales")
    // @ts-ignore
    .select([sql`count(DISTINCT task_offer_id) as offer_count`])
    .where("user_id", "=", user_id)
    .executeTakeFirst();

  const lifetimeEarnings = await db
    .selectFrom("user_offerwall_sales")
    // @ts-ignore
    .select([sql`sum(amount) as lifetime_earnings`])
    .where("status", "=", "confirmed")
    .where("user_id", "=", user_id)
    .executeTakeFirst();

  const referredUserCount = await db
    .selectFrom("users")
    // @ts-ignore
    .select([sql`count(*) as referred_user`])
    .where("referrer_code", "=", refer_code)
    .executeTakeFirst();

  const referralEarningLifetime = await db
    .selectFrom("user_referral_earnings")
    // @ts-ignore
    .select([sql`sum(referral_amount) as referral_earning`])
    .where("user_id", "=", user_id)
    .executeTakeFirst();

  return {
    offer_count: offersCompleted?.offer_count ?? 0,
    lifetime_earnings: lifetimeEarnings?.lifetime_earnings ?? 0,
    referred_user: referredUserCount?.referred_user ?? 0,
    referral_earning: referralEarningLifetime?.referral_earning ?? 0,
  };
};

export const getUserPublicActivities = async (
  user_id: any,
  pageNumber: number | null,
  limit: number | null
) => {
  console.log(user_id)
  return await sql<any>`
      SELECT 
      CASE 
          WHEN ut.name IS NOT NULL THEN ut.name
          ELSE JSON_OBJECT('en', uos.task_name)
      END as name,
      CASE 
          WHEN ut.image IS NOT NULL THEN ut.image
          ELSE nt.icon
      END as image,
      ut.description,
      ut.instructions,
      ut.network,
      ut.offer_id,
      ut.campaign_id,
      ut.category_id,
      CASE 
          WHEN ut.url IS NOT NULL THEN ut.url
          ELSE nt.offer_url
      END as url,
      ut.countries,
      ut.platforms,
      ut.payout,
      ut.slug,
      ut.is_featured,
      ut.tier,
      uos.task_offer_id as task_offer_id,
      uos.task_type as task_type,
      SUM(uos.amount) as earning,
      MAX(uos.created_at) as last_activity
  FROM 
      user_offerwall_sales as uos 
  LEFT JOIN 
      offerwall_tasks as ut 
  ON 
      uos.task_offer_id = ut.offer_id  
  LEFT JOIN
      offerwall_networks as nt
  ON 
      uos.network=nt.code
  WHERE 
      uos.user_id = ${user_id}
  AND task_type = "tasks"
  GROUP BY 
      uos.task_offer_id,
      uos.task_name,
      ut.name,
      ut.image,
      ut.description,
      ut.instructions,
      ut.network,
      ut.offer_id,
      ut.campaign_id,
      ut.category_id,
      ut.url,
      ut.countries,
      ut.platforms,
      ut.payout,
      ut.slug,
      ut.is_featured,
      ut.tier,
      uos.task_type,
      nt.icon,
      nt.offer_url
  ORDER BY 
      last_activity DESC 
    LIMIT ${limit} OFFSET ${(pageNumber || 0) * (limit || 0)}
  `.execute(db);
};
export const getUserPublicActivitiesCount = async (user_id: any) => {
  return await sql<any>`
    SELECT count(DISTINCT task_offer_id) as count 
    FROM user_offerwall_sales 
    WHERE user_id = ${user_id} 
    AND task_name is not null
  `.execute(db);
};

export const getUserPublicActivitiesSurvey=async(
  user_id: any,
  pageNumber: number | null,
  limit: number | null
)=>{
  return await sql<any>`
  SELECT 
    u.task_name as name, 
    o.icon as image,  
    NULL as description,
    NULL as instructions,
    u.network,
    u.task_offer_id as offer_id,
    u.offer_id as campaign_id,
    NULL as category_id,
    o.survey_url as url,
    NULL as countries,
    NULL as platforms,
    u.payout,
    NULL as slug,
    NULL as is_featured,
    NULL as tier, 
    u.task_offer_id as task_offer_id, 
    u.task_type as task_type,
    sum(u.amount) as earning, 
    max(u.created_at) as last_activity 
    FROM user_offerwall_sales as u
    LEFT JOIN offerwall_networks as o
    on u.network =o.code
    WHERE user_id = ${user_id} 
    AND task_type = "surveys"
    AND task_name is not null
    GROUP BY 
    u.task_name, 
    o.icon,
    description,
    instructions,
    u.network,
    u.task_offer_id,
    u.offer_id,
    category_id,
    url,
    countries,
    platforms,
    u.payout,
    slug,
    is_featured,
    u.task_type
    ORDER BY last_activity DESC 
    LIMIT ${limit} OFFSET ${(pageNumber || 0) * (limit || 0)}
  `.execute(db)
};

export const getUnreadNotificationsCount = async (user_id: number) => {
  const result = await db
    .selectFrom('user_notifications')
    .where('user_id', '=', user_id)
    .where('is_read', '=', 0)
    .select(db.fn.count<number>('id').as('count')) // assuming `id` is your primary key
    .executeTakeFirst();

  return result
};
export const incrementMentionCount = async (user_id: number): Promise<void> => {
  await db
    .updateTable('users')
    .set({
      mentions_count: sql<number>`mentions_count + 1`,
    })
    .where('id', '=', user_id)
    .executeTakeFirst();
};
export const resetMentionsCount=async(user_id:number)=>{
  await db
    .updateTable('users')
    .set({
      mentions_count: sql<number>`0`,
    })
    .where('id', '=', user_id)
    .executeTakeFirst();
}
export const fetchMentions = async (user_id: number) => {
  const result =await db
    .selectFrom('users')
    .select(['mentions_count as count'])
    .where('id', '=', user_id)
    .executeTakeFirst();

    return result 
};

export const saveNotification = async (userId: number, notificationId: string) => {
  const resuilt=await db
    .updateTable("users") 
    .set({
      onesignal_notification_id: notificationId,
    })
    .where("id", "=", userId)
    .executeTakeFirst();
  return resuilt
}

export const clearOneSignalNotificationId=async (userId: number) => {
  const result=await db
    .updateTable("users")
    .set({
      onesignal_notification_id: null,
    })
    .where("id", "=", userId)
    .executeTakeFirst();

    return result
}