import { FastifyInstance } from "fastify";
import * as earningController from "./earning.controller";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { apiResponseSchema } from "./earning.schema";

export default async function (app: FastifyInstance) {
 
  
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Earnings"],
      querystring: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
        status: z.enum(["confirmed", "pending", "declined"]).optional(),
      }),
      // response: {
      //   200: apiResponseSchema,
      // },
    },
    handler: earningController.list,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.dateFormat,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/stats",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.stats,
  });

}
