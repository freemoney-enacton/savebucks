import app from "../../app";
import * as tier from "./tier.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config/config";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await tier.fetch(
    lang?.toString() || "en",
    fallback_lang?.val
  );
  const response = result.map((tier: any) => {
    return {
      tier: tier.tier,
      label: tier.label,
      icon:`${config.env.app.image_url}/${tier.icon}`,
      affiliate_commission: parseFloat(tier.affiliate_commission),
      required_affiliate_earnings: parseFloat(tier.required_affiliate_earnings),
      // @ts-ignore
      is_active_user: req.userTier == tier.tier ? 1 : 0
    };
  });
  return reply.sendSuccess(response, 200, "null", null, null);
};
