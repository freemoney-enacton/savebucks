import { FastifyReply, FastifyRequest } from "fastify";
import * as blocks from "./blocks.model";
import app from "../../../app";
import { config } from "../../../config/config";
import { addPrefixToImageKeys } from "../pages/pages.controller";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const { purpose } = req.params as { purpose: string };
  const prefixUrl = `${config.env.app.image_url}/`;
  if (purpose != null || purpose) {
    //@ts-ignore
    const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
    const result = await blocks.fetch(
      lang?.toString() || "en",
      fallback_lang?.val,
      purpose?.toString() || null
    );
    result.forEach((item: any) => {
      addPrefixToImageKeys(item, prefixUrl);
    });
    const newRes = result.map((r: any) => {
      const innerBlock = { ...r }; // Clone the object
      
      // Check if blocks exists
      if (r.blocks) {
        // If blocks is already an array, keep it as is
        if (Array.isArray(r.blocks)) {
          // No transformation needed, keep the array
          innerBlock.blocks = r.blocks;
        } 
        // If blocks is an object (with UUID keys), extract just the values
        else if (typeof r.blocks === 'object') {
          innerBlock.blocks = Object.values(r.blocks);
        }
      }
      
      return innerBlock;
    });
  
    return reply.sendSuccess(
      newRes,
      200,
      "blocks fetched successfully",
      null,
      null
    );
  }
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await blocks.fetch(
    lang?.toString() || "en",
    fallback_lang?.val,
    null
  ); 
  return reply.sendSuccess(
    result,
    200,
    "blocks fetched successfully",
    null,
    null
  );
};
