import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as contactFormController from "./contact-forms.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { responseSchema, querySchema } from "./contact-forms.schema";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Forms"],
      body: z.object({
        name: z.string(),
        email: z.string(),
        reason: z.string(),
        message: z.string(),
      }),
    },
    handler: contactFormController.storeContactForm,
  });
}
