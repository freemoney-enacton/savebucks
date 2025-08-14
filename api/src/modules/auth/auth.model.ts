import { UpdateResult } from "kysely";
import { db } from "../../database/database";
import { config } from "../../config/config";

export const register = async (
  name: string,
  email: string,
  password: string,
  referral: string,
  referrer: string | null,
  metadata: string | null,
  signup_ip: any | null,
  device_id: any | null,
  country_code: any,
  timezone: string | null,
  provider_type: string,
  click_code: string | null,
  platform?: string | string[]
) => {
  const result = db
    .insertInto("users")
    .values({
      email: email,
      name: name,
      password: password,
      referral_code: referral,
      referrer_code: referrer ? referrer : null,
      provider_type: provider_type,
      metadata: metadata ? metadata : null,
      signup_ip: signup_ip ? signup_ip : null,
      device_id: device_id ? device_id : null,
      country_code: country_code ? country_code : null,
      timezone: timezone ? timezone : null,
      affiliate_click_code: click_code ? click_code : null,
      // lang:lang as string
    })
    .executeTakeFirst();
  return result;
};

export const updateUserInfo = async (
  email: string,
  metadata: string | null,
  signup_ip: any | null,
  device_id: any | null,
  country_code: any,
  timezone: string | null
) => {
  const result = db
    .updateTable("users")
    .set({
      metadata,
      signup_ip,
      device_id,
      country_code,
      timezone,
    })
    .where("email", "=", email)
    .executeTakeFirst();
  return result;
};

export const registerSocial = async (
  name: string,
  email: string | null,
  providerId: string | null,
  referral: string,
  provider_type: string,
  lang: string,
  click_code: string | null,
  referrerCode: string | null ,
  platform?: any
) => {
  if (email == null) {
    const result = db
      .insertInto("users")
      .values({
        email: email,
        name: name,
        provider_type: provider_type,
        provider_id: providerId,
        is_email_verified: 0,
        referral_code: referral,
        lang,
        affiliate_click_code: click_code ? click_code : null,
        referrer_code: referrerCode ? referrerCode : null,
        platform: platform ? platform : null,
      })
      .executeTakeFirst();
    return result;
  } else {
    const result = db
      .insertInto("users")
      .values({
        email: email,
        name: name,
        provider_type: provider_type,
        provider_id: providerId,
        is_email_verified: 1,
        referral_code: referral,
        lang,
        affiliate_click_code: click_code ? click_code : null,
        referrer_code: referrerCode ? referrerCode : null,
        platform: platform ? platform : null,
      })
      .executeTakeFirst();

    return result;
  }
};

export const appleUserCheck = async (subId: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("provider_id", "=", subId)
    .where("provider_type", "=", "apple")
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};

export const login = async (email: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .where("is_deleted", "=", 0)
    .where("status", "=", "active")
    .executeTakeFirst();
  return result;
};

export const ban =async (email: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("email", "=", email)
    .where("is_deleted", "=", 0)
    .where("status", "=", "banned")
    .executeTakeFirst();
  return result;
  
}

export const check = async (device_id: string) => {
  const result = db
    .selectFrom("users")
    .select(['email'])
    .where("device_id", "=", device_id)
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};
export const findByPhone = async (phone_no: any) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("phone_no", "=", phone_no)
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};

export const userExist = async (provider: string, providerId: string) => {
  const result = db
    .selectFrom("users")
    .selectAll()
    .where("provider_id", "=", providerId)
    .where("provider_type", "=", provider)
    .where("status", "=", "active")
    .where("is_deleted", "=", 0)
    .executeTakeFirst();
  return result;
};

export const updateIsVerified = async (
  email: string
): Promise<UpdateResult> => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      is_email_verified: 1,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};
export const updatePhoneVerified = async (
  phone_no: any
): Promise<UpdateResult> => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      is_phone_no_verified: 1,
    })
    .where("phone_no", "=", `${phone_no.toString()}`)
    .executeTakeFirst();
  return userUpdate;
};
export const updatePassword = async (
  email: string | undefined,
  password: string
) => {
  const userUpdate = await db
    .updateTable("users")
    .set({
      password: password,
    })
    .where("email", "=", `${email}`)
    .executeTakeFirst();
  return userUpdate;
};
export const storeOtp = async (
  email: string | null,
  phone_no: any,
  otp: number
) => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + config.env.app.otpExpiration);
  if (email) {
    const result = await db
      .insertInto("user_otp")
      .values({
        email,
        otp,
        expiration,
      })
      .execute();
    return result;
  }
  if (phone_no) {
    const result = await db
      .insertInto("user_otp")
      .values({
        phone_no,
        otp,
        expiration,
      })
      .execute();
    return result;
  }
};
export const verifyOtp = async (
  email: string | null,
  phone_no: string | null,
  otp: number
) => {
  const result = await db
    .selectFrom("user_otp")
    .selectAll()
    .$if(email != null || email != undefined, (qb) =>
      qb.where("email", "=", email)
    )
    .$if(phone_no != null || phone_no != undefined, (qb) =>
      qb.where("phone_no", "=", phone_no)
    )
    .orderBy("id", "desc")
    .executeTakeFirst();

  if (result?.otp == otp) return result;
  else return false;

  return result;
};

export const insertAuthLogs = async (
  userID: any,
  ip: any,
  device_id: string,
  meta_data: any
) => {
  const result = await db
    .insertInto("auth_logs")
    .values({
      user_id: userID,
      ip,
      device_id,
      meta_data,
    })
    .execute();
  return result;
};
