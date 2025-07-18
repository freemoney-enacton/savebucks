import { sql } from "kysely";
import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("daily_bonus_ladder_configurations")
    .select([
      "amount",
      "step",
      "icon",
      "bg_color",
      "active_color",
      "title"
    ])
    .where("enabled", "=", 1)
    .execute();
  return result;
};

export const isLadderBonusAvailable = async (user_id: number) => {
  const ladderRequiredEarning = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"ladder_earning_required")
    .executeTakeFirst();
  
  const ladderRequiredEarningInterval = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"ladder_earning_interval")
    .executeTakeFirst();

  const ladderClaimInterval = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"ladder_claim_interval")
    .executeTakeFirst();

  const ladderSettings = {
    earning_required: Number(ladderRequiredEarning?.val || 1),
    earning_interval_day: Number(ladderRequiredEarningInterval?.val || 7),
    claim_interval_hour: Number(ladderClaimInterval?.val || 18)
  }

  // Check earnings
  const userEarning = await db.selectFrom("user_offerwall_sales")
    .select([
      "user_id",
      sql<number>`SUM(amount)`.as("earning_amount")
    ])
    .where("status","=","confirmed")
    .where("created_at",">=",sql<Date>`DATE_SUB(CURDATE(), INTERVAL ${ladderSettings.earning_interval_day} DAY)`)
    .where("user_id","=",user_id)
    .groupBy("user_id")
    .executeTakeFirst()

  if(!userEarning || (userEarning?.earning_amount < ladderSettings.earning_required)) return {
    earning_required: ladderSettings.earning_required,
    earning_interval_day: ladderSettings.earning_interval_day,
    claim_interval_hour: ladderSettings.claim_interval_hour,
    available: false,
    reason: "ladder_insufficient_earning",
  }

  // Claimed Check
  const previousClaimedLadder = await db.selectFrom("user_daily_bonus_ladder")
    .select([
      "user_id",
      "created_at",
      sql<Date>`DATE_ADD(created_at, INTERVAL ${ladderSettings.claim_interval_hour} HOUR)`.as("next_available_at")
    ])
    .where("user_id","=",user_id)
    .where("status","in",["claimed", "lost"])
    .where("created_at",">=",sql<Date>`NOW() - INTERVAL ${ladderSettings.claim_interval_hour} HOUR`)
    .executeTakeFirst();

  if(previousClaimedLadder) return {
    earning_required: ladderSettings.earning_required,
    earning_interval_day: ladderSettings.earning_interval_day,
    claim_interval_hour: ladderSettings.claim_interval_hour,
    available: false,
    reason: "ladder_claimed_already",
    next_available_at: previousClaimedLadder.next_available_at
  }

  return {
    earning_required: ladderSettings.earning_required,
    earning_interval_day: ladderSettings.earning_interval_day,
    claim_interval_hour: ladderSettings.claim_interval_hour,
    available: true,
  }
}

export const getDefaultLadderStep = async () => {
  const defaultStepSetting = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"default_ladder_step")
    .executeTakeFirst();

  const defaultStep = defaultStepSetting ? Number(defaultStepSetting.val) : 1;

  return await db.selectFrom("daily_bonus_ladder_configurations")
    .selectAll()
    .where("step","=",defaultStep)
    .where('enabled',"=",1)
    .executeTakeFirst();
}

export const userLadderDetailsForToday = async (userId: number) => {
  const result = await db.selectFrom("user_daily_bonus_ladder")
    .selectAll()
    .where("user_id", "=", userId)
    .where(() => sql`created_at >= CURRENT_DATE()`)
    .orderBy('created_at', 'desc')
    .limit(1)
    .executeTakeFirst();
  return result;
};

export const claimLadderBonus = async (userId: number) => {
  let ladderBonus = await userLadderDetailsForToday(userId);

  if(!ladderBonus) {
    const ladderDefaultStep = await getDefaultLadderStep();
    if(!ladderDefaultStep) return;

    await db
      .insertInto("user_daily_bonus_ladder")
      .values({
        user_id: userId,
        step: ladderDefaultStep?.step,
        status: 'claimed',
        amount: ladderDefaultStep?.amount || 0,
        claimed_at: sql`CURRENT_TIMESTAMP`,
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .execute();
  }

  ladderBonus = await userLadderDetailsForToday(userId);

  await db.updateTable('user_daily_bonus_ladder')
      .set('status', 'claimed')
      .set('claimed_at',sql`CURRENT_TIMESTAMP`)
      .where('id', '=', ladderBonus?.id || 0)
      .execute();

  ladderBonus = await userLadderDetailsForToday(userId);

  await db
    .insertInto("user_bonus")
    .values({
      user_id: userId,
      bonus_code: `daily_ladder_bonus`,
      amount: ladderBonus?.amount || 0,
      awarded_on: sql`CURRENT_TIMESTAMP`,
      status: 'confirmed',
      created_at: sql`CURRENT_TIMESTAMP`,
      metadata: JSON.stringify({
        step: ladderBonus?.step,
        claimed_at: ladderBonus?.claimed_at
      })
    })
    .executeTakeFirst();

  return ladderBonus;
}


export const doubleLadderBonus = async (userId: number) => {
  let ladderBonus = await userLadderDetailsForToday(userId);

  if(!ladderBonus) {
      const ladderDefaultStep = await getDefaultLadderStep();
      if(!ladderDefaultStep) return;

    await db
      .insertInto("user_daily_bonus_ladder")
      .values({
        user_id: userId,
        status: 'doubled',
        step: ladderDefaultStep?.step,
        amount: ladderDefaultStep?.amount,
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
      })
      .execute();
  }

  ladderBonus = await userLadderDetailsForToday(userId);

  if(ladderBonus?.status == 'claimed' || ladderBonus?.status == 'lost') return null;

  const ladderDetails = await db.selectFrom('daily_bonus_ladder_configurations')
    .select(['probability', 'amount', 'step'])
    .where('step','=',ladderBonus?.step || 0)
    .where('enabled', '=', 1)
    .executeTakeFirst();

  if(!ladderDetails) return null;

  const ladderBonusDoubleProbability = parseFloat(ladderDetails?.probability) || 0;
  const randomValue = Math.random() * 100;
  
  if (randomValue >= ladderBonusDoubleProbability) {
    await db.updateTable('user_daily_bonus_ladder')
      .set('status', 'lost')
      .set('amount', 0)
      .set('step',0)
      .where('id', '=', ladderBonus?.id || 0)
      .execute();
  } else {
    const nextStepDetails = await db.selectFrom('daily_bonus_ladder_configurations')
      .selectAll()
      .where('step', '=', (ladderBonus?.step || 0) + 1)
      .executeTakeFirst();

    await db.updateTable('user_daily_bonus_ladder')
      .set('status', 'doubled')
      .set('step', (nextStepDetails?.step || 1))
      .set('amount', nextStepDetails?.amount || 0)
      .where('id', '=', ladderBonus?.id || 0)
      .execute();
  }

  ladderBonus = await userLadderDetailsForToday(userId);

  return ladderBonus;
}