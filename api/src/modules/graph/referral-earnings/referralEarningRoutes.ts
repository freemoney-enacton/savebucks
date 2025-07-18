import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import * as referralEarningController from "./referral-earning.controller";


export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/last-30-days",
    schema: {
      tags: ["Graph"],
    },
    handler: referralEarningController.fetch30DaysEarnings,
  });
}
