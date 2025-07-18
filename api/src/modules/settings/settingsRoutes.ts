import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as settingsController from "./settings.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Settings"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
    },
    handler: settingsController.fetch,
  });
}
