import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as statsController from "./stats.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { apiResponseSchema } from "./stats.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Stats"],
      //   querystring: querySchema,
      response: {
        // 200: apiResponseSchema,
      },
    },
    handler: statsController.fetchStats,
  });
}
