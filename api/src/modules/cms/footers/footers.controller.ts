import * as footer from "./footers.model";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../../app";
import { db } from "../../../database/database";
import { config } from "../../../config/config";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  const lang = req.headers["x-language"];
  let fallback_lang: any = await app.redis.get("fallback_lang");
  fallback_lang = fallback_lang ? (JSON.parse(fallback_lang)['val'] || 'en') : 'en';

  const content_lang = lang || fallback_lang || 'en';

  const footers = await footer.fetch(lang?.toString() || "");
  if(!footers) reply.sendError(app.polyglot.t("error.footersNotFound"), 404);

  const siteSettings = await db.selectFrom("settings")
    .selectAll()
    .where("name","in",[
      "name",
      "about",
      "logo",
      "app_logo",
      "copyright",


      "facebook",
      "twitter",
      "youtube",
      "instagram",
      "telegram",
      "pinterest",
      "whatsapp",
      "reddit",
      "discord",
      "linkdin",
      "tiktok",
      "snapchat",
    ])
    .execute();

  let siteSettingsKeyVal = Object.fromEntries(siteSettings.map(ss => {
    return [ss.name, ss.val];
  }));

  const getLangData = (item: any) => item ? (JSON.parse(item)[content_lang] || JSON.parse(item)[fallback_lang] || null) : null
  const getLangDataFromObj = (item: any) => item ? (item[content_lang] || item[fallback_lang] || null) : null
  const getImgData = (item: any) => `${config.env.app.image_url}/${item}`;

  const formatedData = footers.map((footer:any)=> {

    if(footer.footer_type == 'about_us') {
      let footer_value = {
        name: siteSettingsKeyVal.name,
        about: getLangData(siteSettingsKeyVal.about),
        logo: getImgData(siteSettingsKeyVal.logo),
        app_logo: getImgData(siteSettingsKeyVal.app_logo),
        copyright: getLangData(siteSettingsKeyVal.copyright),
      }

      return {
        id:footer.id,
        title: getLangData(footer.title),
        footer_type: footer.footer_type,
        footer_value: footer_value,
        sort_order:footer.sort_order
      }
    }

    if(footer.footer_type == 'social_links') {
      let footer_value = [
        "facebook",
        "twitter",
        "youtube",
        "instagram",
        "telegram",
        "pinterest",
        "whatsapp",
        "reddit",
        "discord",
        "linkdin",
        "tiktok",
        "snapchat",
      ]
      .filter((plat: string) => siteSettingsKeyVal[plat])
      .map((plat: string) => [`${plat}_link`, siteSettingsKeyVal[plat]])

      return {
        id:footer.id,
        title: getLangData(footer.title),
        footer_type: footer.footer_type,
        footer_value: Object.fromEntries(footer_value),
        sort_order:footer.sort_order
      }
    }

    if(footer.footer_type == 'links') {
      
      const footerValInternal = JSON.parse(footer.footer_value);
      const footerValInternalLang = getLangDataFromObj(footerValInternal);
      const footerLangValue = Array.isArray(footerValInternalLang) ? footerValInternalLang : Object.values(footerValInternalLang);
      return {
        id:footer.id,
        title: getLangData(footer.title),
        footer_type: footer.footer_type,
        footer_value: footerLangValue,
        sort_order:footer.sort_order
      }
    }

    if(footer.footer_type == 'bottom_links') {
      
      const footerValInternal = JSON.parse(footer.footer_value);
      const footerValInternalLang = getLangDataFromObj(footerValInternal);
      const footerLangValue = Array.isArray(footerValInternalLang) ? footerValInternalLang : Object.values(footerValInternalLang);

      return {
        id:footer.id,
        title: getLangData(footer.title),
        footer_type: footer.footer_type,
        footer_value: footerLangValue,
        sort_order:footer.sort_order
      }
    }

  });

  return reply.sendSuccess(formatedData, 200, "Footers Fetched", null, null);

};
