import { FastifyInstance } from "fastify";
import * as earningController from "./cbearning.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { apiResponseSchema } from "./cbearning.schema";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/provider-list",
    handler: earningController.providersList,
    schema: {
      tags: ["Earnings"],
      querystring: z.object({
        type: z.enum(["tasks", "surveys"]).optional(),
      }),
    },
  });
  
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
        type: z.enum(["tasks", "surveys"]).optional(),
        network: z.string().optional().describe("network name"),
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
    url: "/trends",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.trends,
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
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/rewards",
    schema: {
      tags: ["Earnings"],
      // response: {200:apiResponseSchema}
    },
    handler: earningController.fetchBonus,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/charge-backs",
    schema: {
      tags: ["Earnings"],
    },
    handler: earningController.fetchChargeBacks,
  });
}
