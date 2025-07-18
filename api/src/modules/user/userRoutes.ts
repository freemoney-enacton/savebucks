import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as userController from "./user.controller";
import * as userModel from "./user.model";
import z from "zod";
import { isAuthenticated } from "../../middleware/authMiddleware";

import { ZodTypeProvider } from "fastify-type-provider-zod";
import { phoneValidator } from "../auth/auth.schema";
import { multerHandler, upload } from "../../middleware/multerMiddleware";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/me",
    schema: {
      tags: ["Users"],
      // response: {
      //   200: z.object({
      //     success: z.boolean(),
      //     data: z.object({
      //       id: z.number(),
      //       name: z.string(),
      //       email: z.string().optional().nullable(),
      //       phone_no: z.any(),
      //       referral_code: z.any(),
      //       is_email_verified: z.any(),
      //       is_phone_no_verified: z.any(),
      //       status: z.any(),
      //       country_code: z.any(),
      //       is_private: z.any(),
      //       referrerName: z.any(),
      //       created_at: z.any(),
      //       provider_type: z.any(),
      //       tierDetails: z.any(),
      //       tier: z.any(),
      //       tier_label: z.any(),
      //       tier_affiliate_commission: z.any(),
      //       affiliate_earnings: z.any(),
      //       promotion_update: z.any(),
      //     }),
      //     error: z.union([z.string(), z.null()]).optional(),
      //     msg: z.string(),
      //     currentPage: z.any(),
      //     lastPage: z.any(),
      //   }),
      //   401: z.object({
      //     error: z.string(),
      //   }),
      // },
    },
    handler: userController.findUser,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/public-profile/list",
    schema: {
      tags: ["Users"],
      querystring: z.object({
        q: z.string().optional(),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.array(
            z.object({
              id: z.number().optional(),
              name: z.string().optional(),
              phone_no: z.any().optional(),
              referral_code: z.any().optional(),
              country_code: z.any().optional(),
              is_private: z.any().optional(),
              created_at: z.any().optional(),
              tierDetails: z.any().optional(),
            })
          ),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.string(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: userController.getUserPublicProfileList,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/public-profile/:referralCode",
    schema: {
      tags: ["Users"],
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.object({
            id: z.number().optional(),
            name: z.string().optional(),
            phone_no: z.any().optional(),
            referral_code: z.any().optional(),
            country_code: z.any().optional(),
            is_private: z.any().optional(),
            avatar:z.any().optional(),
            created_at: z.any().optional(),
            tierDetails: z.any().optional(),
            stats: z.any().optional(),
          }),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.string(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: userController.getUserPublicProfile,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/public-profile-activity/:referralCode",
    schema: {
      tags: ["Users"],
      querystring: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("5"),
      }),
      response: {
        200: z.object({
          success: z.boolean(),
          data: z.any(),
          // data: z.array(z.object({
          //   id: z.any(),
          //   task_offer_id: z.any(),
          //   task_name: z.any(),
          //   task_image: z.any(),
          //   earning: z.any(),
          //   last_activity: z.any(),
          // })),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.string(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: userController.getUserPublicActivities,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: [isAuthenticated,multerHandler(upload.single('avatar'))],
    method: "POST",
    url: "/update",
    schema: {
      tags: ["Users"],
      consumes: ["multipart/form-data"],
      // body: z.object({
      //   name: z
      //     .string()
      //     .min(1, app.polyglot.t("error.zod.minError").replace('#VAR', 'Name').replace('#NUM', '1'))
      //     .max(255, app.polyglot.t("error.zod.passwordMaxError"))
      //     .optional().nullable(),
      //   email: z
      //     .string()
      //     .email()
      //     .max(255, app.polyglot.t("error.zod.passwordMaxError"))
      //     .optional().nullable(),
      //   phone_no: phoneValidator.optional().nullable(),
      //   is_private: z.boolean().optional().default(false),
      // }),
    },
    handler: userController.updateUser,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/update-settings",
    schema: {
      tags: ["Users"],
      body: z.object({
        is_private: z.number().optional().default(0),
        promotion_update: z.number().optional().default(0),
        country_code: z.string().optional().nullable(),
      }),
    },
    handler: userController.updateUserSettings,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/r/:referralCode",
    schema: {
      tags: ["Users"],
      params: z.object({
        referralCode: z
          .string()
          .regex(/^[A-Za-z]+$/, {
            message: app.polyglot.t("error.zod.referralCodeValidation"),
          })
          .min(5, {
            message: app.polyglot
              .t("error.zod.referralCodeLettersValidation")
              .replace("#NUM", 5),
          })
          .max(10, {
            message: app.polyglot
              .t("error.zod.referralCodeLettersValidation")
              .replace("#NUM", 10),
          }),
      }),
    },
    handler: userController.updateReferCode,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/remove",
    schema: {
      tags: ["Users"],
    },
    handler: userController.deleteUser,
  });
  // app.withTypeProvider<ZodTypeProvider>().route({
  //   preHandler: isAuthenticated,
  //   method: "POST",
  //   url: "/add-payment",
  //   schema: {
  //     tags: ["Users"],
  //     body: z.object({
  //       name: z.string(),
  //       payment_method_code: z.string(),
  //       account: z.string(),
  //       payment_inputs: z.any(),
  //       enabled: z.number().describe("Enabled or not (0 or 1)"),
  //     }),
  //   },
  //   handler: userController.addPaymentMode,
  // });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/payment-mode",
    schema: {
      tags: ["Users"],
      querystring: z.object({
        methodCode: z.string(),
      }),
    },
    handler: userController.getPaymentMode,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/notification",
    schema: {
      tags: ["Users"],
      headers: z.object({
        "x-language": z.string({
          required_error: app.polyglot
            .t("error.zod.requiredError")
            .replace("#VAR", "Language"),
        }),
      }),
    },
    handler: userController.getNotification,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "GET",
    url: "/notifications/mark-as-read/:id",
    schema: {
      tags: ["Users"],
      params: z.object({
        id: z.any().describe("Notification ID"),
      }),
    },
    handler: userController.readNotification,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/notifications/mark-as-read-all",
    schema: {
      tags: ["Users"],
    },
    handler: userController.readAllNotification,
  });
}
