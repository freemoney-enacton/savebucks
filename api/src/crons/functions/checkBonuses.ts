// import collect from "collect.js";
import { db } from "../../database/database";
import { sql, SqliteAdapter } from "kysely";
import { activityConfig } from "../../config/activityConfig";
import { sendActivitiesNotification } from "../../utils/sendUserActivities";

// This will check for both the joining bonus for users (both via refer and no refer)
// It will get the bonus details from types and validate it from the sales table and if applicable confirm it.
export const checkJoinBonus = async () => {
  const userBonusDetails = 
    await db.selectFrom("user_bonus")
      .innerJoin("bonus_types","bonus_types.code","user_bonus.bonus_code")
      .leftJoin(
        (eb) => eb
          .selectFrom("user_offerwall_sales")
          .select([
            "user_offerwall_sales.user_id",
            sql<number>`SUM(user_offerwall_sales.amount)`.as("earning_amount")
          ])
          .where("user_offerwall_sales.status","=","confirmed")
          .groupBy("user_offerwall_sales.user_id")
          .as("user_earnings"),
        (join) => join
          .onRef("user_earnings.user_id","=","user_bonus.user_id")
      )
      .select([
        "user_bonus.id",
        "user_bonus.user_id",
        "user_bonus.bonus_code",
        "user_bonus.amount",
        "user_bonus.status",
        "bonus_types.qualifying_amount",
        "user_earnings.earning_amount"
      ])
      .where("user_bonus.bonus_code","in",["join_no_refer", "join_with_refer"])
      .where((eb) => 
        sql<boolean>`COALESCE(${eb.ref("user_earnings.earning_amount")}, 0.00) >= ${eb.ref("bonus_types.qualifying_amount")}`
      )
      .where("user_bonus.status","=","pending")
      .execute();


  await Promise.all(userBonusDetails.map(async bonusInfo => {
      await db
        .updateTable("user_bonus")
        .set({ status: "confirmed" })
        .where("user_id", "=", bonusInfo.user_id)
        .where("id","=",bonusInfo.id)
        .execute();

      await sendActivitiesNotification({
        user_id: bonusInfo.user_id,
        activity_type: "bonus_earnings",
        icon: activityConfig.bonus_earnings.icon,
        title: activityConfig.bonus_earnings.title_status_confirmed,
        status: "confirmed",
        url: activityConfig.bonus_earnings.url,
        amount: Number(32323),
        data: JSON.stringify({ message: "Register Bonus Confirmed" }),
      });
  }));
}

// This will check the referral bonus earned and if the referee have earned the qualifiing amount will confirm it.
const checkReferBonus = async () => {
  const userBonusDetails = 
    await db.selectFrom("user_bonus")
      .innerJoin("bonus_types","bonus_types.code","user_bonus.bonus_code")
      .leftJoin(
        (eb) => eb
          .selectFrom("user_offerwall_sales")
          .select([
            "user_offerwall_sales.user_id",
            sql<number>`SUM(user_offerwall_sales.amount)`.as("earning_amount")
          ])
          .where("user_offerwall_sales.status","=","confirmed")
          .groupBy("user_offerwall_sales.user_id")
          .as("user_earnings"),
        (join) => join
          .onRef("user_earnings.user_id","=","user_bonus.referred_bonus_id")
      )
      .select([
        "user_bonus.id",
        "user_bonus.user_id",
        "user_bonus.bonus_code",
        "user_bonus.amount",
        "user_bonus.status",
        "user_earnings.earning_amount"
      ])
      .where("user_bonus.bonus_code","in",["refer_bonus"])
      .where((eb) => 
        sql<boolean>`COALESCE(${eb.ref("user_earnings.earning_amount")}, 0.00) >= ${eb.ref("bonus_types.qualifying_amount")}`
      )
      .where("user_bonus.status","=","pending")
      .execute();

  await Promise.all(userBonusDetails.map(async bonusInfo => {
      await db
        .updateTable("user_bonus")
        .set({ status: "confirmed" })
        .where("user_id", "=", bonusInfo.user_id)
        .where("id","=",bonusInfo.id)
        .execute();

      await sendActivitiesNotification({
        user_id: bonusInfo.user_id,
        activity_type: "bonus_earnings",
        icon: activityConfig.bonus_earnings.icon,
        title: activityConfig.bonus_earnings.title_status_confirmed,
        status: "confirmed",
        url: activityConfig.bonus_earnings.url,
        amount: Number(bonusInfo.amount),
        data: JSON.stringify({ message: "Referral Bonus Confirmed" }),
      });
  }));
}

// This will simply check for the user bonuses which are pending but expiry date have been passed
const checkExpireBonus = async () => {
  const bonuses = await db
    .updateTable("user_bonus")
    .set({ status: "expired" })
    .where("status", "=", "pending")
    .where('expires_on', 'is not', null)
    .where('expires_on', '<', new Date())
    .execute();
};



export default async () => {
  console.log(`Bonus Cron Running: ${new Date()}`);

  await Promise.all([
    checkJoinBonus(),
    checkReferBonus(),
    checkExpireBonus(),
  ]);
};
