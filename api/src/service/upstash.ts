
import { FastifyPluginAsync } from "fastify";
import Redis from "ioredis";

const upstashPlugin: FastifyPluginAsync<{
  host: string;
  port: number;
  password: string;
}> = async (fastify, options) => {
  const redis: any = new Redis({
    host: options.host,
    port: options.port,
    password: options.password,
    tls: {
      // TLS options to configure secure connection
      rejectUnauthorized: false, // Set to true if you want to verify the server's certificate
      }
  });

  fastify.decorate("redisUpstash", redis);

  fastify.addHook("onClose", async (fastifyInstance) => {
    await fastifyInstance.redis.quit();
  });

  return redis;
};

export default upstashPlugin;
