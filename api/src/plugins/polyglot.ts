import fp from "fastify-plugin";
import Polyglot from "node-polyglot";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import path from "path";
import fs from "fs";
import app from "../app";
async function polyglotPlugin(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  //@ts-ignore
  const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
  const defaultLocale = fallback_lang?.val ?? "en";
  const localesPath = path.join(__dirname, "../locales");
  const locales: { [key: string]: any } = {};

  // Load locale files
  fs.readdirSync(localesPath).forEach((file) => {
    const locale = path.basename(file, path.extname(file));
    const translations = JSON.parse(
      fs.readFileSync(path.join(localesPath, file), "utf8")
    );
    locales[locale] = translations;
  });

  const polyglot = new Polyglot({
    locale: defaultLocale,
    phrases: locales[defaultLocale],
  });

  fastify.decorate("polyglot", polyglot);

  fastify.addHook("onRequest", (request, reply, done) => {
    const lang = request.headers["x-language"] || defaultLocale;
    if (locales[lang.toString()]) {
      polyglot.locale(lang.toString());
      polyglot.replace(locales[lang.toString()]);
    } else {
      polyglot.locale(defaultLocale);
      polyglot.replace(locales[defaultLocale]);
    }
    done();
  });
}

export default fp(polyglotPlugin, { name: "polyglot" });
