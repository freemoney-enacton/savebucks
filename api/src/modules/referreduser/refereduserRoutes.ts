import { FastifyInstance } from "fastify";
import * as referredController from "./refereduser.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import { referralsApiSchema } from "./refereduser.schema";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/stats",
    schema: {
      tags: ["Referred user"],
      // response: {
      //   401: z.object({ error: z.string() }),
      //   200: z.object({ message: z.string() }),
      //   503: z.object({ error: z.string() }),
      // },
    },
    handler: referredController.stats,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/trends",
    schema: {
      tags: ["Referred user"],
      // response: {
      //   401: z.object({ error: z.string() }),
      //   200: z.object({ message: z.string() }),
      //   503: z.object({ error: z.string() }),
      // },
    },
    handler: referredController.trends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/referrals",
    schema: {
      tags: ["Referred user"],
      response: {
        200: referralsApiSchema,
      },
      querystring: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
      }),
    },
    handler: referredController.list,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/task-referrals",
    schema: {
      tags: ["Referred user"],
      querystring: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
      }),
    },
    handler: referredController.taskReferedEarning,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
  preHandler: isAuthenticated,
  method: "GET",
  url: "/cashback-referrals",
  schema: {
    tags: ["Referred user"],
    querystring: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      date: z.string().optional().describe("MM_YYYY"),
    }),
  },
  handler: referredController.cashbackReferredEarning,
});
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Referred user"],
      // response: {200:apiResponseSchema}
    },
    handler: referredController.dateFormat,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/referral-leaderboard",
    schema: {
      tags: ["Referred user"],
    },
    handler: referredController.referralEarningLeaderboard,
  });
}
