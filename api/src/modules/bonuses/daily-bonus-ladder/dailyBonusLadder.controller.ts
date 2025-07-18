import { FastifyReply, FastifyRequest } from "fastify";
import * as dailyBonusLadderModel from "./dailyBonusLadder.model";
import app from "../../../app";

export const details = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;

  const ladderDetails = await dailyBonusLadderModel.fetch();
  // @ts-ignore
  let userLadderDetails:any = await dailyBonusLadderModel.userLadderDetailsForToday(user.id);
  if(userLadderDetails) {
    userLadderDetails = {
      status: userLadderDetails.status,
      amount: userLadderDetails.amount,
      step: userLadderDetails.step,
      expires_at: userLadderDetails.expires_at,
    }
  }
  else {
    const ladderDefaultStep = await dailyBonusLadderModel.getDefaultLadderStep();

    userLadderDetails = {
      status: 'unclaimed',
      amount: Number(ladderDefaultStep?.amount),
      step: ladderDefaultStep?.step,
    }
  }

  // const ladderActionAvailable = !userLadderDetails || (userLadderDetails.status != 'lost');

  // const nextDay = new Date();
  // nextDay.setDate(nextDay.getDate() + 1);
  // nextDay.setHours(0, 0, 0, 0);

  // @ts-ignore
  const ladderActionAvailable = await dailyBonusLadderModel.isLadderBonusAvailable(user.id);

  return reply.sendSuccess(
    {
      detail: ladderDetails.reverse(),
      userLadderDetails: userLadderDetails?userLadderDetails:null,
      
      available: ladderActionAvailable.reason == 'ladder_insufficient_earning' ? true : ladderActionAvailable.available,
      not_available_reason: ladderActionAvailable.reason ? app.polyglot.t("error.bonuses.ladder." + ladderActionAvailable.reason) : null,
      next_available_at: ladderActionAvailable.next_available_at,

      earning_required: ladderActionAvailable.earning_required,
      earning_interval_day: ladderActionAvailable.earning_interval_day,
      claim_interval_hour: ladderActionAvailable.claim_interval_hour,
    },
    200,
    "Ladder details fetched successfully",
    null,
    null
  );
}

export const claim = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;

  // @ts-ignore
  const ladderActionAvailable = await dailyBonusLadderModel.isLadderBonusAvailable(user.id);

  if(!ladderActionAvailable.available) {
    const errorMsg = app.polyglot.t("error.bonuses.ladder." + ladderActionAvailable.reason);
    return reply.sendError(errorMsg, 400);
  }

  // @ts-ignore
  const userLadderDetails = await dailyBonusLadderModel.userLadderDetailsForToday(user.id);

  if(userLadderDetails?.status == 'claimed') return reply.sendError(app.polyglot.t("error.bonuses.ladder.claimed"), 400);

  // @ts-ignore
  const ladderBonus = await dailyBonusLadderModel.claimLadderBonus(user.id);

  return reply.sendSuccess(
    {
      ladderBonus
    },
    200,
    "Ladder details fetched successfully",
    null,
    null
  );
}

export const double = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;

  // @ts-ignore
  const ladderActionAvailable = await dailyBonusLadderModel.isLadderBonusAvailable(user.id);

  if(!ladderActionAvailable.available) {
    const errorMsg = app.polyglot.t("error.bonuses.ladder." + ladderActionAvailable.reason);
    return reply.sendError(errorMsg, 400);
  }
  

  // @ts-ignore
  const userLadderDetails = await dailyBonusLadderModel.userLadderDetailsForToday(user.id);

  if(userLadderDetails?.status == 'claimed') return reply.sendError(app.polyglot.t("error.bonuses.ladder.claimed"), 400);

  // @ts-ignore
  const ladderBonus = await dailyBonusLadderModel.doubleLadderBonus(user.id);

  return reply.sendSuccess(
    {
      ladderBonus
    },
    200,
    "Ladder details fetched successfully",
    null,
    null
  );
}