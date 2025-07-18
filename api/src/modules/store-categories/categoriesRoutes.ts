import { FastifyInstance } from "fastify";
import * as categoriesController from "./categories.controller";
import { fetchCategoryResponseSchema } from "./categories.schema";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      response: { 
        // 200: fetchCategoryResponseSchema 
      },
      tags: ["Categories"],
    },
    handler: categoriesController.fetch,
  });
}
