import { FastifyRedis } from "@fastify/redis";
import { FastifyPluginAsync } from "fastify";
import Redis from "ioredis";

declare module "fastify" {
  interface FastifyInstance {
    redis: FastifyRedis;
    polyglot: any;
  }
}

const redisPlugin: FastifyPluginAsync<{
  host: string;
  port: number;
  password: string;
}> = async (fastify, options) => {
  const redis: any = new Redis({
    host: options.host,
    port: options.port,
    password: options.password,
  });

  fastify.decorate("redis", redis);

  fastify.addHook("onClose", async (fastifyInstance) => {
    await fastifyInstance.redis.quit();
  });

  return redis;
};

export default redisPlugin;
