import { db } from "../database/database";

interface EventPayload {
  user_id: number;
  activity_type:
    | "tasks_earnings"
    | "bonus_earnings"
    | "referral_earnings"
    | "referrals"
    | "payouts";
  icon: string;
  title: string;
  status: string;
  url: string;
  amount: number | null;
  data: string | null;
}

export const sendActivitiesNotification = async (payload: EventPayload) => {
  const activity = await db
    .insertInto("user_activities")
    .values({
      user_id: payload.user_id,
      activity_type: payload.activity_type,
      icon: payload.icon,
      title: payload.title,
      status: payload.status,
      url: payload.url,
      amount: payload.amount,
      data: payload.data ? payload.data : null,
    })
    .execute();
  return activity;
};
