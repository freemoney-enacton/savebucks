import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as translationsController from "./translations.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Translations"],
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.array(
            z.object({
              id: z.number(),
              trans_key: z.string(),
              trans_value: z.any(),
            })
          ),
          error: z.string().nullable(),
          msg: z.string().nullable(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
      },
    },
    handler: translationsController.fetch,
  });
}
