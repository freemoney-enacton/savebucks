import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as paymentController from "./types.controller";
import { fetchTypesResponseSchema } from "./types.schema";
import { isAuthenticated } from "../../../middleware/authMiddleware";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["payments"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      response: {
        // 200: fetchTypesResponseSchema,
      },
    },
    handler: paymentController.fetchTypes,
  });
}
