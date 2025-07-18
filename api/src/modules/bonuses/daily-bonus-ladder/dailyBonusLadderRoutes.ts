import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as dailyBonusLadderController from "./dailyBonusLadder.controller";
import { isAuthenticated } from "../../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/details",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyBonusLadderController.details,
  });
  
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/double",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyBonusLadderController.double,
  });
  
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/claim",
    schema: {
      tags: ["Bonuses"],
    },
    handler: dailyBonusLadderController.claim,
  });
  
}
