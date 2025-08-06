import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import * as revuController from "./recommended.controller";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      querystring: z.object({
        limit: z.string().default("20"),
        page: z.string().optional(),
      }),
      tags: ["Revu"],
    },
    handler: revuController.fetchRecommendedOffers,
  });
}