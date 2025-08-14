import { FastifyInstance } from "fastify";
import * as postbackController from "./postback.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { InBrainMappedSchema, postbackDataSchema } from "./postback.schema";
import { z } from "zod";



export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      body: postbackDataSchema,
      tags: ["Postback"],
    },
    handler: postbackController.triggerPostback,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      querystring: postbackDataSchema,
      tags: ["Postback"],
    },
    handler: postbackController.triggerPostback,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/inbrain",
  schema: {
    body: z.any(), // ← Still validate as your format
    tags: ["Postback"],
    description: "inBrain callback (mapped via preParsing)",
  },
  preHandler: async (req, reply) => {
    try {
      const newPayload = await InBrainMappedSchema(req.body);
      req.body = newPayload; 
    } catch (error) {
      throw new Error("Failed to parse body: " + error);
    }
  },
  handler: postbackController.triggerPostback,
});
}
