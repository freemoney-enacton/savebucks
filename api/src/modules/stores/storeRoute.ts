import { FastifyInstance } from "fastify";
import { StoreController } from "./store.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import {
    storeDetailsSchema,
    fetchStoreQuerySchema
  } from "./store.schemas";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/",
    schema: {
      querystring: fetchStoreQuerySchema,
      tags: ["Stores"],
      response: {
        // 200: ApiResponseSchema,
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: StoreController.listStores,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/:slug",
    schema: {
      params: z.object({
        slug: z.string(),
      }),
      headers: z.object({
        'x-language': z.string().default('en'),
      }),
      tags: ["Stores"],
      response: {
        // 200: StoreResponseSchema, // Uncomment and define your response schema
      },
    },
    handler: StoreController.getStoreBySlug,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/countries",
    schema: {
      tags: ["Stores"],
    },
    handler: StoreController.getCountries,
  });

  // Authenticated routes for store cashback
  // app.withTypeProvider<ZodTypeProvider>().route({
  //   preHandler: isAuthenticated,
  //   method: "POST",
  //   url: "/stores/:id/cashback",
  //   schema: {
  //     params: z.object({
  //       id: z.string(),
  //     }),
  //     body: z.object({
  //       amount: z.number().positive(),
  //       description: z.string().optional(),
  //     }),
  //     tags: ["Stores"],
  //     response: {
  //       // 201: CashbackResponseSchema, // Uncomment and define your response schema
  //     },
  //   },
  //   handler: StoreController.createCashback,
  // });


}