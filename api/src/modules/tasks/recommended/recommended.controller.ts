import { FastifyRequest, FastifyReply } from "fastify";
import axios from "axios";
import { getNetworkDetails } from "../../postback/postback.model";
import { sluggify } from "../../../crons/functions/baseImportTask";
import { config } from "../../../config/config";
import { findUser } from "../../user/user.model";
import { db } from "../../../database/database";
import { getSetCachedData } from "../../../utils/getCached";
import app from "../../../app";
import { fetchAyetTasks, fetchRevuTasks, getNetwork } from "./revuTasks";

const imagePrefix = `${config.env.app.image_url}`;

export const fetchRecommendedOffers = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const xClientIp = (req.headers["x-client-ip"] as string)?.trim();
  const xForwardedFor = (req.headers["x-forwarded-for"] as string)
    ?.split(",")
    .map((ip) => ip.trim())
    .find((ip) => ip); // Find first non-empty IP

  const cip = xClientIp || xForwardedFor;

  const userId = req.userId as any;
  const userDetails = await findUser(userId);
  if (!userDetails) {
    return reply.sendError("User not found", 404);
  }

  // Parse query params
  const { limit, page = "1" } = req.query as { limit?: string; page?: string };
  const defaultLimit = 500;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = Number(limit) || 20;

  const net = (await getNetwork()) || "ayet";
  const platform = [req.headers["is-app"] ?? "web"];
  const device = platform[0] === "web" ? "desktop" : platform[0];

  const network = await getNetworkDetails("tasks", net);
  if (!network) {
    return reply.sendError("Network not found", 404);
  }

  const currency: any = await getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.val,
  });

  const parts: any = formatter.formatToParts(0);
  const currencySymbol = parts.find(
    (part: any) => part.type === "currency"
  )?.value;

  try {
    console.log("net", net);
    let result: {
      mappedResponse: any;
      pageNumber: number;
      totalPages: number;
    } = { mappedResponse: [], pageNumber: 0, totalPages: 0 };
    switch (net) {
      case "revu":
        result = await fetchRevuTasks(
          network,
          userDetails,
          device,
          cip,
          pageNumber,
          pageSize,
          defaultLimit,
          platform,
          currencySymbol
        );
        break;
      case "ayet":
        result = await fetchAyetTasks(
          network,
          userDetails,
          device,
          cip,
          pageNumber,
          pageSize,
          defaultLimit,
          platform,
          currencySymbol
        );
        break;
      default:
        result = await fetchAyetTasks(
          network,
          userDetails,
          device,
          cip,
          pageNumber,
          pageSize,
          defaultLimit,
          platform,
          currencySymbol
        );
        break;
    }

    if (!result) {
      return reply.sendError("No offers Found", 404);
    }

    return reply.sendSuccess(
      result.mappedResponse,
      200,
      "revu offers fetched successfully",
      pageNumber,
      result.totalPages
    );
  } catch (error) {
    return reply.sendError("No offers Found", 404);
  }
};
