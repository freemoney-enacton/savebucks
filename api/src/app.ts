import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import fastifyPassport from "@fastify/passport";
import fastifyMultipart from "@fastify/multipart";
import path, { join } from "path";
import autoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import * as auth from "./modules/auth/auth.model";
import fastifyCookie from "@fastify/cookie";
import fastifySecureSession from "@fastify/secure-session";
import cors from "@fastify/cors";
import { config } from "./config/config";
import redisPlugin from "./service/redis";
import { swaggerOptions, swaggerUiOptions } from "./utils/swagger";
import { createJWTToken, decodeToken } from "./modules/auth/jwt";
import "./utils/passport";
import { error, success } from "./utils/sendResponse";
import { getIpDetails } from "./utils/getClientInfo";
import * as authModel from "./modules/auth/auth.model";
import polyglotPlugin from "./plugins/polyglot";
import { isAuthenticated } from "./middleware/authMiddleware";
import multer from "fastify-multer";
import upstashPlugin from "./service/upstash";

declare module "fastify" {
  interface FastifyReply {
    sendSuccess(
      data: any,
      statusCodes: number,
      msg: string | null,
      currentPage: any,
      lastPage: any
    ): void;
    sendError(err: string, statusCodes: number): void;
    sendErrorWithData(err: string, statusCode: number, data: any): void;
  }

  interface FastifyRequest {
    userId: string;
    userName: string;
    userEmail: string;
    userTier: string;
  }
}

export const createApp = (): FastifyInstance => {
  const app = fastify({ logger: true, pluginTimeout: 0 }) as FastifyInstance;
  const sessionSecret = config.env.app.sessionSecret?.toString();
  if (!sessionSecret) {
    throw new Error("Session secret is not defined in the config");
  }
  const sessionSalt = config.env.app.sessionSalt?.toString();
  if (!sessionSalt) {
    throw new Error("Session salt is not defined in the config");
  }
  app.register(require("fastify-healthcheck"));
  // app.register(fastifyMultipart,{
  //   attachFieldsToBody: true,
  //   limits: {
  //     fileSize: 5 * 1024 * 1024, // 5MB limit
  //     files: 1
  //   }
  // });
  app.register(multer.contentParser);
  app.setErrorHandler(
    (error: any, request: FastifyRequest, reply: FastifyReply) => {
      console.log("FastifyRequest error");
      //handle zoderror
      if (error.name === "ZodError") {
        return reply.sendError(error.errors[0].message, 400);
      }
      //handle fastify rate limit errors
      if (error.statusCode === 429) {
        if (error.message === "Rate limit exceeded, retry in 1 minute") {
          return reply.sendError(
            app.polyglot.t("error.rateLimitError").replace("#TIME", "1 minute"),
            429
          );
        } else {
          return reply.sendError(
            app.polyglot
              .t("error.rateLimitError")
              .replace("#TIME", "30 seconds"),
            429
          );
        }
      }
      console.log(error);
      if (error.message?.includes("You are already registered with this Use")) {
        reply.status(409).send({ success: false, error: error.message });
      }
      reply.sendError(app.polyglot.t("error.globalErrorHandler"), 500);
    }
  );
  // Register the polyglot plugin
  app.register(polyglotPlugin);

  app.addHook("onRequest", async (request, reply) => {
    const lang = request.headers["x-language"] || app.polyglot.locale();
    if (app.polyglot) {
      app.polyglot.locale(lang);
    } else {
      console.error("Polyglot is not available");
    }
  });
  app.register(cors);
  app.register(fastifyCookie);
  app.register(fastifySecureSession, {
    secret: sessionSecret,
    salt: sessionSalt,
    sessionName: config.env.app.sessionName,
    cookieName: config.env.app.cookieName,
    cookie: {
      path: "/",
      domain: config.env.app.domain_cookie,
      httpOnly: false,
      expires: new Date(Date.now() + 3600000),
      sameSite: "none",
      secure: true,
    },
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
  app.register(require("@fastify/formbody"));

  app.register(require("@fastify/rate-limit"), {
    // Global settings can be applied here, if needed
    max: 2000, // limit each IP to 100 requests per windowMs
    timeWindow: "10 second", // start counting after 1 minute
  });
  console.log(
    config.env.redis.port,
    config.env.redis.host,
    config.env.redis.password
  );

  redisPlugin(app, {
    // url: config.env.redis.url ? config.env.redis.url.toString() : "",
    port: Number(config.env.redis.port), // Redis port
    host: config.env.redis.host, // Redis host
    password: config.env.redis.password,
    tls: {
      // TLS options to configure secure connection
      rejectUnauthorized: false, // Set to true if you want to verify the server's certificate
    },
  } as any);

  upstashPlugin(app, {
    // url: config.env.redis.url ? config.env.redis.url.toString() : "",
    port: Number(config.env.upstash.port), // Redis port
    host: config.env.upstash.host, // Redis host
    password: config.env.upstash.password,
    tls: {
    },
  }as any);
  // Register autoload for modules
  app.register(autoload, {
    dir: join(__dirname, "modules"),
    options: { prefix: "/api/v1" }, // Use a prefix for all modules
  });
  app.decorateRequest("userId", "");
  // Decorate reply with sendSuccess and sendError
  app.decorateReply(
    "sendSuccess",
    function (
      this: FastifyReply,
      data: any,
      statusCodes: number = 200,
      msg: string | null = null,
      currentPage: any,
      lastPage: any
    ) {
      success(this, statusCodes, data, msg, currentPage, lastPage);
    }
  );

  app.decorateReply(
    "sendError",
    function (this: FastifyReply, err: string, statusCodes: number = 500): any {
      error(this, statusCodes, err);
    }
  );
  //to store static files
  app.register(require("@fastify/static"), {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
  });
  app.get(
    "/auth/google/callback",
    {
      preValidation: fastifyPassport.authenticate("google", {
        scope: ["profile", "email"],
        failureRedirect: "/",
      }),
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user: any = req.user;
      if (user === "Please login! You are already registered!") {
        reply.sendError(
          app.polyglot.t("error.auth.alreadyRegisteredRequest"),
          409
        );
      }
      const userExist = await authModel.login(
        user?.email ?? user.emails[0].value
      );
      const country_code =
        req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
      const client_ip =
        req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];

      if (userExist?.signup_ip === null) {
        const device_id: any = req.cookies.device_id;
        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);
        const metaData = {
          ...clientInfo,
          userAgent: req.headers["user-agent"],
          referrer: req.headers.referer,
        };
        const timezone = clientInfo.timezone ?? "unknown";
        await authModel.updateUserInfo(
          user?.email ?? user.emails[0].value,
          JSON.stringify(metaData),
          client_ip,
          device_id,
          country_code,
          timezone
        );
        let token = await createJWTToken(
          {
            user: {
              id: user.userID,
              name: user.displayName ?? user.name,
              email: user?.email ?? user.emails[0].value,
            },
          },
          `${parseInt(config.env.app.expiresIn)}h`
        );
        await auth.insertAuthLogs(
          userExist.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // return reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=register`
        );
      } else {
        const device_id: any = req.cookies.device_id;
        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);
        const metaData = {
          ...clientInfo,
          userAgent: req.headers["x-user-agent"] ?? req.headers["user-agent"],
          referrer: req.headers["x-referer"] ?? req.headers.referer,
        };
        await auth.insertAuthLogs(
          userExist?.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        let token = await createJWTToken(
          {
            user: {
              id: user.userID,
              name: user.displayName ?? user.name,
              email: user?.email ?? user.emails[0].value,
            },
          },
          `${parseInt(config.env.app.expiresIn)}h`
        );

        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=login`
        );
      }
    }
  );
  app.get("/validate", async (req: FastifyRequest, reply: FastifyReply) => {
    const { token } = req.query as { token: string };
    if (!token) {
      reply.clearCookie("token", {
        path: "/",
        domain: config.env.app.domain_cookie,
      });
      reply.status(403).send({ error: "Not authenticated" });
      return;
    }
    const decoded = await decodeToken(reply, token);
    if (decoded.user) {
      const userExist = await auth.login(decoded.user.email);
      if (!userExist) {
        reply.status(401).send({ error: "User Not Found" });
        return;
      }
      return reply.sendSuccess(null, 200, "Validate Successfully", null, null);
    } else {
      const userExist = await auth.login(decoded.email);
      if (!userExist) {
        reply.status(401).send({ error: "User Not Found" });
        return;
      }
      return reply.sendSuccess(null, 200, "Validate Successfully", null, null);
    }
  });
  app.post(
    "/auth/apple/callback",
    {
      preHandler: fastifyPassport.authenticate("apple"),
    },
    async function (req: FastifyRequest, reply: FastifyReply) {
      const user: any = req.user;
      if (user === "Please login! You are already registered!") {
        reply.sendError(
          app.polyglot.t("error.auth.alreadyRegisteredRequest"),
          409
        );
      }
      const userExist = await authModel.login(user?.email);
      if (userExist?.signup_ip === null) {
        const device_id: any = req.cookies.device_id;
        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);

        const metaData = {
          ...clientInfo,
          userAgent: req.headers["user-agent"],
          referrer: req.headers.referer,
        };
        const timezone = clientInfo.timezone ?? "unknown";
        await auth.insertAuthLogs(
          userExist.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        await authModel.updateUserInfo(
          user?.email,
          JSON.stringify(metaData),
          client_ip,
          device_id,
          country_code,
          timezone
        );
        let token = await createJWTToken(
          { user: req.user },
          `${parseInt(config.env.app.expiresIn)}h`
        );

        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // return reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=register`
        );
      } else {
        const device_id: any = req.cookies.device_id;
        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);

        const metaData = {
          ...clientInfo,
          userAgent: req.headers["user-agent"],
          referrer: req.headers.referer,
        };
        const timezone = clientInfo.timezone ?? "unknown";
        await auth.insertAuthLogs(
          userExist?.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        let token = await createJWTToken(
          { user: req.user },
          `${parseInt(config.env.app.expiresIn)}h`
        );

        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=login`
        );
      }
    }
  );
  app.get(
    "/auth/facebook/callback",
    {
      preHandler: fastifyPassport.authenticate("facebook", {
        failureRedirect: "/auth/login",
      }),
    },
    async function (req: FastifyRequest, reply: FastifyReply) {
      const user: any = req.user;
      if (user === "Please login! You are already registered!") {
        reply.sendError(
          app.polyglot.t("error.auth.alreadyRegisteredRequest"),
          409
        );
      }
      const userExist = await authModel.login(user?.email);
      if (userExist?.signup_ip === null) {
        const device_id: any = req.cookies.device_id;

        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);

        const metaData = {
          ...clientInfo,
          userAgent: req.headers["user-agent"],
          referrer: req.headers.referer,
        };
        const timezone = clientInfo.timezone ?? "unknown";
        await auth.insertAuthLogs(
          userExist.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        await authModel.updateUserInfo(
          user?.email,
          JSON.stringify(metaData),
          client_ip,
          device_id,
          country_code,
          timezone
        );
        let token = await createJWTToken(
          { user: req.user },
          `${parseInt(config.env.app.expiresIn)}h`
        );

        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // return reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=register`
        );
      } else {
        const device_id: any = req.cookies.device_id;

        const country_code =
          req.headers["X-COUNTRY"] ?? req.headers["cf-ipcountry"] ?? "unknown";
        const client_ip =
          req.headers["X-CLIENT-IP"] ?? req.headers["cf-connecting-ip"];
        const clientInfo = await getIpDetails(client_ip);

        const metaData = {
          ...clientInfo,
          userAgent: req.headers["user-agent"],
          referrer: req.headers.referer,
        };
        const timezone = clientInfo.timezone ?? "unknown";
        await auth.insertAuthLogs(
          userExist?.id,
          client_ip,
          device_id,
          JSON.stringify(metaData)
        );
        let token = await createJWTToken(
          { user: req.user },
          `${parseInt(config.env.app.expiresIn)}h`
        );

        reply.setCookie("token", token, {
          path: "/",
          domain: config.env.app.domain_cookie,
        });
        // reply.send({ success: "true", token: token });
        return reply.redirect(
          `${config.env.app.frontend_url}/callback/social?token=${token}${
            userExist?.lang ? `&lang=${userExist.lang}` : ""
          }&action=login`
        );
      }
    }
  );

  return app;
};

// Call the function with the Redis instance
const app: FastifyInstance = createApp();

export default app;
