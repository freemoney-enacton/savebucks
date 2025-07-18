import { FastifyReply, FastifyRequest } from "fastify";
import * as leaderboard from "./leaderboards.model";
import app from "../../app";
import { number } from "zod";

export const runningLeaderboards = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await leaderboard.runningLeaderboards();

  if (!result || result.runningLeaderboards.length == 0) {
    return reply.sendError(app.polyglot.t("error.leaderboard.notFound"), 404);
  }

  const lang: any = req.headers["x-language"];
  // @ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  const runningLeaderboardsFormated = result.runningLeaderboards.map((leaderboard: any) => {
    let leaderboardName = JSON.parse(leaderboard['name']);
    
    return {
      ...leaderboard,
      name: leaderboardName[lang] ??
      leaderboardName[fallback_lang] ??
      leaderboardName["en"]
    }
  })

  return runningLeaderboardsFormated;
};

export const initializeLeaderboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = (req.params as { code: string }) || 1;
  const result = await leaderboard.initializeLeaderboard(code);
};

export const endLeaderboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = (req.params as { code: string }) || 1;
  const result = await leaderboard.endLeaderboard(code);
};

export const calculateLeaderboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = (req.params as { code: string }) || 1;
  const result = await leaderboard.calculateLeaderboardRankings(code);
};

export const leaderboardDetails = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = (req.params as { code: string }) || 1;
  const leaderboardDetails = await leaderboard.getLeaderboardDetails(code);
  if (!leaderboardDetails) {
    return reply.sendError(app.polyglot.t("error.leaderboard.notFound"), 404);
  }

  const lang: any = req.headers["x-language"];
  // @ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  let leaderboardName: any = leaderboardDetails.leaderboard.name;

  leaderboardDetails.leaderboard.name =
    leaderboardName[lang] ??
    leaderboardName[fallback_lang] ??
    leaderboardName["en"];

  return leaderboardDetails;
};

export const userDetails = async (req: FastifyRequest, reply: FastifyReply) => {
  const { code } = (req.params as { code: string }) || 1;
  const leaderboardDetails = await leaderboard.getUserDetails(
    code,
    Number(req.userId)
  );
  if (!leaderboardDetails) {
    return reply.sendError(app.polyglot.t("error.leaderboard.notFound"), 404);
  }

  return leaderboardDetails;
};

export const leaderboardEntries = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = (req.params as { code: string }) || 1;

  const { page, limit } = req.query as { page: string; limit: string };

  const result = await leaderboard.getLeaderboardEntries(
    code,
    Number(page),
    Number(limit)
  );

  const transformedData = result?.leaderboardEntries.map((entry) => {
    return {
      user_name: entry.user_name,
      user_referral_code: entry.user_referral_code,
      user_id: entry.user_id,
      rank: entry.rank,
      reward: entry.reward,
      earnings: entry.earnings,
      user_is_private: entry.user_is_private,
      user_image:entry.user_image
    };
  });

  return reply.sendSuccess(
    transformedData,
    200,
    "Entries Available",
    Number(page),
    Math.ceil(
      (result?.leaderboardEntriesCount?.entries_count ?? 0) / Number(limit)
    )
  );
};

