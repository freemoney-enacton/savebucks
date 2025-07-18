import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as businessInquiryFormController from "./business-inquiry-forms.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: ["Forms"],
      body: z.object({
        name: z.string(),
        email: z.string(),
        website: z.string().optional(),
        company_name: z.string().optional(),
        reason: z.string(),
        subject: z.string(),
        message: z.string().optional(),
      }),
    },
    handler: businessInquiryFormController.storeBusinessInquiryForm,
  });
}
