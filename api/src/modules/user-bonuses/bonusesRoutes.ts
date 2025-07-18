import { FastifyInstance } from "fastify";
import * as bonusesController from "./bonuses.controller";
// Removed unnecessary import comment
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { apiResponseSchema, fetchQueryResponse } from "./bonuses.schema";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      querystring: fetchQueryResponse,
      response: {
        // 200: apiResponseSchema,
      },
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      tags: ["User Bonuses"],
    },
    handler: bonusesController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["User Bonuses"],

      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.fetchDateClicked,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/trends",
    schema: {
      tags: ["User Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.fetchTrends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/stats",
    schema: {
      tags: ["User Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.bonusStats,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/twitter-follow",
    schema: {
      tags: ["User Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.bonusStats,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/download-app",
    schema: {
      tags: ["User Bonuses"],
      // response: {200:apiResponseSchema}
    },
    handler: bonusesController.bonusStats,
  });
}
