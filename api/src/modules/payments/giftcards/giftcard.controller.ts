import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../../config/config";
import * as giftcard from "./giftcard.model"
import app from "../../../app";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
    const imageUrl = config.env.app.image_url;
    const country_codes = req.headers["x-country"] ?? req.headers["cf-ipcountry"] ?? "DE";
    console.log(country_codes)
    const ArrCountry: string[] | null = JSON.parse(`["${country_codes}"]`);

    const lang = req.headers["x-language"];
    //@ts-ignore
    const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));

    const result = await giftcard.fetch(lang, fallback_lang?.val, ArrCountry)
    if (!result) return reply.sendError(app.polyglot.t("error.internalError"), 500);

    const formatedResult = result.map((i: any) => {
        return {
            name: i.name,
            description: i.description,
            terms: i.terms,
            id: i.id,
            sku: i.sku,
            image: i.image,
            denomination: i.denomination,
            currency: i.currency
        }
    });

    return reply.sendSuccess({ giftcards: formatedResult }, 200, "null", null, null)
}