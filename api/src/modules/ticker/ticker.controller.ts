import app from "../../app";
import * as ticker from "./ticker.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config/config";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const { country_code, limit } = req.query as { country_code: string, limit: string };
  
  const lang = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

  const result = await ticker.fetch(
    country_code,
    Number(limit)
  );

  const response = result.map((tickerData: any) => {
    return {
      user_id: tickerData.user_id,
      user_name: tickerData.user_name,
      user_referral_code: tickerData.user_referral_code,
      user_country_code: tickerData.user_country_code,
      user_is_private: tickerData.user_is_private,
      user_image:tickerData.user_avatar,
      ticker_type: tickerData.ticker_type,
      ticker_data: tickerData.ticker_data,
    };
  });
  return reply.sendSuccess(response, 200, "null", null, null);
};
