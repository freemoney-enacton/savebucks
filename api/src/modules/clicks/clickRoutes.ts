import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./clicks.controller";
import { isAuthenticated, isDeviceID } from "../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  apiResponseSchema,
  clickInsertResponse,
  clickTaskQuerySchema,
  fetchClickTaskQuerySchema,
} from "./clicks.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: [isDeviceID, isAuthenticated],
    method: "POST",
    url: "/insert",
    schema: {
      tags: ["Clicks"],
      body: clickTaskQuerySchema,
      response: {
        200: clickInsertResponse,
      },
    },
    handler: taskController.insert,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Clicks"],
      querystring: fetchClickTaskQuerySchema,
      // response: { 200: apiResponseSchema },
    },
    handler: taskController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.fetchDateClicked,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/trends",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.fetchTrends,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/click-stats",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: taskController.clickStats,
  });
}
