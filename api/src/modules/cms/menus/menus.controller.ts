import { FastifyReply, FastifyRequest } from "fastify";
import * as menus from "./menus.model";
import app from "../../../app";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await menus.fetch(
    lang?.toString() || "en",
    fallback_lang?.val
  );
  return reply.sendSuccess(
    result,
    200,
    "menus fetched successfully",
    null,
    null
  );
};
