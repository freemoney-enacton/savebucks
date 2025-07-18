import { FastifyReply, FastifyRequest } from "fastify";
import * as referralEarning from "./referral-earning.model";

export const fetch30DaysEarnings = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const result = await referralEarning.graphLast30Days(Number(req.userId));

  if (result) {
    reply.sendSuccess(result, 200, "null", null, null);
  } else {
    reply.sendError(result, 500);
  }
};
