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
        bg_color: i.bg_color,
        text_color: i.text_color,
        sort_order: i.sort_order,
        show_menu: i.show_menu,
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
