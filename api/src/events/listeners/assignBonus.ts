import { db } from "../../database/database";

interface EventPayload {
  user_id: number;
  amount: number;
  bonus_code: string;
  expires_on: string | null;
  referred_bonus_id: number | null;
}
export const assignBonus = async (payload: EventPayload) => {
  const expiresOnDate: any =
    payload.expires_on || payload.expires_on != null
      ? new Date(payload.expires_on)
      : null;
  if (expiresOnDate == null) {
    const result = await db
      .insertInto("user_bonus")
      .values({
        user_id: payload.user_id,
        amount: payload.amount,
        bonus_code: payload.bonus_code,
        expires_on: null,
        awarded_on: new Date(),
        referred_bonus_id: payload.referred_bonus_id,
        status: "confirmed",
      })
      .execute();
    return result;
  } else {
    const result = await db
      .insertInto("user_bonus")
      .values({
        user_id: payload.user_id,
        amount: payload.amount,
        bonus_code: payload.bonus_code,
        expires_on: expiresOnDate,
        awarded_on: new Date(),
        referred_bonus_id: payload.referred_bonus_id,
        status: "pending",
      })
      .execute();
    return result;
  }
};
