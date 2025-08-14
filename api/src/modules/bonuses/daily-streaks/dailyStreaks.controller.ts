import { FastifyReply, FastifyRequest } from "fastify";
import * as dailyStreakModel from "./dailyStreaks.model";
import dayjs from "dayjs"
import app from "../../../app";
import { claimUserSpin, createUserSpin, fetchSpin, getSpinRewards, getUserSpin } from "../spin.model";

export const details = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;
  
  const streakSettings = await dailyStreakModel.getStreakSettings();

  const streakDetails = await dailyStreakModel.fetch();

  // @ts-ignore
  const userLastStreak = await dailyStreakModel.getUserLastStreak(user.id);

  // @ts-ignore
  const userEarning = await dailyStreakModel.getUserEarningForToday(user.id);
  
  const today = dayjs().startOf("day").toDate();
  const yesterday = dayjs().subtract(streakSettings.streak_lifetime_in_days,"day").startOf("day").toDate();
  const tomorrow = dayjs().add(streakSettings.streak_lifetime_in_days,"days").startOf("day").toDate();

  const streakInfo = {
    requiredEarning: streakSettings.earning_required,
    streakDurationInHours: streakSettings.streak_lifetime_in_days * 24,
    streakExpiry: tomorrow
  };

  const streakCount = await dailyStreakModel.fetchCount();
  const nextStreakDay = userLastStreak && userLastStreak.day != streakCount ? userLastStreak.day + 1 : 1;

  let streaksWithStatus = streakDetails?.map(s => {
    let streakStatus = 'pending';

    if(userLastStreak) {
      if(userLastStreak.day == streakCount) {
        if(userEarning >= streakSettings.earning_required && (s.day == 1)) streakStatus = 'available';
      } else {
        if(userLastStreak.created_at >= yesterday && s.day <= userLastStreak.day) streakStatus = 'claimed';

        if(
          userLastStreak.created_at >= yesterday 
          && userLastStreak.created_at < today 
          && userEarning >= streakSettings.earning_required 
          && (s.day == nextStreakDay)
        ) streakStatus = 'available';
      }
      
    } else {
      if(s.day == 1 && userEarning >= streakSettings.earning_required) streakStatus = 'available';
    }

    return {...s, status: streakStatus}
  });

  return reply.sendSuccess(
    {
      streakInfo,
      streaksWithStatus,
      userLastStreak
    },
    200,
    "Ladder details fetched successfully",
    null,
    null
  );
}

export const claim = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user;

  const { day } = req.params as {day: string};

  const streakCount = await dailyStreakModel.fetchCount();
  if(Number(day) < 1 || Number(day) > streakCount) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.invalid_day"),
      400
    );
  }

  const requiredEarning = 1; // Get it from app config
  // @ts-ignore
  const userEarning = await dailyStreakModel.getUserEarningForToday(user.id);
  if(userEarning < requiredEarning) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.insufficient_earning"),
      400
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = (new Date(new Date().setDate(new Date().getDate() - 1)));
  yesterday.setHours(0, 0, 0, 0);
  
  // @ts-ignore
  const userLastStreak = await dailyStreakModel.getUserLastStreak(user.id);
  if(!userLastStreak && Number(day) !== 1) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.invalid_day"),
      400
    );
  }
  if(userLastStreak && Number(day) == userLastStreak.day) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.already_claimed"),
      400
    );
  }

  if(userLastStreak && userLastStreak?.created_at >= today) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.already_claimed"),
      400
    );
  }

  const nextStreakDay = userLastStreak && userLastStreak.day != streakCount ? userLastStreak.day + 1 : 1;
  if(userLastStreak && Number(day) !== nextStreakDay) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.invalid_day"),
      400
    );
  }

  const streakDetails = await dailyStreakModel.fetchDetails(Number(day));
  if(!streakDetails) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.invalid_day"),
      400
    );
  }

  if(streakDetails.reward_type == 'flat') {
    // @ts-ignore
    await dailyStreakModel.claimFlat(user.id, Number(day));

    // @ts-ignore
    const userStreak = await dailyStreakModel.getUserLastStreak(user.id);

    return reply.sendSuccess(
      {
        streak:userStreak
      },
      200,
      "Daily Streak Claimed",
      null,
      null
    );
  } 
  
  if (streakDetails.reward_type == 'spin' && !streakDetails.spin_code) {
    return reply.sendError(
      app.polyglot.t("error.bonuses.daily_streaks.invalid_day"),
      400
    );
  }

  if (streakDetails.reward_type == 'spin' && streakDetails.spin_code) {

    const spinDetails = await fetchSpin(streakDetails.spin_code);
    const userSpinCode = await createUserSpin(spinDetails, Number(req.userId), 'bonus_code');

    console.log("userSpinCode created ", userSpinCode);

    return reply.sendSuccess(
      {
  
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
  }

  
}

export const claimSpin = async (req: FastifyRequest, reply: FastifyReply) => {
  // Get details from req
  const { day, userspincode } = req.params as { day: string, userspincode: string };
  const user = req.user;

  const streakDetails = await dailyStreakModel.fetchDetails(Number(day));

  // chk user spin exists and available
  const userSpin = await getUserSpin(userspincode);

  // get spin reward
  const spinReward = getSpinRewards(userSpin?.spin_config)
  
  // claim spin
  await claimUserSpin(userspincode, spinReward.code);

  // award user bonus
  await dailyStreakModel.awardUserBonusForStreak(streakDetails, Number(day), Number(req.userId), spinReward.amount);

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
