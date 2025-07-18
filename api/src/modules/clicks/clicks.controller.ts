import { FastifyReply, FastifyRequest } from "fastify";
import * as click from "./clicks.model";
import { ClickTaskQuery } from "./clicks.schema";
import { decodeToken } from "../auth/jwt";
import { getIpDetails } from "../../utils/getClientInfo";
import { insertAuthLogs } from "../auth/auth.model";
import { fetchIcon } from "../providers/offerProviders.model";
import app from "../../app";
export const insert = async (req: FastifyRequest, reply: FastifyReply) => {
  const { platform, network, task_type, campaign_id } =
    req.body as ClickTaskQuery;
  const device_id: any = req.cookies.device_id;

  const country_code = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "unknown";
  const client_ip = req.headers["x-client-ip"] ?? req.headers["cf-connecting-ip"];

  const clientInfo = await getIpDetails(client_ip);
  const metaData = {
    ...clientInfo,
    userAgent: req.headers["user-agent"],
    referrer: req.headers["referer"],
  };
  const userId = Number(req.userId);
  const locale = req.headers["accept-language"] || ("en" as string);
  const userAgent = req.headers["user-agent"] as string;
  const referer = req.headers["referer"] as any;



  const result = await click.clickInsert(
    userId,
    platform,
    network,
    task_type,
    `${network}_${campaign_id}`,
    campaign_id,
    locale?.toString(),
    country_code?.toString(),
    userAgent?.toString(),
    client_ip?.toString(),
    referer?.toString()
  );
  if (result) {
    await click.taskClickUpdate(`${network}_${campaign_id}`);
    // await insertAuthLogs(
    //   userId,
    //   req.ip,
    //   device_id,
    //   JSON.stringify({
    //     ...metaData,
    //     route: req.routeOptions.url,
    //   })
    // );
    reply.sendSuccess("", 200, "Inserted SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t(" error.insertionFailed"), 500);
  }
};
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { page, limit, network, task_type, platform, date } = req.query as {
    page: string;
    limit: string;
    network: string;
    task_type: string;
    platform: string;
    date: string;
  };
  const result = await click.fetch(
    Number(page),
    Number(limit),
    network,
    task_type,
    platform,
    date,
    Number(req.userId)
  );
  if (result) {
    const lastPage = limit
      ? Number(result?.count) / Number(limit)
      : Number(result?.count) / 20;
    reply.sendSuccess(
      await Promise.all(
        result.clicks.map(async (i) => {
          const icon = await fetchIcon(i.network);
          return {
            id: i.id,
            user_id: i.user_id,
            platform: i.platform,
            task_type: i.task_type,
            network: i.network,
            network_name: icon?.name,
            icon: icon?.logo,
            task_offer_id: i.task_offer_id,
            campaign_id: i.campaign_id,
            clicked_on: i.clicked_on.toUTCString(),
            countries: i.countries,
            locale: i.locale,
            Referer: i.referer,
            user_agent: i.user_agent,
          };
        })
      ),
      200,
      "Fetched SuccessFull",
      Number(page),
      Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
    );
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const fetchDateClicked = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await click.dateFormat();
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const fetchTrends = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await click.fetchTrends(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
export const clickStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await click.clickStats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "Fetched SuccessFull", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.fetchedFailed"), 500);
  }
};
