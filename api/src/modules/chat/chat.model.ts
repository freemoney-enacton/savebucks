import { LeaderboardEntries } from "../../database/db";
import { InsertExpression } from "kysely/dist/cjs/parser/insert-values-parser";
import { db } from "../../database/database";
import { DB } from "../../database/db";
import { sql } from "kysely";

import { config } from "../../config/config";
import { dispatchEvent } from "../../events/eventBus";

export const getRooms = async () => {
  const result = await db.selectFrom("rooms").selectAll().where('enabled', '=', 1).execute();
  return result;
};
export const getRoomsWithCountry = async (countryCode: string | null) => {
  const result = await db.selectFrom("rooms")
    .selectAll()
    .where('enabled', '=', 1)
    .where(({ eb, fn }) => eb.or([
      eb("countries", "like", `%${countryCode}%`),
      eb("countries", "is", null)
    ]))
    .execute();
  return result;
};

export const getRoom = async (room_code: string) => {
  const result = await db.selectFrom("rooms").selectAll().where("code", "=", room_code).where('enabled', '=', 1).executeTakeFirst();
  return result;
};

function extractReferralCodes(message: string) {
  // Regular expression to capture the referral code part inside [ @uid-...]
  const regex = /\[\s*@uid-([^\]\s]+)\s*\]/g;
  let matches;
  const referralCodes = [];

  // Use the regular expression to find all matches
  while ((matches = regex.exec(message)) !== null) {
    // matches[1] contains the referral code without [ @uid- ]
    referralCodes.push(matches[1]);
  }

  return referralCodes;
}

export const createMessage = async (room_code: string, user_id: number, message: string, country: string | null = null) => {
  const tiers = await db
    .selectFrom("tiers")
    .selectAll()
    .execute();

  const tierMap = tiers.reduce((accumulator, item) => {
    // @ts-ignore
    accumulator[item.id] = item;
    return accumulator;
  }, {});

  const user = await db.selectFrom("users").select([
    "name",
    "current_tier",
    "referral_code",
    "is_private",
    "country_code",
    "users.avatar",
    'users.current_level as current_user_level'
  ]).where("id", "=", user_id).executeTakeFirst();

  //console.log(user)

  if (!user) return;

  const room = await db.selectFrom("rooms").selectAll().where("code", "=", room_code).executeTakeFirst();
  if (!room) return;
  if (room.tier && user.current_tier < room.tier) return;

  const messageData: any = {
    room_code: room_code,
    user_id,
    content: message,
    country:user.country_code,
    user_name: user.name,
    user_avatar: user.avatar 
  ? user.avatar 
  : user.name 
    ? `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user.name)}` 
    : `${config.env.app.appUrl}/uploads/avatars/fallback.png`,
    user_tier: user.current_tier,
    user_referral_code: user.referral_code,
    user_private: user.is_private,
  };
  //console.log(messageData)

  const mentionedUserReferralCodes = extractReferralCodes(message);

  if (mentionedUserReferralCodes.length > 0) {
    const mentionedUsers = await db.selectFrom("users").select([
      "id",
      "name",
      "email",
      "current_tier",
      "referral_code",
      "is_private",
      "country_code",
      "lang"
    ]).where("referral_code", "in", mentionedUserReferralCodes).execute();

    const mentionedUsersByReferralCode = mentionedUsers.reduce((accumulator, item: any) => {
      if (!item.referral_code) return accumulator;

      // Use the referral_code as the key and the whole item as the value
      item.user_referral_code = item.referral_code;

      // @ts-ignore
      accumulator[item.referral_code] = item;
      return accumulator;
    }, {});

    // @ts-ignore
    if (mentionedUsers.length > 0) messageData['mentions'] = JSON.stringify(mentionedUsersByReferralCode);

    //send onesignal notification
    mentionedUsers.forEach(async(m:any)=>{
      try {
        //console.log(m)
        await dispatchEvent("send_user_notification", {
            templateCode: "chat_mentions",
            userId: Number(m.id),
            email:m.email,
            lang:m.lang,
            models: [
              {
                USER_NAME: user.name,
                DATE: formatDate(new Date()),
                MESSAGE:cleanMessageContent(message)   
              },
            ],
            customData: {
              message:cleanMessageContent(message),
              date: formatDate(new Date()),
            },
          });
      } catch (error) {
        console.log(error)
      }
    })
    
  }

  const result = await db
    .insertInto("messages")
    .values(messageData)
    .executeTakeFirst();

    // @ts-ignore
  messageData.tier_icon = `${config.env.app.image_url}/${tierMap[user.current_tier]?.icon}`
  messageData.is_private = messageData.user_private;
  messageData.current_user_level=user.current_user_level

  return messageData;
};

export const getMessages = async (room: string, count: number = 50) => {
  const tiers = await db
    .selectFrom("tiers")
    .selectAll()
    .execute();

  const tierMap = tiers.reduce((accumulator, item) => {
    // @ts-ignore
    accumulator[item.id] = item;
    return accumulator;
  }, {});

  const result = await db
    .selectFrom("messages")
    .leftJoin("users", "users.id", "messages.user_id")
    .select([
      'messages.id',
      'messages.content',
      'messages.sent_at',
      'messages.room_code',
      'messages.user_id',
      'messages.user_name',
      db.fn.coalesce('users.avatar', 'messages.user_avatar').as('user_avatar'),
      'messages.user_tier',
      'messages.is_hidden',
      'messages.user_referral_code',
      'messages.country',
      'messages.mentions',
      'users.is_private as current_user_private',
      'users.name as current_user_name',
      'users.current_tier as current_user_tier',
      'users.current_level as current_user_level'
    ])
    .where("messages.room_code", "=", room)
    .where("messages.is_hidden", "=", 0)
    .where("users.status","=","active")
    .where("users.is_deleted","!=",1)
    .orderBy("messages.sent_at", "desc")
    .limit(count)
    .execute();

    // @ts-ignore
  const formatedResult = result.map(r => ({ 
    ...r, 
    is_private: r.current_user_private, 
    user_name: r.current_user_name, 
    user_avatar: r.user_avatar? r.user_avatar :"https://ui-avatars.com/api/?name=" + r.current_user_name, 
    // @ts-ignore
    tier_icon: `${config.env.app.image_url}/${tierMap[r.current_user_tier ?? 0]?.icon}` 
  }));

  return formatedResult;
};

export const getChatUserInfo = async (user_id: number) => {
  const result = await db.selectFrom("users").select(['id','is_private']).where("id", "=", user_id).where("is_deleted", "=", 0).where("status", "=", 'active').executeTakeFirst();

  return result;
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function cleanMessageContent(message: string): string {
  // Replace all [@uid-xxxx] patterns with empty string
  return message.replace(/\[ *@uid-[^\]]+\]/g, '').trim();
}

export const getPaginatedMessages = async (
  room: string,
  count: number = 50,
  page: number = 1
) => {
  const tiers = await db
    .selectFrom("tiers")
    .selectAll()
    .execute();

  const tierMap = tiers.reduce((acc, item) => {
    // @ts-ignore
    acc[item.id] = item;
    return acc;
  }, {} as Record<number, typeof tiers[number]>);

  const offset = (page - 1) * count;

  const totalResult = await db
    .selectFrom("messages")
    .leftJoin("users", "users.id", "messages.user_id")
    .select(db.fn.countAll<string>().as('count'))
    .where("messages.room_code", "=", room)
    .where("messages.is_hidden", "=", 0)
    .where("users.status", "=", "active")
    .where("users.is_deleted", "!=", 1)
    .executeTakeFirst();

  const totalMessages = parseInt(totalResult?.count || '0', 10);
  const lastPage = Math.ceil(totalMessages / count);

  const result = await db
    .selectFrom("messages")
    .leftJoin("users", "users.id", "messages.user_id")
    .select([
      'messages.id',
      'messages.content',
      'messages.sent_at',
      'messages.room_code',
      'messages.user_id',
      'messages.user_name',
      db.fn.coalesce('users.avatar', 'messages.user_avatar').as('user_avatar'),
      'messages.user_tier',
      'messages.is_hidden',
      'messages.user_referral_code',
      'messages.country',
      'messages.mentions',
      'users.is_private as current_user_private',
      'users.name as current_user_name',
      'users.current_tier as current_user_tier',
      'users.current_level as current_user_level'
    ])
    .where("messages.room_code", "=", room)
    .where("messages.is_hidden", "=", 0)
    .where("users.status", "=", "active")
    .where("users.is_deleted", "!=", 1)
    .orderBy("messages.sent_at", "desc")
    .limit(count)
    .offset(offset)
    .execute();

  // @ts-ignore
  const formattedResult = result.map(r => ({
    ...r,
    is_private: r.current_user_private,
    user_name: r.current_user_name,
    user_avatar: r.user_avatar
      ? r.user_avatar
      : "https://ui-avatars.com/api/?name=" + encodeURIComponent(r.current_user_name || "User"),
    // @ts-ignore
    tier_icon: `${config.env.app.image_url}/${tierMap[r.current_user_tier ?? 0]?.icon}`
  }));

  return {data:formattedResult,lastPage};
};

export const getNotificationContents=async(code:string)=>{
  const result =await db
    .selectFrom("notification_templates")
    .select(['title','route'])
    .where("template_code", "=", code)
    .executeTakeFirst();

    return result

}