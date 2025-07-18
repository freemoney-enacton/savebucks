import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as clickController from "./clicks.controller";
import { isAuthenticated, isDeviceID } from "../../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  fetchClickQuerySchema,
} from "./clicks.schema";
export default async function (app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Clicks"],
      querystring: fetchClickQuerySchema,
      // response: { 200: apiResponseSchema },
    },
    handler: clickController.fetch,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Clicks"],
      // response: {200:apiResponseSchema}
    },
    handler: clickController.fetchDateClicked,
  });


}
