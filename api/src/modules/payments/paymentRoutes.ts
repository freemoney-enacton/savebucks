import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as paymentController from "./payments.controller";
import rateLimit from "@fastify/rate-limit";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { PaymentSchema } from "./payments.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "30 seconds",
      },
    },
    preHandler: isAuthenticated,
    method: "POST",
    url: "/payout",
    schema: {
      tags: ["payments"],
      body: PaymentSchema,
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.insert,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/stats",
    schema: {
      tags: ["payments"],
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.stats,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/payout-history",
    schema: {
      tags: ["payments"],
      querystring: z.object({
        type: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
        page: z.string().optional(),
        limit: z.string().optional(),
        status: z
          .enum(["created", "processing", "completed", "declined"])
          .optional(),
      }),
      // response: {
      //   200: fetchTypesResponseSchema,
      //   500: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: paymentController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Payments"],
      // response: {200:apiResponseSchema}
    },
    handler: paymentController.fetchDate,
  });
}
