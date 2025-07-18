import app from "../../app";
import * as referred from "./refereduser.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(
      {
        earnings:
          result.total_amount?.total_sums != null
            ? result.total_amount?.total_sums:  0,
        users: result.total_users?.total_users,
        reward_earning: result.totalRewardEarning,
        referral_earning: result.totalReferralEarning
      },
      200,
      "Fetched SuccessFull",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const trends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.trends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { date, page, limit } = req.query as {
    date: string | null;
    page: string;
    limit: string;
  };
  const userReferred = await referred.list(
    Number(req.userId),
    date,
    Number(page),
    Number(limit)
  );
  const count = await referred.countFunction(Number(req.userId));
  const lastPage = limit
    ? Number(count.users) / Number(limit)
    : Number(count.users) / 20;

  if (userReferred) {
    reply.sendSuccess(
      userReferred.map((user: any) => {
        return {
          name: user?.name,
          email: user?.email,
          joining_date: user?.joining_date,
          earnings:  user?.earnings,
          referral_earning: user?.referral_earning,
          count: parseInt(user?.count),
        };
      }),
      200,
      "Fetched SuccessFull",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await referred.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const taskReferedEarning = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const lang = req.headers["x-language"];
  const { date, page, limit } = req.query as {
    date: string | null;
    page: string;
    limit: string;
  };
  const result = await referred.taskReferred(
    Number(req.userId),
    date,
    Number(page),
    Number(limit),
    lang?.toString() || ""
  );

  const count = await referred.taskReferredCount(Number(req.userId));
  const lastPage = limit
    ? Number(count) / Number(limit)
    : Number(count) / 20;
    
  if (result) {
    reply.sendSuccess(
      result.map((user: any) => {
        return {
          name: user?.name,
          email: user?.email,
          joining_date: user?.transaction_time,
          referral_earning:
            user?.sale_amount,
          earnings: user?.referral_amount,
          task_offer_id: user?.task_offer_id,
          offerName:-
            user?.offerName != null || user?.offerName != undefined
              ? user?.offerName
              : user?.task_name,
          taskImage: user?.image,
          network: user?.network,
          slug: user?.task_slug,
          campaign_id: user?.campaign_id,
          networkName: user?.networkName,
          networkLogo: user?.logo,
          status: user?.status,
        };
      }),
      200,
      "Fetched Success",
      page,
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const referralEarningLeaderboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { page, limit } = req.query as {
    page: string;
    limit: string;
  };

  const result = await referred.referralEarningLeaderboard(
    Number(page),
    Number(limit),
  );

  const count = await referred.referralEarningLeaderboardCount();
  const lastPage = limit
    ? Number(count) / Number(limit)
    : Number(count) / 20;

  const formatedData = result.map((user: any) => {
    return {
      user_id: user.user_id,
      user_email: user.user_email,
      user_name: user.user_name,
      user_earning_amount: Number(user.user_earning_amount),
      user_image:user.user_image
    };
  });

  if (result) {
    reply.sendSuccess(
      formatedData,
      200,
      "Fetched Success",
      page,
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const cashbackReferredEarning = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const lang = req.headers["x-language"];
  const { date, page, limit } = req.query as {
    date: string | null;
    page: string;
    limit: string;
  };
  const result = await referred.cashbackReferred(
    Number(req.userId),
    date,
    Number(page),
    Number(limit),
    lang?.toString() || ""
  );
  const count = await referred.cashbackReferredCount(Number(req.userId));
  const lastPage = limit
    ? Number(count) / Number(limit)
    : Number(count) / 20;
   
  if (result) {
    reply.sendSuccess(
      result.map((user: any) => {
        return {
          name: user?.name,
          email: user?.email,
          joining_date: user?.transaction_time,
          referral_earning: user?.sale_amount,
          earnings: user?.referral_amount,
          order_amount: user?.order_amount,
          store_id: user?.store_id,
          store_name: user?.store_name,
          store_logo: user?.store_logo,
          store_slug: user?.store_slug,
          network_campaign_id: user?.network_campaign_id,
          network_name: user?.network_name,
          network_id: user?.network_id,
          transaction_time: user?.transaction_time,
          status: user?.status,
        };
      }),
      200,
      "Fetched Success",
      page,
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};