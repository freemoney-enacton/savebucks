import { FastifyInstance } from "fastify";
import * as providersController from "./offerProvider.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      tags: ["Providers"],
      querystring: z.object({
        type: z.enum(["tasks", "surveys"]),
        featured: z.string().describe("Featured 0 or 1").optional().nullable(),
        iframe: z.string().describe("iframe 0 or 1").optional().nullable(),
      }),
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.array(
            z.object({
              id: z.number(),
              name: z.string().nullable(),
              code: z.string().nullable(),
              logo: z.string().nullable(),
              background_image: z.string().nullable(),
              survey_url: z.string().nullable(),
              offer_url: z.string().nullable(),
              rating: z.string().nullable(),
              rating_count: z.number().nullable(),
              render_type: z.any(),
            })
          ),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.union([z.string(), z.null()]).optional(),
        }),
      },
    },
    handler: providersController.fetch,
  });
}
