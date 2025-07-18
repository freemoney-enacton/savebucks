import { currencyTransform } from "./../../utils/transformResponse";
import app from "../../app";
import { db } from "../../database/database";
import { getSetCachedData } from "../../utils/getCached";
import { decodeToken } from "../auth/jwt";
import * as bonuses from "./bonuses.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { name } from "ejs";

const toTitleCase = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const getBonusName = (userBonus: any) => {
  if(userBonus.name) return userBonus.name;

  const userBonusMetadata = userBonus.metadata;

  if(userBonus.bonus_code == 'bonus_code') return "Bonus Code: #BONUS_CODE".replace("#BONUS_CODE",userBonusMetadata.code);
  
  if(userBonus.bonus_code == 'daily_ladder_bonus') return "Daily Ladder Bonus: Claimed Step #STEP".replace("#STEP",userBonusMetadata.step);
  
  if(userBonus.bonus_code == 'daily_streak_bonus') return "Daily Streak Bonus: Day #DAY Claimed On #DATE".replace("#DAY",userBonusMetadata.day).replace("#DATE",userBonusMetadata?.claimed_at.split('T')[0]);

  return toTitleCase(userBonus.bonus_code);
}

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { page, limit, status, date } = req.query as {
    page: string;
    limit: string;
    status: "confirmed" | "declined" | "pending" | null;
    date: string | null;
  };
  const lang = req.headers["x-language"];

  const result = await bonuses.fetch(
    Number(page),
    Number(limit),
    Number(req.userId),
    status,
    date,
    lang?.toString() || ""
  );

  const lastPage = limit
    ? Number(result.count) / Number(limit)
    : Number(result.count) / 20;
  if (result) {
    return reply.sendSuccess(
      result.transformedResponse.map((i: any) => ({
        id: i.id,
        user_id: i.user_id,
        bonus_code: i.bonus_code,
        bonus_name: getBonusName(i),
        amount:  i.amount,
        awarded_on: i.created_at,
        expires_on: i.expires_on,
        referred_bonus_id: i.referred_bonus_id,
        status: i.status,
        created_at: i.created_at,
      })),
      200,
      "null",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error,notFound"), 404);
  }
};
export const bonusStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await bonuses.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const fetchTrends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await bonuses.fetchTrends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const fetchDateClicked = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await bonuses.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const downloadApp = async(req:FastifyRequest,reply:FastifyReply)=>{
  const bonusDetails = await bonuses.bonusDetails("app_install");
  const bonus = await bonuses.insertBonus(Number(req.userId),bonusDetails?.code,bonusDetails?.amount,"confirmed");
  if(bonus){
    return reply.sendSuccess(bonus, 200, "Bonus Added Successful", null, null);
  }
  else{
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
}
export const followTwitter = async(req:FastifyRequest,reply:FastifyReply)=>{
  const bonusDetails = await bonuses.bonusDetails("twitter_follow");
  const bonus = await bonuses.insertBonus(Number(req.userId),bonusDetails?.code,bonusDetails?.amount,"confirmed");
  if(bonus){
    return reply.sendSuccess(bonus, 200, "Bonus Added Successful", null, null);
  }
  else{
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
}