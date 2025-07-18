import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as pagesController from "./pages.controller";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:page",
    schema: {
      tags: ["Pages"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      params: z.object({
        page: z.string(),
      }),
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: pagesController.fetch,
  });
}
