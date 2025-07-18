import { FastifyReply, FastifyRequest } from "fastify";
import { decodeToken } from "../modules/auth/jwt";
import * as auth from "../modules/auth/auth.model";
import { config } from "../config/config";

export const isAuthenticated = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const token = req.cookies.token || req.headers["authorization"] || req.headers["token"];
  const userIP = req.headers["X-CLIENT-IP"] || req.headers["x-forwarded-for"];
  const userCountry = req.headers["X-COUNTRY"] || req.headers["x-forwarded-for"];
  //@ts-ignore
  req.userIp = userIP;
  if (!token) {
    reply.clearCookie("token", {
      path: "/",
      domain: config.env.app.domain_cookie,
    });
    reply.status(403).send({ error: "Not authenticated" });
    return;
  }

  // @ts-ignore
  if(token.startsWith("email_")){
    // @ts-ignore
    const userEmail = token.split("email_")[1];
    const userExist = await auth.login(userEmail);
    if (!userExist) {
      reply.status(404).send({ error: "User Not Found" });
      return;
    }
    req.user = userExist;
    req.userId = userExist.id.toString();
    req.userName = userExist.name;
    req.userEmail = userExist.email ? userExist.email : "";
    // @ts-ignore
    req.userTier = userExist.current_tier ? userExist.current_tier : 1;
  } else {
    const decoded = await decodeToken(reply, token);
    if (decoded.user) {
      const userExist = await auth.login(decoded.user.email);
      if (!userExist) {
        reply.status(404).send({ error: "User Not Found" });
        return;
      }
      req.user = userExist;
      req.userId = userExist.id.toString();
      req.userName = userExist.name;
      req.userEmail = userExist.email ? userExist.email : "";
      // @ts-ignore
      req.userTier = userExist.current_tier ? userExist.current_tier : 1;
    } else {
      const userExist = await auth.login(decoded.email);
      if (!userExist) {
        reply.status(404).send({ error: "User Not Found" });
        return;
      }
      req.user = userExist;
      req.userId = userExist.id.toString();
      req.userName = userExist.name;
      req.userEmail = userExist.email ? userExist.email : "";
      // @ts-ignore
      req.userTier = userExist.current_tier ? userExist.current_tier : 1;
    }
  }
};
export const isDeviceID = async (req: FastifyRequest, reply: FastifyReply) => {
  const device_id = req.cookies.device_id;
  const userIP = req.headers["x-forwarded-for"];
  //@ts-ignore
  req.userIp = userIP;
  if (!device_id) {
    const id = crypto.randomUUID();
    reply.setCookie("device_id", id, {
      path: "/",
      domain: config.env.app.domain_cookie,
    });
  }
};
