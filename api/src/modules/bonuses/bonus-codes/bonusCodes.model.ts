import { sql } from "kysely";
import { db } from "../../../database/database";
import { config } from "../../../config/config";

export const getBonusCodeDetail = async (code: string) => {
  const result = await db.selectFrom("bonus_codes")
    .selectAll()
    .where("code", "=", code)
    .where("enabled", "=", 1)
    .executeTakeFirst();
  return result;
};

export const checkUserClaimedBonusCode = async (code: string, userId: number) => {
  const result = await db
    .selectFrom("user_bonus_code_redemptions")
    .selectAll()
    .where("user_id", "=", userId)
    .where("bonus_code", "=", code)
    .executeTakeFirst();
  return !!result;
};

export const getBonusCodeRedemptions = async (code: string): Promise<number> => {
  const result = await db
    .selectFrom("user_bonus_code_redemptions")
    .select([
      sql<number>`count(*)`.as('redemption_count')
    ])
    .where("bonus_code", "=", code)
    .executeTakeFirst();
  
  return (result ? (result.redemption_count || 0) : 0);
};

export const awardUserBonusForBonusCode = async (bonusCode: any, userId: number, rewardAmount: number) => {
  await db
    .insertInto("user_bonus")
    .values({
      user_id: userId,
      bonus_code: `bonus_code`,
      amount: rewardAmount,
      awarded_on: sql`CURRENT_TIMESTAMP`,
      status: 'confirmed',
      created_at: sql`CURRENT_TIMESTAMP`,
      metadata: JSON.stringify({
          "code": bonusCode.code,
          "code_id": bonusCode.id,
          "code_image": bonusCode.image,
          "code_title": bonusCode.title
      })
    })
    .executeTakeFirst();
  
  await db
    .insertInto("user_bonus_code_redemptions")
    .values({
      user_id: userId,
      bonus_code: bonusCode.code,
      created_at: sql`CURRENT_TIMESTAMP`,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .executeTakeFirst();

  await db
    .updateTable("bonus_codes")
    .set({
      'usage_count': sql`usage_count + 1`
    })
    .where('code','=',bonusCode.code)
    .execute();
}