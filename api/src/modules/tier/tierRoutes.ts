import { FastifyInstance } from "fastify";
import * as tierController from "./tier.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["Tiers"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.array(
            z.object({
              tier: z.number(),
              label: z.string().nullable(),
              icon: z.string().nullable(),
              affiliate_commission: z.number().nullable(),
              required_affiliate_earnings: z.number().nullable(),
              is_active_user: z.number().nullable(),
            })
          ),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.union([z.string(), z.null()]).optional(),
        }),
      },
    },
    handler: tierController.fetch,
  });
}
