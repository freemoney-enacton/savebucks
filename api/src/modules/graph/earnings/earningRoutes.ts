import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import * as earningController from "./earning.controller";
import { ResponseSchema } from "./earnings.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Graph"],
      // response: { 200: ResponseSchema },
    },
    handler: earningController.fetchEarning,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/last-30-days",
    schema: {
      tags: ["Graph"],
      // response: { 200: ResponseSchema },
    },
    handler: earningController.fetch30DaysEarnings,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/last-30-days-clicks",
    schema: {
      tags: ["Graph"],
      // response: { 200: ResponseSchema },
    },
    handler: earningController.fetch30DaysClicks,
  });
}
