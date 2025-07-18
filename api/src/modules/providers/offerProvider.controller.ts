import crypto from "crypto";
import app from "../../app";
import * as providers from "./offerProviders.model";
import { FastifyReply, FastifyRequest } from "fastify";
import { generateHash } from "../../utils/transformResponse";
import { decodeToken } from "../auth/jwt";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const token = req.cookies.token || req.headers["authorization"];
  if (!token) {
    const { type, featured,iframe } = req.query as {
      type: "tasks" | "surveys";
      featured: string | null;
      iframe:string|null;
    };
    const lang = req.headers["x-language"];
    //@ts-ignore
    const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
    const result = await providers.fetch(
      type,
      null,
      lang?.toString() || "en",
      featured ? Number(featured) : null,
      iframe ? Number(iframe):null,
      fallback_lang?.val
    );
    const response = result.map((network: any) => {
      return {
        id: network.id,
        name: network.name,
        code: network.code,
        logo: network.logo,
        background_image: network.background_image,
        survey_url: network.survey_url,
        offer_url: network.offer_url,
        rating: network.rating,
        rating_count: network.rating_count,
        render_type: network.render_type,
      };
    });
    return reply.sendSuccess(response, 200, "null", null, null);
  }
  const decoded = await decodeToken(reply, token);
  const { type, featured,iframe } = req.query as {
    type: "tasks" | "surveys";
    featured: string | null;
    iframe:string|null;
  };
  const lang = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await providers.fetch(
    type,
    null,
    lang?.toString() || "en",
    featured ? Number(featured) : null,
    iframe ? Number(iframe):null,
    fallback_lang?.val
  );
  const response = result.map((network: any) => {
    return {
      id: network.id,
      name: network.name,
      code: network.code,
      logo: network.logo,
      background_image: network.background_image,
      survey_url: network.survey_url
        ? network.survey_url
            .replace("#USER_ID", decoded.id)
            .replace("#USER_NAME", decoded.name)
            .replace("#USER_EMAIL", decoded.email)
            .replace(
              "#SECURE_HASH",
              generateHash(`${req.userId}-${network.postback_key}`, "md5")
            )
        : null,
      offer_url: network.offer_url ? network.offer_url : null,
      rating: network.rating,
      rating_count: network.rating_count,
      render_type: network.render_type,
    };
  });
  return reply.sendSuccess(response, 200, "null", null, null);
};
