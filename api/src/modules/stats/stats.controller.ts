import app from "../../app";
import * as stats from "./stats.model";
import { FastifyReply, FastifyRequest } from "fastify";

export const fetchStats = async (req: FastifyRequest, reply: FastifyReply) => {
  const userId = req.userId;
  const result = await stats.fetchStats(userId);
  if (result) {
    reply.sendSuccess(result, 200, "null", null, null);
  } else {
    reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
