import { LeaderboardEntries } from "./../../database/db.d";
import { db } from "../../database/database";
import { sql } from "kysely";

function distributePrizeEqually(totalPrize: number, numWinners: number): { [key: number]: number } {
  // Calculate prize amount per winner
  const prizePerWinner = totalPrize / numWinners;

  // Create the result object with equal prizes
  let result = {};
  for (let i = 1; i <= numWinners; i++) {
      // @ts-ignore
      result[i] = prizePerWinner;
  }

  return result;
}

function distributePrizeAlgorithmically(totalPrize: number, numWinners: number, tokenFactor: number): { [key: number]: number } {
  interface TierConfig {
      endRank: number;
      startPrize: number;
      endPrize: number;
      distribution: 'fixed' | 'linear' | 'constant';
  }

  const defaultTiers: TierConfig[] = [
      { endRank: 1, startPrize: 50000, endPrize: 50000, distribution: 'fixed' },
      { endRank: 2, startPrize: 35000, endPrize: 35000, distribution: 'fixed' },
      { endRank: 3, startPrize: 17500, endPrize: 17500, distribution: 'fixed' },
      { endRank: 4, startPrize: 12500, endPrize: 12500, distribution: 'fixed' },
      { endRank: 10, startPrize: 11250, endPrize: 6500, distribution: 'linear' },
      { endRank: 50, startPrize: 6250, endPrize: 2500, distribution: 'linear' },
      { endRank: 100, startPrize: 2000, endPrize: 1000, distribution: 'linear' },
      { endRank: 250, startPrize: 995, endPrize: 500, distribution: 'linear' },
      { endRank: 500, startPrize: 499, endPrize: 300, distribution: 'linear' },
      { endRank: 750, startPrize: 250, endPrize: 250, distribution: 'constant' },
      { endRank: 1000, startPrize: 200, endPrize: 20, distribution: 'linear' }
  ];

  const calculatePrize = (rank: number, tiers: TierConfig[]): number => {
      const tier = tiers.find(t => rank <= t.endRank);
      if (!tier) return tiers[tiers.length - 1].endPrize;
      
      switch (tier.distribution) {
          case 'fixed':
              return tier.startPrize;
          case 'constant':
              return tier.startPrize;
          case 'linear':
              const prevTier = tiers[tiers.indexOf(tier) - 1];
              const startRank = prevTier ? prevTier.endRank + 1 : 1;
              const rankRange = tier.endRank - startRank;
              const prizeRange = tier.endPrize - tier.startPrize;
              return tier.startPrize + (prizeRange * (rank - startRank) / rankRange);
      }
  }

  const distributePrizesInternal = (totalPrize: number, totalParticipants: number, tiers: TierConfig[]): number[] => {
      let prizes: number[] = [];

      for (let rank = 1; rank <= totalParticipants; rank++) {
          prizes.push(calculatePrize(rank, tiers));
      }

      const currentTotal = prizes.reduce((sum, prize) => sum + prize, 0);
      const scaleFactor = totalPrize / currentTotal;
      
      let distributedPrize = 0;
      let remainingAmount = totalPrize;

      prizes = prizes.map((prize, index) => {
          const scaledPrize = Math.floor(prize * scaleFactor);
          const adjustedPrize = Math.min(scaledPrize, remainingAmount);
          distributedPrize += adjustedPrize;
          remainingAmount -= adjustedPrize;
          return adjustedPrize;
      });

      let index = 0;
      while (remainingAmount > 0 && index < prizes.length - 1) {
          if (prizes[index] > prizes[index + 1]) {
              prizes[index]++;
              remainingAmount--;
          } else {
              index++;
          }
      }

      if (remainingAmount > 0) {
          prizes[prizes.length - 1] += remainingAmount;
      }

      return prizes;
  }

  const totalPrizeInTokens = totalPrize * tokenFactor;

  const result = distributePrizesInternal(totalPrizeInTokens, numWinners, defaultTiers)

  const resultWithTokenPrize = result.map(amount => amount / tokenFactor);

  return Object.fromEntries(Object.entries(resultWithTokenPrize));
}

export const runningLeaderboards = async () => {
  const runningLeaderboards = await db.selectFrom('leaderboard_runs')
    .select([
      "name",
      "code",
      "start_date",
      "end_date",
      "prize",
      "users"
    ])
    .where('status', '=', 'running')
    .execute();

  return {runningLeaderboards};
}

export const initializeLeaderboard = async (code: string) => {
  const leaderboardConfig = await db.selectFrom('leaderboard_settings')
    .selectAll()
    .where('code', '=', code)
    .executeTakeFirst();

  if(!leaderboardConfig) return;

  let tokenPrizeDb = await db.selectFrom("settings")
    .select("settings.val")
    .where("name","=","token_conversion_rate")
    .executeTakeFirst();

  let tokenPrize = tokenPrizeDb ? Number(tokenPrizeDb.val) : 1;
  
  let prizeDistributionConfig = leaderboardConfig.distribution_config || JSON.stringify(distributePrizeAlgorithmically(
    leaderboardConfig?.prize ? Number(leaderboardConfig.prize || 0) : 0, 
    leaderboardConfig?.users ? Number(leaderboardConfig.users || 0) : 0, 
    tokenPrize
  ));

  const existingLeaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status','=','running')
    .executeTakeFirst();

  if(existingLeaderboard) return;
  
  // if(existingLeaderboard) {
  //     await db.updateTable('leaderboard_runs')
  //       .set({
  //         status: 'completed',
  //         updated_at: sql`CURRENT_TIMESTAMP()`,
  //         awarded_at: sql`CURRENT_TIMESTAMP()`,
  //        })
  //       .where('id', '=', existingLeaderboard.id)
  //       .execute();
  //   }

  // if a similar leaderboard is already running, mark that as completed.
  let endDataInterval;
  if(leaderboardConfig.frequency == 'Daily') endDataInterval = 1
  else if(leaderboardConfig.frequency == 'Monthly') endDataInterval = 30
  else if(leaderboardConfig.frequency == 'Weekly') endDataInterval = 7

  await db.insertInto('leaderboard_runs')
    .values({
      code: leaderboardConfig.code,
      distribution_logic: leaderboardConfig.distribution_logic,
      // @ts-ignore
      distribution_config: prizeDistributionConfig,
      frequency: leaderboardConfig.frequency,
      name: leaderboardConfig.name,
      status: 'running',
      prize: leaderboardConfig.prize || 0,
      users: leaderboardConfig.users,
      start_date: sql`CURRENT_DATE()`,
      end_date: sql`DATE_ADD(CURRENT_DATE(), INTERVAL ${endDataInterval} DAY)`,
      created_at: sql`CURRENT_TIMESTAMP()`,
      updated_at: sql`CURRENT_TIMESTAMP()`,
     })
    .execute();
}

export const calculateLeaderboardRankings = async (code: string) => {
  const leaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status','=','running')
    .executeTakeFirst();

  if(!leaderboard || leaderboard.status !== 'running') return;

  const earners = await db
    .selectFrom("user_offerwall_sales")
    .select([
      "user_id",
      sql`SUM(amount)`.as("earnings_amount"),
    ])
    .where('created_at', '>=', leaderboard.start_date)
    .where('created_at', '<=', leaderboard.end_date)
    .groupBy(["user_id"])
    .orderBy([sql`SUM(amount) DESC`])
    .limit(leaderboard.users || 999999999)
    .execute();

  await db.deleteFrom('leaderboard_entries')
    .where('leaderboard_id', '=', leaderboard.id)
    .execute();

  const leaderboardConfig = leaderboard.distribution_config;

  // @ts-ignore
  const leaderboardEntriesData = Object.entries(leaderboardConfig)
    .map(([rank, prize]) => {
      return {
        leaderboard_id: leaderboard.id,
        // @ts-ignore
        user_id: earners[rank] ? earners[rank].user_id : null,
        rank: Number(rank) + 1,
        //  @ts-ignore
        reward: prize,
        status: 'pending',
        // @ts-ignore
        earnings: earners[rank] ? earners[rank].earnings_amount : 0,
        created_at: sql`CURRENT_TIMESTAMP()`,
        updated_at: sql`CURRENT_TIMESTAMP()`
      }
    })

    await db.insertInto('leaderboard_entries')
    // @ts-ignore
    .values(leaderboardEntriesData)
    .execute();
}

export const endLeaderboard = async (code: string) => {
  const leaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status','=','running')
    .executeTakeFirst();

  if(!leaderboard || leaderboard.status !== 'running') return;

  await db.updateTable('leaderboard_runs')
    .set({
      status: 'awarded',
      updated_at: sql`CURRENT_TIMESTAMP()`,
      awarded_at: sql`CURRENT_TIMESTAMP()`,
    })
   .where('id', '=', leaderboard.id)
   .execute();

   const leaderboardEntries = await db.selectFrom("leaderboard_entries")
    .selectAll()
    .where("leaderboard_id","=",leaderboard.id)
    .execute();

  for (const leaderboardEntry of leaderboardEntries) {
    if(leaderboardEntry.user_id) {
      await db
        .insertInto("user_bonus")
        .values({
          user_id: Number(leaderboardEntry.user_id),
          bonus_code: `${code}_placement`,
          amount: Number(leaderboardEntry.reward) || 0,
          status: 'confirmed',
          awarded_on: sql`NOW()`,
          created_at: sql`NOW()`,
          updated_at: sql`NOW()`,
          metadata: JSON.stringify({
            leaderboard_run_id: leaderboard.id,
            leaderboard_code: code
          })
        })
        .executeTakeFirst();

      await db.updateTable("leaderboard_entries")
        .set({
          'status': 'completed'
        })
        .where("user_id","=",leaderboardEntry.user_id)
        .where("leaderboard_id","=",leaderboardEntry.leaderboard_id)
        .execute();
    }

      // TODO: Notify user
  }

  await db.deleteFrom("leaderboard_entries")
    .where("leaderboard_id","=",leaderboard.id)
    .where("status","=","pending")
    .where("user_id","is",null)
    .execute();
}

export const getLeaderboardDetails = async (code: string) => {
  const leaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status', '=', 'running')
    .executeTakeFirst();

  if(!leaderboard) return null;

  const top3Earners = await db.selectFrom('leaderboard_entries')
    .leftJoin('users', 'leaderboard_entries.user_id', 'users.id')
    .select([
      'leaderboard_entries.user_id',
      'leaderboard_entries.rank',
      'leaderboard_entries.reward',
      'leaderboard_entries.earnings',
      sql<any>`COALESCE(users.name, NULL)`.as('user_name'),
      sql<any>`COALESCE(users.referral_code, NULL)`.as('user_referral_code'),
      sql<any>`COALESCE(users.is_private, NULL)`.as('user_is_private'),
      sql<any>`COALESCE(users.avatar, NULL)`.as('user_image')
    ])
    .where('leaderboard_entries.leaderboard_id', '=', leaderboard.id)
    .where("users.status","=","active")
    .where("users.is_deleted","!=",1)
    .orderBy(['rank'])
    .limit(3)
    .execute();  
  
  leaderboard.name = JSON.parse(leaderboard.name);
  leaderboard.distribution_config = null;

  return {
    leaderboard,
    top3Earners,
  }

}

export const getUserDetails = async (code: string, user_id: number) => {
  const leaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status', '=', 'running')
    .executeTakeFirst();

  if(!leaderboard) return null;
  
  const userRank = await db.selectFrom('leaderboard_entries')
    .select([
      'user_id',
      'rank',
      'reward',
    ])
    .where('leaderboard_id', '=', leaderboard.id)
    .where('user_id', '=', user_id)
    .where('status', '=', 'pending')
    .executeTakeFirst();


  leaderboard.name = JSON.parse(leaderboard.name);
  leaderboard.distribution_config = null;

  return {
    userRank
  }

}

export const getLeaderboardEntries = async (code: string, page: number, limit: number) => {
  
  if(page <= 0) page = 1
  if(limit <= 0) limit = 1

  const leaderboard = await db.selectFrom('leaderboard_runs')
    .selectAll()
    .where('code', '=', code)
    .where('status', '=', 'running')
    .executeTakeFirst();

  if(!leaderboard) return null;

  const leaderboardEntries = await db.selectFrom('leaderboard_entries')
    .leftJoin('users', 'leaderboard_entries.user_id', 'users.id')
    .select([
      'leaderboard_entries.user_id',
      'leaderboard_entries.rank',
      'leaderboard_entries.reward',
      'leaderboard_entries.earnings',
      sql<any>`COALESCE(users.name, NULL)`.as('user_name'),
      sql<any>`COALESCE(users.referral_code, NULL)`.as('user_referral_code'),
      sql<any>`COALESCE(users.is_private, NULL)`.as('user_is_private'),
      sql<any>`COALESCE(users.avatar, NULL)`.as('user_image')
    ])
    .where('leaderboard_entries.leaderboard_id', '=', leaderboard.id)
    .where("users.status","=","active")
    .where("users.is_deleted","!=",1)
    .orderBy(['rank'])
    .limit(limit)
    .offset((page - 1) * limit)
    .execute();

  const leaderboardEntriesCount = await db.selectFrom('leaderboard_entries')
    .select(({ fn, val, ref }) => [
      fn.count<number>('leaderboard_entries.id').as('entries_count'),
    ])
    .where('leaderboard_entries.leaderboard_id', '=', leaderboard.id)
    .orderBy(['rank'])
    // .limit(limit)
    // .offset((page - 1) * limit)
    .executeTakeFirst();

    return {
      leaderboardEntries,
      leaderboardEntriesCount
    };
}