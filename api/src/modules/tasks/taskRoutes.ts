import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as taskController from "./task.controller";
import { isAuthenticated } from "../../middleware/authMiddleware";
import {
  ApiResponseSchema,
  activeTaskResponseSchema,
  fetchTaskQuerySchema,
  taskResponseSchema,
} from "./task.schemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { multerHandler, upload } from "../../middleware/multerMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "GET",
    url: "/",
    schema: {
      querystring: fetchTaskQuerySchema,
      tags: ["Tasks"],
      response: {
        // 200: ApiResponseSchema,
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: taskController.list,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/:network/:task_id",
    schema: {
      params: z.object({
        network: z.string(),
        task_id: z.string(),
      }),
      tags: ["Tasks"],
      response: {
        // 200: activeTaskResponseSchema,
      },
    },
    handler: taskController.details,
  });
  
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/:slug",
    schema: {
      params: z.object({
        slug: z.string(),
      }),
      tags: ["Tasks"],
      response: {
        // 200: activeTaskResponseSchema,
      },
    },
    handler: taskController.detailsBySlug,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/active",
    schema: {
      tags: ["Tasks"],
      querystring: z.object({
        name: z.string().optional().nullable().describe("Task name"),
        network: z.string().optional().nullable().describe("Network code")
      }),
      response: {
        // 200: activeTaskResponseSchema,
      },
    },
    handler: taskController.active,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/active-task-poviders",
    schema: {
      tags: ["Tasks"],
    },
    handler: taskController.activeTaskProviders,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/recommended",
    schema: {
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      querystring:z.object({
        name: z.string().optional().nullable().describe("Task name"),
        platform: z
          .string()
          .optional()
          .nullable()
          .describe("Comma separated platform codes"),
        page: z.string().nullable().default("1"),
        limit: z.string().nullable().default("20"),
      }),
      tags: ["Tasks"],
      response: {
        // 200: activeTaskResponseSchema,
      },
    },
    handler: taskController.recommended,
  });
  
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/vip",
    preHandler: isAuthenticated,
    schema: {
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
      querystring:z.object({
        name: z.string().optional().nullable().describe("Task name"),
        platform: z
          .string()
          .optional()
          .nullable()
          .describe("Comma separated platform codes"),
      }),
      tags: ["Tasks"],
      response: {
        // 200: activeTaskResponseSchema,
      },
    },
    handler: taskController.vip,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    method:"POST",
    url:"/upload",
    preHandler:[isAuthenticated,multerHandler(upload.single('screenshot'))],
    schema:{
      tags:["Tasks"],
      consumes: ["multipart/form-data"],
    },
    handler: taskController.screenshotUpload,
  })

  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
      method: "GET",
      url: "/redirect/:code",
      schema: {
        tags: ["Tasks"],
        params: z.object({
          code: z.string(),
        }),
      },
      handler: taskController.fetchUrl,
    });
  
    
}
