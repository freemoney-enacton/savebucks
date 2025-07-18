import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import * as bonusCodeController from "./bonusCodes.controller";
import { isAuthenticated } from "../../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  // app.withTypeProvider<ZodTypeProvider>().route({
  //   preHandler: isAuthenticated,
  //   method: "POST",
  //   url: "/validate/:code",
  //   schema: {
  //     tags: ["Bonuses"],
  //   },
  //   handler: bonusCodeController.validate,
  // });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/claim/:code",
    schema: {
      tags: ["Bonuses"],
    },
    handler: bonusCodeController.claim,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/claim/:code/spin/:usersipncode",
    schema: {
      tags: ["Bonuses"],
    },
    handler: bonusCodeController.claimSpin,
  });
}
