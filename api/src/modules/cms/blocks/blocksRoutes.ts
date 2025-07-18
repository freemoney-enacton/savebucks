import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as blocksController from "./blocks.controller";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Blocks"],
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: blocksController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:purpose",
    schema: {
      tags: ["Blocks"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: blocksController.fetch,
  });
}
