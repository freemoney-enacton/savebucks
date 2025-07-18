import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as dailyStreaksController from "./dailyStreaks.controller";
import { isAuthenticated } from "../../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/details",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyStreaksController.details,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/:day/claim",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyStreaksController.claim,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/:day/spin/:userspincode",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyStreaksController.claimSpin,
  });
}
