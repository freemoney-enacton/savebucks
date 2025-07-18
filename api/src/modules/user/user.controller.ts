import path from "path";
import app from "../../app";
import { config } from "../../config/config";
import { db } from "../../database/database";
import { createJWTToken } from "../auth/jwt";
import { userActiveTask } from "../tasks/task.model";
import * as user from "./user.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { moveUploadedFile } from "../../utils/ImageUpload";
import  fs from "fs";

const imagePrefix = `${config.env.app.image_url}`;

export const findUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const userData = await user.findUser(Number(req.userId));
  if (!userData) {
    return reply.sendSuccess(null, 404, "User Not Found", null, null);
  } else {
    const tierInfo: any = await user.getTierInfo(userData?.current_tier);

    const lang: any = req.headers["x-language"];
    //@ts-ignore
    const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

    //@ts-ignore
    const userTierLabel =
      tierInfo?.label[lang] ??
      tierInfo?.label[fallback_lang] ??
      tierInfo?.label["en"];
    //@ts-ignore
    tierInfo.label =
      tierInfo?.label[lang] ??
      tierInfo?.label[fallback_lang] ??
      tierInfo?.label["en"];
    //@ts-ignore
    tierInfo.icon = `${config.env.app.image_url}/${tierInfo.icon}`;
    //@ts-ignore
    const tierAffiliateCommission = parseFloat(tierInfo?.affiliate_commission);
    //@ts-ignore
    tierInfo.affiliate_commission = `${tierAffiliateCommission}%`;

    const affiliate_earnings =userData?.affiliate_earnings;

    const tokensPerLevel = await db.selectFrom("settings")
      .select("val")
      .where("name","=","tokens_per_level")
      .executeTakeFirst();

    const tokenConversionRate = await db.selectFrom("settings")
      .select("val")
      .where("name","=","token_conversion_rate")
      .executeTakeFirst();

    const amountRemainingForNextLevel = Number(tokenConversionRate?.val) ? (Number(tokensPerLevel?.val) - Number(userData?.current_level_tokens)) / Number(tokenConversionRate?.val) : 0;

    const userLevelInfo = {
      current_level: userData?.current_level || 0,
      current_level_tokens: userData?.current_level_tokens || 0,
      total_tokens: userData?.total_tokens || 0,
      tokens_per_level: Number(tokensPerLevel?.val),
      level_completetion: tokensPerLevel?.val ? ((userData.current_level_tokens || 0)/Number(tokensPerLevel?.val)) * 100 : 0,
      next_level_amount_remaining: amountRemainingForNextLevel
    }

    return reply.sendSuccess(
      {
        ...userData,
        affiliate_earnings,
        tierDetails: tierInfo,
        tier: userData?.current_tier,
        level: userLevelInfo,
        // tier_label: userTierLabel,
        // tier_affiliate_commission: `${tierAffiliateCommission}%`,
      },
      200,
      "User Found",
      null,
      null
    );
  }
};
export const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await user.deleteUser(Number(req.userId));
  if (result === true) {
    req.logout();
    reply.clearCookie("token", { path: "/" });
    req.session.delete();
    return reply.sendSuccess("", 200, "User Deleted Successfully", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error,internalError"), 500);
  }
};
export const updateUser = async (req: FastifyRequest, reply: FastifyReply) => {

  const file = (req as any).file
  
  const { email, phone_no, name, is_private, promotion_update,lang} = req.body as any
  // as {
  //   email?: string;
  //   phone_no?: string;
  //   name?: string;
  //   is_private?: boolean;
  //   promotion_update?: boolean;
  // };

  if(file){
    const tempFilePath = file.path;
  const finalPath = await moveUploadedFile(tempFilePath, 'uploads/profiles'); 
  const avatar={
    filename: file.filename,
    path: finalPath,
    url: `${config.env.app.appUrl}/${path.basename('uploads')}/profiles/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size
  }
  console.log(avatar)

  const userByPhone = await user.findByPhone(phone_no, Number(req.userId));
  if (!!userByPhone) {
    if (avatar && avatar.path && fs.existsSync(avatar.path)) {
      fs.unlinkSync(avatar.path);
    }
    return reply.sendError(app.polyglot.t("error.user.phoneExists"), 409);
  }

  let result = await user.updateUser(
    Number(req.userId),
    email,
    phone_no,
    name,
    is_private,
    promotion_update,
    lang,
    avatar?.url,
  );
  const userData = await user.findUser(Number(req.userId));
  let accessToken = await createJWTToken(
    { name: userData?.name, email: userData?.email, id: Number(userData?.id) },
    `${parseInt(config.env.app.expiresIn)}h`
  );
  reply.setCookie("token", accessToken.toString(), {
    path: "/",
    domain: config.env.app.domain_cookie,
  });
  if (result) {
    return reply.sendSuccess(
      { ...userData, token: accessToken },
      200,
      "User Updated Successfully",
      null,
      null
    );
  } else {
    if (avatar && avatar.path && fs.existsSync(avatar.path)) {
      fs.unlinkSync(avatar.path);
    }
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
    
}

  const userByPhone = await user.findByPhone(phone_no, Number(req.userId));
  if (!!userByPhone) {
    return reply.sendError(app.polyglot.t("error.user.phoneExists"), 409);
  }

  let result = await user.updateUser(
    Number(req.userId),
    email,
    phone_no,
    name,
    is_private,
    promotion_update,
    lang
  );
  const userData = await user.findUser(Number(req.userId));
  let accessToken = await createJWTToken(
    { name: userData?.name, email: userData?.email, id: Number(userData?.id) },
    `${parseInt(config.env.app.expiresIn)}h`
  );
  reply.setCookie("token", accessToken.toString(), {
    path: "/",
    domain: config.env.app.domain_cookie,
  });
  if (result) {
    return reply.sendSuccess(
      { ...userData, token: accessToken },
      200,
      "User Updated Successfully",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
export const updateUserSettings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { is_private, promotion_update, country_code } = req.body as {
    is_private?: boolean;
    promotion_update?: boolean;
    country_code?: string;
  };

  let result = await user.updateUserSettings(
    Number(req.userId),
    is_private,
    promotion_update,
    country_code
  );
  const userData = await user.findUser(Number(req.userId));
  let accessToken = await createJWTToken(
    { name: userData?.name, email: userData?.email, id: Number(userData?.id) },
    `${parseInt(config.env.app.expiresIn)}h`
  );
  reply.setCookie("token", accessToken.toString(), {
    path: "/",
    domain: config.env.app.domain_cookie,
  });
  if (result) {
    return reply.sendSuccess(
      { ...userData, token: accessToken },
      200,
      "User Settings Updated Successfully",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};

export const updateReferCode = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { referralCode } = req.params as { referralCode: string };
  const referCodeExist = await user.existingReferCode(referralCode);
  if (referCodeExist) {
    return reply.sendError(app.polyglot.t("error.user.referCodeExists"), 409);
  }
  const update = await user.updateReferCode(Number(req.userId), referralCode);
  if (!update) {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
  const userData = await user.findUser(Number(req.userId));
  let accessToken = await createJWTToken(
    { name: userData?.name, email: userData?.email, id: Number(userData?.id) },
    `${parseInt(config.env.app.expiresIn)}h`
  );
  reply.setCookie("token", accessToken.toString(), {
    path: "/",
    domain: config.env.app.domain_cookie,
  });
  return reply.sendSuccess(
    { ...userData, token: accessToken },
    200,
    "Refer Code Updated Successfully",
    null,
    null
  );
};

export const getUserPublicProfileList = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { q } = req.query as { q: string };

  const usersData: any = await user.searchUserWithQuery(q);

  const formattedUsersData = usersData.map((user: any) => {
    return {
      id: user.id,
      name: user.name,
      referral_code: user.referral_code,
      country_code: user.country_code,
      is_private: user.is_private,
      tierDetails: {
        icon: `${config.env.app.image_url}/${user.tier_icon}`,
        label: user.tier_label,
        tier: user.tier_tier,
      }
    };
  })

  console.log(formattedUsersData)

  return reply.sendSuccess(
    formattedUsersData,
    200,
    "Users Available",
    null,
    null
  );
};
export const getUserPublicProfile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { referralCode } = req.params as { referralCode: string };

  const userData: any = await user.getUserFromReferCode(referralCode);

  const tierInfo: any = await user.getTierInfo(userData?.current_tier);

  const lang: any = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  //@ts-ignore
  tierInfo.label =
    tierInfo?.label[lang] ??
    tierInfo?.label[fallback_lang] ??
    tierInfo?.label["en"];
  //@ts-ignore
  tierInfo.icon = `${config.env.app.image_url}/${tierInfo.icon}`;
  //@ts-ignore
  const tierAffiliateCommission = parseFloat(tierInfo?.affiliate_commission);
  //@ts-ignore
  tierInfo.affiliate_commission = `${tierAffiliateCommission}%`;

 

  userData.tierInfo = tierInfo;

  if (!userData) {
    return reply.sendError(app.polyglot.t("auth.userNotFound"), 404);
  }

  if (userData.is_private) {
    return reply.sendSuccess(
      { name: userData?.name, is_private: userData?.is_private, id: userData?.id },
      200,
      "Profile Is Private",
      null,
      null
    );
  }

  const stats = await user.getUserPublicStats(userData?.id, referralCode);

  stats.lifetime_earnings = stats.lifetime_earnings;

  stats.referral_earning = stats.referral_earning;


  return reply.sendSuccess(
    { ...userData,
      stats: {
      referralEarnings: stats.referral_earning,
      lifetimeEarnings: stats.lifetime_earnings,
      offerCompleted: stats.offer_count,
      referredUsers: stats.referred_user
    } },
    200,
    "Profile Available",
    null,
    null
  );
};

export const getUserPublicActivities = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  let { page, limit } = req.query as {
    limit: string | null;
    page: string | undefined;
  };
  console.log("🎈",req.userId)
 
  const lang = req.headers["x-language"];
  // @ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
 
  const { referralCode } = req.params as { referralCode: string };
  console.log("referralCode", referralCode)
 
  const userData: any = await user.getUserFromReferCode(referralCode);
  if (!userData) {
    return reply.sendError(app.polyglot.t("auth.userNotFound"), 404);
  }
 
  if (userData.is_private) {
    return reply.sendSuccess([], 200, "Profile Is Private", null, null);
  }
 
  let activities = await user.getUserPublicActivities(
    Number(userData.id),
    Number(page) - 1,
    Number(limit)
  );
  let surveys=await user.getUserPublicActivitiesSurvey(
    Number(userData.id),
    Number(page) - 1,
    Number(limit)
  )
  let activitiesCount = await user.getUserPublicActivitiesCount(
    Number(userData.id)
  );
 
  const transformedActivites = activities.rows
  .filter((a) => a.name)
  .map((activity) => {
    const taskName = JSON.parse(activity.name);
    const taskDescription = activity.description ? JSON.parse(activity.description) : null;
    const taskInstruction = activity.instructions ? JSON.parse(activity.instructions) : null;
 
    return {
      task_offer_id: activity.task_offer_id,
      // @ts-ignore
      name: taskName[lang] ?? taskName[fallback_lang] ?? taskName["en"],
      image: (activity.image?.includes('http') || !activity.image) ? activity.image : `${imagePrefix}/${activity.image}`,
      // @ts-ignore
      description: taskDescription ? (taskDescription[lang] ?? taskDescription[fallback_lang] ?? taskDescription["en"]) : null,
      // @ts-ignore
      instructions: taskInstruction ? (taskInstruction[lang] ?? taskInstruction[fallback_lang] ?? taskInstruction["en"]) : null,
      network: activity.network,
      offer_id: activity.offer_id,
      campaign_id: activity.campaign_id,
      category_id: activity.category_id,
      url: activity.url ? activity.url.replace("#USER_ID", req.userId): null,
      countries: JSON.parse(activity.countries),
      platforms: activity.platforms,
      payout: activity.payout,
      earning: activity.earning,
      tier: activity.tier,
      is_featured: activity.is_featured,
      last_activity: activity.last_activity,
      slug: activity.slug,
      type: activity.task_type,
    };
  });

 
    const transformedSurveys = surveys.rows
    .filter((a) => a.name)
    .map((activity) => {    
      return {
        task_offer_id: activity.task_offer_id,
        // @ts-ignore
        name: activity.name,
        image: activity.image,
        // @ts-ignore
        description: activity.description,
        // @ts-ignore
        instructions: activity.instructions,
        network: activity.network,
        offer_id: activity.offer_id,
        campaign_id: activity.campaign_id,
        category_id: activity.category_id,
        url: activity.url ? activity.url.replace("#USER_ID", req.userId): null,
        countries: JSON.parse(activity.countries),
        platforms: activity.platforms,
        payout: activity.payout,
        earning: activity.earning,
        tier: activity.tier,
        is_featured: activity.is_featured,
        last_activity: activity.last_activity,
        slug: activity.slug,
        type: activity.task_type,
      };
    });
 
    const transformedData=[...transformedActivites,...transformedSurveys]
 
    transformedData.sort((a, b) => {
      // Convert to Date objects if they're strings
      const dateA = a.last_activity instanceof Date ? a.last_activity : new Date(a.last_activity);
      const dateB = b.last_activity instanceof Date ? b.last_activity : new Date(b.last_activity);
     
      // Sort descending (newest first)
      return dateB.getTime() - dateA.getTime();
    })
 
  return reply.sendSuccess(
    transformedData,
    200,
    "Profile Available",
    Number(page),
    Math.ceil(activitiesCount.rows[0].count / Number(limit))
  );
};

export const getPaymentMode = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { methodCode } = req.query as { methodCode: string };
  const userCountry = req.headers["cf-ipcountry"];
  const result = await user.getPaymentMode(Number(req.userId), methodCode);
  if (result) {
    return reply.sendSuccess(
      {
        payment_method_code: result.payment_method_code,
        account: result.account,
        payment_inputs: JSON.parse(result.payment_input),
        userCountry: userCountry ? userCountry?.toString() : "unknown",
      },
      200,
      "Payment Modes Found",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.notFound"), 404);
  }
};

export const getNotification = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userId = req.userId;
  const lang: any = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await user.getNotification(
    Number(userId),
    fallback_lang,
    lang?.toString()
  );
  if (result) {
    return reply.sendSuccess(
      result.map((notification: any) => {
        return {
          id: notification.id,
          message: JSON.parse(notification.message),
          meta_data: notification.meta_data,
          is_read: notification.is_read,
          created_at: notification.created_at,
          url: notification.route
        };
      }),
      200,
      "Notification Found",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.notFound"), 404);
  }
};
export const readNotification = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { id } = req.params as { id: any };
  const result = await user.readNotification(Number(id), Number(req.userId));
  if (result) {
    return reply.sendSuccess(null, 200, "Notification Read", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.notFound"), 404);
  }
};
export const readAllNotification = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await user.readAllNotification(Number(req.userId));
  if (result) {
    return reply.sendSuccess(null, 200, "All Notification Read", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.notFound"), 404);
  }
};
