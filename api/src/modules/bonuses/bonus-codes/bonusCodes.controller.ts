import { FastifyReply, FastifyRequest } from "fastify";
import * as bonusCodeModel from "./bonusCodes.model";
import app from "../../../app";
import { createUserSpin } from "../spin.model";
import { claimUserSpin, fetchSpin, getSpinRewards, getUserSpin } from "../spin.model";

function pickKeys<T extends object, K extends keyof T>(obj: T | null | undefined, keys: K[]): Partial<T> {
  if (obj == null) {
      return {};
  }

  return keys.reduce((result, key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = obj[key];
      }
      return result;
  }, {} as Partial<T>);
}

export const claim = async (req: FastifyRequest, reply: FastifyReply) => {
  // get req details & code details
  const { code: codeFromReq } = req.params as { code: string };
  const code = codeFromReq.toUpperCase();
  const user = req.user;
  const bonusCode = await bonusCodeModel.getBonusCodeDetail(code);
  const bonusCodePublic = pickKeys(bonusCode, ["code","title","image","description","tier","reward_type","spin_code","amount"]);

  // validate code
  if(!bonusCode) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.notfound"), 404);
  // @ts-ignore
  if(bonusCode.tier && bonusCode.tier > user.current_tier) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.invalid_tier"), 400);

  const bonusCodeRedemptions = await bonusCodeModel.getBonusCodeRedemptions(code);

  if(bonusCodeRedemptions >= (bonusCode.usage_limit || 0) ) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.max_usage"), 400);
  if(bonusCode.start_date && bonusCode.start_date > new Date()) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.not_yet_available"), 400);
  if(bonusCode.end_date && bonusCode.end_date < new Date()) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.expired"), 400);
  // TODO: Move it to user redemptions
  // @ts-ignore
  console.log(code, user.id);
  // @ts-ignore
  const userExistingBonus = await bonusCodeModel.checkUserClaimedBonusCode(code, user.id);
  if(userExistingBonus) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.claimed"), 400);

  // if code is flat, directly award user
  if(bonusCode.reward_type == 'flat') {
    // @ts-ignore
    await bonusCodeModel.awardUserBonusForBonusCode(bonusCode, Number(req.userId), bonusCode.amount);

    const bonusRewardResponse = {
      bonusCode: bonusCodePublic,
    };

    return reply.sendSuccess(
      bonusRewardResponse, 200, "Bonus claimed successfully", null, null
    );
  }

  // if code is spin, create spin config and return spin object
  if(bonusCode.reward_type == 'spin' && !bonusCode.spin_code) return reply.sendError(app.polyglot.t("error.bonuses.bonus_code.notfound"), 404);

  if(bonusCode.reward_type == 'spin' && bonusCode.spin_code) {
    const spinDetails = await fetchSpin(bonusCode.spin_code);
    const userSpinCode = await createUserSpin(spinDetails, Number(req.userId), 'bonus_code');

    return reply.sendSuccess(
      {
        bonusCode: bonusCodePublic,
  
        spin: spinDetails?.spin,
        configuration: spinDetails?.config?.map(({probability,...publicConfig}: any) => publicConfig),
        maxAmount: spinDetails?.maxAmount,
        spinRange: spinDetails?.spinRange?.map(({probability,...publicConfig}) => publicConfig),
        
        userSpinCode: userSpinCode
      },
      200,
      "Bonus claimed successfully",
      null,
      null
    );
    // return
  }
}

export const claimSpin = async (req: FastifyRequest, reply: FastifyReply) => {
  // Get details from req
  const { code, usersipncode } = req.params as { code: string, usersipncode: string };
  const user = req.user;

  const bonusCode = await bonusCodeModel.getBonusCodeDetail(code);
  const bonusCodePublic = pickKeys(bonusCode, ["code","title","image","description","tier","reward_type","spin_code","amount"]);

  // chk user spin exists and available
  const userSpin = await getUserSpin(usersipncode);

  // get spin reward
  const spinReward = getSpinRewards(userSpin?.spin_config)
  
  // claim spin
  await claimUserSpin(usersipncode, spinReward.code);

  // award user bonus
  await bonusCodeModel.awardUserBonusForBonusCode(bonusCode, Number(req.userId), spinReward.amount);

  return reply.sendSuccess(
    {
      spinReward: spinReward,

    },
    200,
    "Bonus Spin claimed successfully",
    null,
    null
  );
}
