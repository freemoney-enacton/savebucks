import * as categories from "./categories.model";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const result = await categories.fetch(
    lang?.toString() || "en",
    fallback_lang?.val.toString()
  );
  if (result) {
    return reply.sendSuccess(
      result.map((i: any) => ({
        id: i.id,
        name: i.name,
        slug: i.slug,
        icon: i.icon,
        parent_id: i.parent_id,
        header_image: i.header_image,
        is_featured: i.is_featured, 
        store_count: i.store_count,
        h1: i.h1,
        h2: i.h2,
        meta_title: i.meta_title,
        meta_desc: i.meta_desc,
      })),
      200,
      "null",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error.categoriesNotFound"), 404);
  }
};
