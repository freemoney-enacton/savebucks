import { FastifyInstance } from "fastify";
import * as postbackController from "./postback.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const postbackDataSchema = z.object({
  hash: z.string(),
  typ: z.string(),
  net: z.string(),
  iky: z.string(),
  uid: z.string(),
  tid: z.string(),
  sts: z.string(),
  amt: z.string().optional(),
  pyt: z.string(),
  oid: z.string().optional(), // Optional fields
  onm: z.string().optional(),
  gid: z.string().optional(),
  sid: z.string().optional(),
  snm: z.string().optional(),
  cip: z.string().optional(),
  scr: z.string().optional(),
  currency:z.string().optional(),
});

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
}
