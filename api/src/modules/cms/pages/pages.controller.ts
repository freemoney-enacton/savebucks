import { FastifyReply, FastifyRequest } from "fastify";
import * as pages from "./pages.model";
import { getSetCachedData } from "../../../utils/getCached";
import app from "../../../app";
import transformResponse from "../../../utils/transformResponse";
import { config } from "../../../config/config";
export const columns = {
  translatable: ["name", "title", "blocks", "content", "meta_title","meta_desc"],
  money: [],
  date: [],
};
const prefixUrl = `${config.env.app.image_url}/`;

// Function to recursively add prefix to image keys
export function addPrefixToImageKeys(obj: any, prefix: any) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        addPrefixToImageKeys(obj[key], prefix);
      } else if (key.includes("image") && obj[key]) {
        if (typeof obj[key] === "string") {
          obj[key] = prefix + obj[key];
        } else if (typeof obj[key] === "object" && obj[key].path) {
          obj[key].path = prefix + obj[key].path;
        }
      }
    }
  }
}

// Iterate over the JSON data array

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  const { page } = req.params as { page: string };
  const result = await getSetCachedData(
    "pages",
    async () => {
      return JSON.stringify(await pages.fetch());
    },
    3600,
    app
  );
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const response = await transformResponse(
    result,
    columns,
    fallback_lang?.val,
    lang?.toString() || "en",
    null
  );

  const filteredData = response.filter((item: any) => item.slug === page);
  if (filteredData.length == 0) {
    return reply.sendError(app.polyglot.t("error.pagesNotFound"), 404);
  }
  const newRes = filteredData.map((r: any) => {
    const innerBlock = { ...r }; // Clone the object
    
    // Check if blocks exists
    if (r.blocks) {
      // If blocks is already an array, keep it as is
      if (Array.isArray(r.blocks)) {
        // Transform blocks - each block may have nested objects that need standardization
        innerBlock.blocks = r.blocks.map((block: any) => {
          const newBlock = { ...block };
          
          // Check for data.icon_image in each block
          if (block.data && block.data.icon_image) {
            // If icon_image is an object with UUID keys, take the first value
            if (typeof block.data.icon_image === 'object' && !Array.isArray(block.data.icon_image)) {
              newBlock.data = { ...block.data };
              newBlock.data.icon_image = Object.values(block.data.icon_image)[0];
            }
          }
          
          return newBlock;
        });
      } 
      // If blocks is an object (with UUID keys), extract just the values
      else if (typeof r.blocks === 'object') {
        innerBlock.blocks = Object.values(r.blocks);
      }
    }
    
    return innerBlock;
  });

  newRes.forEach((item: any) => {
    addPrefixToImageKeys(item, prefixUrl);
  });
  return reply.sendSuccess(
    newRes,
    200,
    "pages fetched successfully",
    null,
    null
  );
};
