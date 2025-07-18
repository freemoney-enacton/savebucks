// import collect from "collect.js";
import { db } from "../../database/database";
import { sql, SqliteAdapter } from "kysely";
import { activityConfig } from "../../config/activityConfig";
import { sendActivitiesNotification } from "../../utils/sendUserActivities";
import { calculateLeaderboardRankings, endLeaderboard, initializeLeaderboard } from "../../modules/leaderboards/leaderboards.model";

export const startLeaderboard = async (frequency: "Daily" | "Monthly" | "Weekly") => {
  const leaderboardSettings = await db.selectFrom("leaderboard_settings")
    .selectAll()
    .where("frequency", "=", frequency)
    .where("is_enabled","=",1)
    .execute();

    for (const leaderboard of leaderboardSettings) {
      if(!leaderboard.code) continue;

      await calculateLeaderboardRankings(leaderboard.code);
      await endLeaderboard(leaderboard.code);
      await initializeLeaderboard(leaderboard.code);
      await calculateLeaderboardRankings(leaderboard.code);
    }
}

export const recalculateLeaderboard = async () => {
  const leaderboardSettings = await db.selectFrom("leaderboard_settings")
    .selectAll()
    .execute();

    for (const leaderboard of leaderboardSettings) {
      if(!leaderboard.code) continue;

      await calculateLeaderboardRankings(leaderboard.code);
    }
}