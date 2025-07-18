
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";
import * as bonusAssignController from "./bonusAssign.controller"


export default async function (app: FastifyInstance) {

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/claim/:code",
    schema: {
      tags: ["Bonuses"],
      params:z.object({
        "code":z
        .string()
        .max(255, app.polyglot.t("error.zod.referralCodeMaxError")),
      })
    },
    handler: bonusAssignController.assign,
  });

}
