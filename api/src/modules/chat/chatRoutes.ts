import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAuthenticated } from "../../middleware/authMiddleware";
import * as chatController from "./chat.controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/rooms",
    schema: {
      tags: ["chat"],
    },
    handler: chatController.getRooms,
  });


  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/:room_code/messages",
    schema: {
      tags: ["chat"],
      params: z.object({
        room_code: z.string(),
      }),
      querystring: z.object({
        limit: z.string(),
      }),
    },
    handler: chatController.getMessages,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/:room_code/messages",
    schema: {
      tags: ["chat"],
      params: z.object({
        room_code: z.string(),
      }),
      body: z.object({
        message: z.string(),
        country: z.string(),
      })
    },
    handler: chatController.sendMessage,
  });


  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/:room_code/userInfo",
    schema: {
      tags: ["chat"],
      params: z.object({
        room_code: z.string(),
      }),
      querystring: z.object({
        user_id: z.string(),        
      }),
    },
    handler: chatController.getChatUserInfo,
  });
  
}
