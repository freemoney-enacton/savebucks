import { sql } from "kysely";
import { db } from "../../../database/database";

export const fetch = async () => {
  const result = await db.selectFrom("streak_configurations")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
    ])
    .where("enabled", "=", 1)
    .execute();
  return result;
};

export const getStreakSettings = async () => {
  // Streak Settings
  const streakRequiredEarning = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"streak_earning_required")
    .executeTakeFirst();

  const streakLifetimeInDays = await db.selectFrom("settings")
    .selectAll()
    .where("name",'=',"streak_lifetime_in_days")
    .executeTakeFirst();

  const streakSettings = {
    earning_required: Number(streakRequiredEarning?.val || 1),
    streak_lifetime_in_days: Number(streakLifetimeInDays?.val || 24),
  }

  return streakSettings;
}

export const fetchCount = async (): Promise<number> => {
  const result = await db.selectFrom("streak_configurations")
    .select([
      sql<number>`COUNT(*)`.as("count"),
    ])
    .where("enabled", "=", 1)
    .executeTakeFirst();

  
  return (result ? result.count : 0);
};

export const fetchDetails = async (day: number): Promise<{day: number, reward_type: string, amount: string | null, spin_code: string | null} | undefined> => {
  return await db.selectFrom("streak_configurations")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
    ])
    .where("enabled", "=", 1)
    .where("day", "=", day)
    .executeTakeFirst();
}

export const fetchStreakSpins = async (day: number) => {
  const result = await db.selectFrom("streak_configurations")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
    ])
    .where("enabled", "=", 1)
    .where("day", "=", day)
    .executeTakeFirst();

  if(!result || result.reward_type !== 'spin') return null;

  const streakSpinCode = result.spin_code;
  
  const spinDetails = await db.selectFrom("spins")
    .where("code", "=", streakSpinCode)
    .where("enabled", "=", 1)
    .select([
      "name",
      "image",
      "code",
      "variable_rewards",
    ])
    .executeTakeFirst();

  if(!spinDetails) return null;

  const spinConfigurations = await db.selectFrom("spin_configuration")
    .select([
      "spin_code",
      "title",
      "icon",
      "code",
      "amount",
      "max_amount",
      "min_amount",
    ])
    .where("spin_code", "=", streakSpinCode)
    .where("enabled", "=", 1)
    .execute();

  return {
    spin: spinDetails,
    configuration: spinConfigurations
  };
};

export const getUserLastStreak = async (userId: number) => {
  const result = await db.selectFrom("user_streaks")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
      "created_at"
    ])
    .orderBy('created_at', 'desc')
    .where("user_id", "=", userId)
    .executeTakeFirst();
  return result;
};

export const getUserEarningForToday = async (userId: number): Promise<number> => {
  const result = await db.selectFrom("user_offerwall_sales")
    .select([
      sql`SUM(amount)`.as("totalEarning")
    ])
    .where("user_id", "=", userId)
    .where(() => sql`created_at >= CURRENT_DATE()`)
    .where("status", "=", "confirmed")
    .groupBy("user_id")
    .limit(1)
    .executeTakeFirst();

  if(!result) return 0;

  return Number(result.totalEarning);
}

export const claimFlat = async (userId: number, day: number) => {
  const streakDetails =  await db.selectFrom("streak_configurations")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
    ])
    .where('reward_type','=','flat')
    .where("enabled", "=", 1)
    .where("day", "=", day)
    .executeTakeFirst();

  if(!streakDetails) return null;

  await db.insertInto("user_streaks")
    .values({
      amount: streakDetails.amount,
      reward_type: streakDetails.reward_type,
      user_id: userId,
      day: day,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
    })
    .execute();

  await db
    .insertInto("user_bonus")
    .values({
      user_id: userId,
      bonus_code: `daily_streak_bonus`,
      amount: streakDetails.amount || 0,
      status: 'confirmed',
      awarded_on: sql`NOW()`,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
      metadata: JSON.stringify({
        day: day,
        claimed_at: new Date().toISOString()
      })
    })
    .executeTakeFirst();
}

const getSpinRewards = (config: any) => {
  const totalProbability = config.reduce((sum: any, item: any) => sum + parseFloat(item.probability), 0);
  const randomValue = Math.random() * totalProbability;

  let cumulativeProbability = 0;
  for (const item of config) {
      cumulativeProbability += parseFloat(item.probability);
      if (randomValue <= cumulativeProbability) {
          return item;
      }
  }
}

function getRandomDecimal(min: number, max: number): number {
  const randomDecimal = Math.random() * (max - min) + min;
  return parseFloat(randomDecimal.toFixed(2));
}

export const claimSpin = async (userId: number, day: number) => {
  const streakDetails =  await db.selectFrom("streak_configurations")
    .select([
      "day",
      "reward_type",
      "amount",
      "spin_code",
    ])
    .where("reward_type","=","spin")
    .where("enabled", "=", 1)
    .where("day", "=", day)
    .executeTakeFirst();

  if(!streakDetails) return null;

  const spinDetails = await db.selectFrom("spins")
    .where("code", "=", streakDetails.spin_code)
    .where("enabled", "=", 1)
    .select([
      "name",
      "image",
      "code",
      "variable_rewards",
    ])
    .executeTakeFirst();

  if(!spinDetails) return null;

  const spinConfigurations = await db.selectFrom("spin_configuration")
    .select([
      "spin_code",
      "title",
      "icon",
      "code",
      "amount",
      "max_amount",
      "min_amount",
      "probability",
    ])
    .where("spin_code", "=", streakDetails.spin_code)
    .where("enabled", "=", 1)
    .execute();

  const spinReward = getSpinRewards(spinConfigurations);

  let rewardAmount = 0;
  if(spinDetails.variable_rewards) {
    rewardAmount = getRandomDecimal(parseFloat(spinReward.min_amount), parseFloat(spinReward.max_amount));
  } else {
    rewardAmount = spinReward.amount
  }
  
  await db.insertInto("user_streaks")
    .values({
      amount: rewardAmount,
      reward_type: streakDetails.reward_type,
      user_id: userId,
      day: day,
      spin_code: streakDetails.spin_code,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
    })
    .execute();
  
  await db
    .insertInto("user_bonus")
    .values({
      user_id: userId,
      bonus_code: `daily_streak_bonus`,
      amount: rewardAmount || 0,
      status: 'pending',
      expires_on: sql`DATE_ADD(NOW(), INTERVAL 5 MINUTE)`,
      awarded_on: sql`NOW()`,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
      metadata: JSON.stringify({
        day: day,
        claimed_at: new Date().toISOString()
      })
    })
    .executeTakeFirst();

  return {
    spinReward: {
      amount: rewardAmount, 
      code: spinReward.code, 
      spin_code: spinReward.spin_code
    }
  };

}


export const awardUserBonusForStreak = async (streakDetails: any, day: number, userId: number, rewardAmount: number) => {

  await db.insertInto("user_streaks")
    .values({
      amount: rewardAmount,
      reward_type: streakDetails.reward_type,
      user_id: userId,
      day: day,
      spin_code: streakDetails.spin_code,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
    })
    .execute();
  
  await db
    .insertInto("user_bonus")
    .values({
      user_id: userId,
      bonus_code: `daily_streak_bonus`,
      amount: rewardAmount,
      status: 'pending',
      expires_on: sql`DATE_ADD(NOW(), INTERVAL 5 MINUTE)`,
      awarded_on: sql`NOW()`,
      created_at: sql`NOW()`,
      updated_at: sql`NOW()`,
      metadata: JSON.stringify({
        day: day,
        claimed_at: new Date().toISOString()
      })
    })
    .executeTakeFirst();
}