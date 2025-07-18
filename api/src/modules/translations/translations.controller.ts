import { FastifyReply, FastifyRequest } from "fastify";
import * as translation from "./translations.model";
import { getSetCachedData } from "../../utils/getCached";
import app from "../../app";

getSetCachedData(
  "translations",
  async () => JSON.stringify(await translation.fetch()),
  3600,
  app
);
export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  let result: any = await getSetCachedData(
    "translations",
    async () => JSON.stringify(await translation.fetch()),
    3600,
    app
  );
  if (result) {
    return reply.sendSuccess(
      result.map((i: any) => ({
        id: i.id,
        trans_key: `${i.page}.${i.module}.${i.trans_key}`,
        trans_value: JSON.parse(i.trans_value),
      })),
      200,
      "null",
      null,
      null
    );
  } else {
    return reply.sendError(app.polyglot.t("error,notFound"), 404);
  }
};
