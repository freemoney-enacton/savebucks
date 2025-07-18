import { FastifyInstance } from "fastify";
import * as tickerController from "./ticker.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    logLevel: "silent",
    schema: {
      tags: ["Tickers"],
      querystring: z.object({
        country_code: z.string().optional(),
        limit: z.string().optional().default('20'),
      }),
    },
    handler: tickerController.fetch,
  });
}
