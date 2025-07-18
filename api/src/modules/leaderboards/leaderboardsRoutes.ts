import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuthenticated } from "../../middleware/authMiddleware";
import * as leaderboardController from "./leaderboards.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/running",
    schema: {
      tags: ["leaderboards"],
    },
    handler: leaderboardController.runningLeaderboards,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/initialize/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
    },
    handler: leaderboardController.initializeLeaderboard,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/end/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
    },
    handler: leaderboardController.endLeaderboard,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/calculate/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
    },
    handler: leaderboardController.calculateLeaderboard,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/details/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
    },
    handler: leaderboardController.leaderboardDetails,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/user-details/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
    },
    handler: leaderboardController.userDetails,
  });
  
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/entries/:code",
    schema: {
      tags: ["leaderboards"],
      params: z.object({
        code: z.string(),
      }),
      querystring: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10"),
      }),
    },
    handler: leaderboardController.leaderboardEntries,
  });
}
