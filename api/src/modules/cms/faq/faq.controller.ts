import { FastifyReply, FastifyRequest } from "fastify";
import * as faq from "./faq.model";
import app from "../../../app";

export const getFaq = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const { category_code } = req.query as { category_code: string };
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await faq.getFaq(
    lang?.toString() || "en",
    category_code,
    fallback_lang?.val
  );
  if (result) {
    return reply.sendSuccess(result, 200, "FAQ Found", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};

export const getAllFaq = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await faq.getAllFaq(
    lang?.toString() || "en",
    fallback_lang?.val
  );

  if (result) {
    return reply.sendSuccess(result, 200, "FAQ Found", null, null);
  } else {
    return reply.sendError(app.polyglot.t("error.internalError"), 500);
  }
};
