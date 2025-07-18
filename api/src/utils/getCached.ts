import { FastifyInstance } from "fastify";

export const getSetCachedData = async <T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  cacheDuration: number,
  app: FastifyInstance
): Promise<T> => {
  let data: any = await app.redis.get(cacheKey);
  if (!data || data == undefined || data == null) {
    try {
      data = await fetchFunction();
      // Check if data is already a string
      const stringData = typeof data === "string" ? data : JSON.stringify(data);
      await app.redis.set(cacheKey, stringData);
      app.redis.expire(cacheKey, cacheDuration);
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error}`);
    }
  }
  // Parse the cached data before returning
  return JSON.parse(data as any);
};
