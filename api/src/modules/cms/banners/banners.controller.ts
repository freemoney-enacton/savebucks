import { FastifyReply, FastifyRequest } from "fastify";
import * as banners from "./banners.model";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = await banners.fetch();
  return reply.sendSuccess(
    result,
    200,
    "Banners fetched successfully",
    null,
    null
  );
};
