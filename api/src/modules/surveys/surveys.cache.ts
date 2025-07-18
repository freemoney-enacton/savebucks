import app from "../../app";
import { TransformedSurveyData } from "./surveys_strategies/getBitlabsData";
export const getCachedData = async (
  cacheKey: string,
  fetchFunction: () => Promise<TransformedSurveyData[]>,
  cacheDuration: string
) => {
  let data: any = await app.redis.get(cacheKey);
  if (!data) {
    try {
      data = await fetchFunction();
      await app.redis.set(cacheKey, JSON.stringify(data));
      app.redis.expireat(cacheKey, cacheDuration);
    } catch (error: any) {
      throw new Error(`Failed to fetch data: ${error.message || error}`);
    }
  }

  return data;
};
