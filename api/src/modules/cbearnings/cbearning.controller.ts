import app from "../../app";
import { config } from "../../config/config";
import { db } from "../../database/database";
import { getSetCachedData } from "../../utils/getCached";
import { currencyTransform } from "./../../utils/transformResponse";
import * as earnings from "./cbearning.model";
import { FastifyReply, FastifyRequest } from "fastify";

const imagePrefix = `${config.env.app.image_url}`;

export const providersList = async (req: FastifyRequest, reply: FastifyReply) => {
  const { type } = req.query as {
    type: string | null;
  };

  const lang = req.headers["x-language"];
  const result = await earnings.providerLists(
    Number(req.userId),
    type,
    lang?.toString() || "en"
  );

  let providers = result.providers;
  
  reply.sendSuccess(
    providers,
    200,
    "Fetched SuccessFull",
    null,
    null
  );
};

export const list = async (req: FastifyRequest, reply: FastifyReply) => {
  const { month_year, page, limit, status, network, type } = req.query as {
    type: string | null;
    network: string | null;
    status: "pending" | "confirmed" | "declined" | null;
    month_year: string | null;
    limit: string | null;
    page: string | undefined;
  };
  const lang = req.headers["x-language"];
  const result = await earnings.lists(
    Number(req.userId),
    type,
    network,
    status,
    month_year,
    Number(limit),
    Number(page),
    lang?.toString() || "en"
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    reply.sendSuccess(
      result.earnings.map((i: any) => {
        return {
          id: i.id,
          network: i.network,
          networkName: i.name,
          networkLogo: i.network_logo,
          networkIcon: i.network_icon,
          transaction_id: i.transaction_id,
          user_id: i.user_id,
          task_offer_id: i.task_offer_id,
          network_goal_id: i.network_goal_id,
          offer_id: i.offer_id,
          task_name: i.task_name,
          slug: i.task_slug,
          task_image: (i.taskImage?.includes('http') || !i.taskImage) ? i.taskImage : `${imagePrefix}/${i.taskImage}`,
          task_type: i.task_type,
          payout: i.amount,
          status: i.status,
          created_at: i.created_at,
          campaign_id: i.campaign_id,
          goal_id: i.goal_id,
          goal_name: i.goal_name,
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

export const stats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.stats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const trends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.trends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const dateFormat = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await earnings.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};

export const fetchBonus = async (req: FastifyRequest, reply: FastifyReply) => {
  const { month_year, page, limit, status, network, task_type } = req.query as {
    task_type: string | null;
    network: string | null;
    status: "pending" | "confirmed" | "declined" | null;
    month_year: string | null;
    limit: string | null;
    page: string | undefined;
  };
  const userId = req.userId;
  const bonuses = await earnings.fetchBonus(
    Number(req.userId),
    task_type,
    network,
    status,
    month_year,
    Number(limit),
    Number(page)
  );
  const lastPage = limit
    ? Number(bonuses?.count) / Number(limit)
    : Number(bonuses?.count) / 20;
  if (bonuses) {
    reply.sendSuccess(
      bonuses.bonuses,
      200,
      "Bonuses Fetched",
      page,
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const fetchChargeBacks = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { month_year, page, limit, network, task_type } = req.query as {
    task_type: string | null;
    network: string | null;
    month_year: string | null;
    limit: string | null;
    page: string | undefined;
  };
  const lang = req.headers["x-language"];
  const result = await earnings.fetchChargeBacks(
    Number(req.userId),
    task_type,
    network,
    month_year,
    Number(limit),
    Number(page),
    lang?.toString() || ""
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    reply.sendSuccess(
      result.chargeBacks.map((i: any) => {
        return {
          id: i.id,
          network: i.network,
          campaign_id: i.campaign_id,
          transaction_id: i.transaction_id,
          user_id: i.user_id,
          task_offer_id: i.task_offer_id,
          network_goal_id: i.network_goal_id,
          networkName: i.name,
          networkLogo: i.network_logo,
          networkIcon: i.network_icon,
          offer_id: i.offer_id,
          task_name: i.task_name,
          slug: i.task_slug,
          task_image: i.taskImage,
          task_type: i.task_type,
          payout:  i.amount,
          status: i.status,
          mail_sent: i.mail_sent,
          created_at: i.created_at,
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
