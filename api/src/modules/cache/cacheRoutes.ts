import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as cacheController from "./cache.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/settings",
    schema: {
      tags: ["Cache"],
    },
    handler: cacheController.clearSettingsCache,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/translations",
    schema: {
      tags: ["Cache"],
    },
    handler: cacheController.clearTranslationsCache,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/pages",
    schema: {
      tags: ["Cache"],
    },
    handler: cacheController.clearPagesCache,
  });
}
