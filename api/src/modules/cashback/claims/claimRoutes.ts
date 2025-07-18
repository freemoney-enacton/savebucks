import { FastifyInstance } from "fastify";
import * as claimController from "./claim.controller";
import { isAuthenticated } from "../../../middleware/authMiddleware";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { apiResponseSchema, requestClaimSchema } from "./claim.schema";
import path from "path";
import { multerHandler, upload } from "../../../middleware/multerMiddleware";


export default async function (app: FastifyInstance) {
 
  
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      tags: ["History"],
      querystring: z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        date: z.string().optional().describe("MM_YYYY"),
        status: z.enum(["confirmed", "pending", "declined"]).optional(),
      }),
      // response: {
      //   200: apiResponseSchema,
      // },
    },
    handler: claimController.list,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/month-year",
    schema: {
      tags: ["Claims"],
      // response: {200:apiResponseSchema}
    },
    handler: claimController.dateFormat,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler:[isAuthenticated,multerHandler(upload.single('receipt'))],
    method:"POST",
    url:"/create",
    schema:{
      tags:["Claims"],
      consumes: ["multipart/form-data"],
    },
    handler:claimController.insertClaim,
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler:isAuthenticated,
    method:"GET",
    url:"/claim-clicks/:storeid",
    schema:{
      tags:["Claims"],
    },
    handler:claimController.getClaimableClicks
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler:isAuthenticated,
    method:"GET",
    url:"/claim-stores",
    schema:{
      tags:["Claims"],
    },
    handler:claimController.getStoreWithClaimableClicks
  })

}
