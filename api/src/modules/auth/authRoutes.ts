import { cronConfig } from "./../../crons/cronConfig";
import rateLimit from "@fastify/rate-limit";
import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyTypeProviderDefault,
} from "fastify";
import * as authController from "./auth.controller";
import z from "zod";
import { isAuthenticated, isDeviceID } from "../../middleware/authMiddleware";
import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  otpSchema,
  passwordSchema,
  registerUserSchema,
  sendOtpSchema,
} from "./auth.schema";
import fastifyPassport from "@fastify/passport";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { config } from "../../config/config";

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isDeviceID,
    method: "POST",
    url: "/register",
    schema: {
      body: registerUserSchema,
      tags: ["Authentication"],
      response: {
        201: z.object({
          success: z.boolean(),
          data: z.optional(
            z.object({
              token: z.string(),              
              join_bonus: z.any(),
            })
          ),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.string().nullable(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
      },
    },
    handler: authController.register,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isDeviceID,
    method: "POST",
    url: "/login",
    schema: {
      body: loginSchema,
      tags: ["Authentication"],
      response: {
        201: z.object({
          success: z.boolean(),
          data: z.optional(
            z.object({
              token: z.string(),
            })
          ),
          error: z.union([z.string(), z.null()]).optional(),
          msg: z.string().nullable(),
          currentPage: z.any(),
          lastPage: z.any(),
        }),
      },
    },
    handler: authController.login,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/logout",
    preValidation: isAuthenticated,
    schema: { tags: ["Authentication"] },
    handler: authController.logout,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/verify-user",
    schema: {
      // querystring: z.object({
      //   token: z.string(),
      // }),
      body: otpSchema,
      tags: ["Authentication"],
    },
    handler: authController.verifyUser,
  });

  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "1 minute",
      },
    },
    method: "POST",
    url: "/forgot-password",
    handler: authController.forgotPassword,
    schema: {
      body: emailSchema,
      tags: ["Authentication"],
    },
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/reset-password",
    schema: {
      body: passwordSchema,
      tags: ["Authentication"],
    },
    handler: authController.resetPassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    preHandler: isAuthenticated,
    method: "POST",
    url: "/change-password",
    schema: {
      body: changePasswordSchema,
      tags: ["Authentication"],
    },
    handler: authController.changePassword,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    // preHandler: isAuthenticated,
    method: "POST",
    url: "/verify-otp",
    schema: {
      body: otpSchema,
      tags: ["Authentication"],
    },
    handler: authController.verifyOtp,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "1 minute",
      },
    },
    method: "POST",
    url: "/send-otp",
    schema: {
      body: sendOtpSchema,
      tags: ["Authentication"],
    },
    handler: authController.sendOtp,
  });
  app.withTypeProvider<ZodTypeProvider>().route({
    config: {
      rateLimit: {
        max: 1,
        timeWindow: "1 minute",
      },
    },
    preHandler: isAuthenticated,
    method: "POST",
    url: "/send-verification-otp",
    schema: {
      body: sendOtpSchema,
      tags: ["Authentication"],
    },
    handler: authController.sendVerificationOtp,
  });
  app.get(
    "/google",
    {
      preValidation: [
        async (request, reply) => {
          console.log("req.query", request.query);
          const { referrer_code, click_code,device_id,is_app } = request.query as {
            referrer_code?: string;
            click_code?: string;
            device_id?: string;
            is_app?:string
          };
          console.log("Referrer code from query:", referrer_code);
          if (referrer_code) {
            reply.setCookie("referrer_code", referrer_code, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });

            if (click_code) {
              reply.setCookie("click_code", click_code, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000, 
                path: "/",
              domain: config.env.app.domain_cookie
              });
            }
            console.log(
              "Referrer code set in cookie:",
              request.cookies.referrer_code
            );
            console.log(
              "Click code set in cookie:",
              request.cookies.click_code
            );
          }
          if(device_id){
            reply.setCookie("encrypted_device_id", device_id, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
          }
          const isAppValue = is_app || "web";
          reply.setCookie("is_app", isAppValue, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
        },
        fastifyPassport.authenticate("google", {
          scope: ["profile", "email"],
        }),
      ],
      preHandler: isDeviceID,
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("GOOGLE API forward");
    }
  );

  app.get(
    "/apple",
    {
      preValidation: [
        async (request, reply) => {
          console.log(request.cookies.referral);
          console.log(request.cookies.click_code);
          const { referrer_code, click_code,device_id,is_app} = request.query as {
            referrer_code?: string;
            click_code?: string;
            device_id?: string;
            is_app?:string
          };
          console.log("Referrer code from query:", referrer_code);
          if (referrer_code) {
            reply.setCookie("referrer_code", referrer_code, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });

            if (click_code) {
              reply.setCookie("click_code", click_code, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000,
                path: "/",
              domain: config.env.app.domain_cookie
              });
            }
            console.log(
              "Referrer code set in cookie:",
              request.cookies.referrer_code
            );
            console.log(
              "Click code set in cookie:",
              request.cookies.click_code
            );
          }
          if(device_id){
            reply.setCookie("encrypted_device_id", device_id, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
          }
          const isAppValue = is_app || "web";
          reply.setCookie("is_app", isAppValue, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
        },
        fastifyPassport.authenticate("apple", {
          scope: ["name", "email"],
        }),
      ],
      preHandler: isDeviceID,
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("APPLE API forward");
    }
  );
  app.get(
    "/facebook",
    {
      preValidation: [
        async (request, reply) => {
          console.log(request.cookies.referral);
          console.log(request.cookies.click_code);
          const { referrer_code, click_code,device_id,is_app } = request.query as {
            referrer_code?: string;
            click_code?: string;
            device_id?: string;
            is_app?:string
          };
          console.log("Referrer code from query:", referrer_code);
          if (referrer_code) {
            reply.setCookie("referrer_code", referrer_code, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });

            if (click_code) {
              reply.setCookie("click_code", click_code, {
                httpOnly: false,
                maxAge: 24 * 60 * 60 * 1000, 
                path: "/",
              domain: config.env.app.domain_cookie
              });
            }
            console.log(
              "Referrer code set in cookie:",
              request.cookies.referrer_code
            );
            console.log(
              "Click code set in cookie:",
              request.cookies.click_code
            );
          }
          if(device_id){
            reply.setCookie("encrypted_device_id", device_id, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
          }
          const isAppValue = is_app || "web";
          reply.setCookie("is_app", isAppValue, {
              httpOnly: false,
              maxAge: 24 * 60 * 60 * 1000, 
              path: "/",
              domain: config.env.app.domain_cookie,
            });
        },
        fastifyPassport.authenticate("facebook", {
          scope: ["email"],
        }),
      ],
      preHandler: isDeviceID,
      schema: { tags: ["Authentication"] },
    },
    async () => {
      console.log("facebook API forward");
    }
  );
}
