import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";
import * as translation from "../translations/translations.model";
import * as settings from "../settings/settings.model";
import { db } from "../../database/database";
import * as pages from "../cms/pages/pages.model";
export const clearSettingsCache = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  app.redis.del("web_settings");
  app.redis.del("seo_settings");
  app.redis.del("email_settings");
  app.redis.del("default_currency");
  app.redis.del("settings");

  await getSetCachedData(
    "settings",
    async () => {
      return JSON.stringify(await settings.fetchAll());
    },
    3600,
    app
  );
  await getSetCachedData(
    "web_settings",
    async () => {
      return JSON.stringify(await settings.fetch("web"));
    },
    3600,
    app
  );
  await getSetCachedData(
    "seo_settings",
    async () => {
      return JSON.stringify(await settings.fetch("seo"));
    },
    3600,
    app
  );
  await getSetCachedData(
    "email_settings",
    async () => {
      return JSON.stringify(await settings.fetch("email"));
    },
    3600,
    app
  );
  await getSetCachedData(
    "default_currency",
    async () => {
      return JSON.stringify(
        await db
          .selectFrom("settings")
          .select("val")
          .where("name", "=", "default_currency")
          .executeTakeFirst()
      );
    },
    3600,
    app
  );
  await getSetCachedData(
    "fallback_lang",
    async () => {
      return JSON.stringify(
        await db
          .selectFrom("settings")
          .select("val")
          .where("name", "=", "fallback_lang")
          .executeTakeFirst()
      );
    },
    3600,
    app
  );
  await getSetCachedData(
    "default_lang",
    async () => {
      return JSON.stringify(
        await db
          .selectFrom("settings")
          .select("val")
          .where("name", "=", "default_lang")
          .executeTakeFirst()
      );
    },
    3600,
    app
  );
  return reply.sendSuccess("", 200, "Settings Cache Cleared", null, null);

};
export const clearTranslationsCache = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  app.redis.del("translations");
  await getSetCachedData(
    "translations",
    async () => JSON.stringify(await translation.fetch()),
    3600,
    app
  );
  return reply.sendSuccess("", 200, "Translations Cache Cleared", null, null);
};
export const clearPagesCache = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  app.redis.del("pages");
  await getSetCachedData(
    "pages",
    async () => JSON.stringify(await pages.fetch()),
    3600,
    app
  );
  return reply.sendSuccess("", 200, "Pages Cache Cleared", null, null);
};
