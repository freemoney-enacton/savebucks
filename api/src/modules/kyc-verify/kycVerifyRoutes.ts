import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as settingsController from "./kycVerify.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "post",
    url: "/",
    schema: {
      tags: ["Kyc Verification"],
      body: z.object({
        redirect_url: z.string(),
      })
    },
    handler: settingsController.getKycVerificationSession,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "post",
    url: "/webhook",
    schema: {
      tags: ["Kyc Verification"],
    },
    handler: settingsController.processKycVerificationWebhook,
  });

  // Add this route alongside existing routes
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "post",
    url: "/check-status",
    schema: {
      tags: ["Kyc Verification"]
    },
    handler: settingsController.checkKycVerificationStatus,
  });
}
