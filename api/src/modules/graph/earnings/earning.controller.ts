import { FastifyReply, FastifyRequest } from "fastify";
import * as earning from "./earnings.model";
import app from "../../../app";
// import { FetchTaskQuery } from "./task.schemas";
export const fetchEarning = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await earning.earningStats(Number(req.userId));
  if (result) {
    reply.sendSuccess(result, 200, "null", null, null);
  } else {
    reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};

export const fetch30DaysEarnings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await earning.graphLast30Days(Number(req.userId));

  if (result) {
    reply.sendSuccess(result, 200, "null", null, null);
  } else {
    reply.sendError(result, 500);
  }
};

export const fetch30DaysClicks = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await earning.graphClicksLast30Days(Number(req.userId));

  if (result) {
    reply.sendSuccess(result, 200, "null", null, null);
  } else {
    reply.sendError(result, 500);
  }
};
