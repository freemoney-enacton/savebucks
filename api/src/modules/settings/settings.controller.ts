import * as settings from "./settings.model";
import { FastifyReply, FastifyRequest } from "fastify";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";
import { db } from "../../database/database";
import transformResponse from "../../utils/transformResponse";
export const columns = {
  translatable: ["val", "meta_title", "meta_desc"],
  // hidden: ["ID", "status", "category_id"],
  money: [],
  date: [],
};

import { config } from "../../config/config";

export const fetch = async (req: FastifyRequest, reply: FastifyReply) => {
  getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
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
    "offers_earning",
    async () => {
      const offers_earning = await db
        .selectFrom("offerwall_tasks")
        .select(db.fn.sum("payout").as("totalPayout"))
        .where("status", "=", "publish")
        .executeTakeFirst();
        return offers_earning ? offers_earning.totalPayout : 0;
      },
    3600,
    app
  );

  await getSetCachedData(
    "offers_count",
    async () => {
      const publishedOffersCount  = await db
        .selectFrom("offerwall_tasks")
        .select(db.fn.count("id").as("count"))
        .where("status", "=", "publish")
        .executeTakeFirst();
        return publishedOffersCount  ? publishedOffersCount.count : 0;
      },
    3600,
    app
  );

  const settingsData: any = await getSetCachedData(
    "settings",
    async () => {
      return JSON.stringify(await settings.fetchAll());
    },
    3600,
    app
  );

  const lang = req.headers["x-language"];
  const languages = await settings.fetchLanguage();
  const bonuses = await settings.fetchBonus();
  const countries = await settings.fetchCountry();
  const currencies =await settings.fetchCurrency()
  const defaultCurrency = await settings.getDefaultCurrency();
  const currencySymbol = defaultCurrency?.symbol;

  const minAmt= await settings.fetchMinAmount();
  const minimum_withdrawal_amount=minAmt?.lowest_minimum_amount

  await getSetCachedData(
    "minimum_withdrawal_amount",
    async ()=>{
      const result = await db
        .selectFrom("payment_types")
        .select(({ fn }) => [
          fn.min("minimum_amount").as("lowest_minimum_amount")
        ])
        .executeTakeFirst();

        return result ? result.lowest_minimum_amount : 0
    },
    3600,
    app
  )

  const currency: any = await getSetCachedData(
    "default_currency",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_currency")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );

    //@ts-ignore
    const fallback_lang: any = JSON.parse(await app.redis.get("fallback_lang"));
    const transformedResponse = await transformResponse(
      settingsData,
      columns,
      fallback_lang?.val,
      lang?.toString() || "en",
      null
    );
    
    const transformData: any = (data: any) => {
      // @ts-ignore
      const grouped = data.reduce((acc, { group, name, val }) => {
        if (!acc[group]) {
          acc[group] = {};
        }
        acc[group][name] = val;

        const imagePrefix = `${config.env.app.image_url}`;
        if(group == 'default' && ["logo","app_logo","favicon","token_icon","light_logo","trust_pilot_logo"].includes(name)) acc[group][name] = `${imagePrefix}/${val}`

        if([
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
        ].includes(name)) {
          if(!acc["social_handles"]) acc["social_handles"] = {};
          
          acc["social_handles"][name + "_link"] = val;
        }
        
        if([
          "cta_enabled",
          "cta_location",
          "cta_bg_color",
          "cta_content",
        ].includes(name)) {
          if(!acc["cta_bar"]) acc["cta_bar"] = {};
          
          acc["cta_bar"][name] = val;
        }

        if([
          "intercom_enabled",
          "kyc_verification_enabled",
          "kyc_verification_on_first_payout",
        ].includes(name)) {
          if(!acc["services"]) acc["services"] = {};
          
          acc["services"][name] = val;
        }
        
        if([
          "contact_us_title",
          "contact_us_desc",
          "business_inquiry_title",
          "business_inquiry_desc",
          "faq_title",
          "faq_desc",
          "offers_title",
          "offers_desc",

          "userdashboard_earning_title",
          "userdashboard_withdrawal_title",
          "userdashboard_ongoing_offers_title",
          "userdashboard_chargebacks_title",
          "userdashboard_referearn_title",
          "userdashboard_profile_title",
          "all_store_meta_title",
          "all_store_meta_desc",
          "robots_disallow_paths"
        ].includes(name)) {
          if(!acc["seo"]) acc["seo"] = {};
          
          acc["seo"][name] = val;
        }
        
        if([
          "cashout_card_style",
          "primary_btn_gr",
          "outline_btn_border_gr",
          "btn_primary_text",
          "btn_outline_text",
          "footer_bg",
          "footer_text",
          "body_bg",
          "card_bg",
          "card_secondary_bg",
          "body_text_primary",
          "body_text_secondary",
          "border_gr",
          "border_hover_gr",
          "section_title_gr",
          "primary_gr",
          "input_bg",
          "secondary_gr",
          "partner_card_style",
          "primary",
          "offer_style",
        ].includes(name)) {
          if(!acc["theme"]) acc["theme"] = {};

          acc["theme"][name] = val;
        }

        if([
          "gtm_pixel_id",
          "fb_pixel_id",
        ].includes(name)) {
          if(!acc["analytics"]) acc["analytics"] = {};

          acc["analytics"][name] = val;
        }

        if([
          "contact_form_reasons",
          "business_inquiry_reasons",
        ].includes(name)) {
          if(!acc["forms"]) acc["forms"] = {};

          acc["forms"][name] = val.replaceAll("\r","").split("\n").filter((str: any) => !!str);
        }

        if([
          "code_head",
          "code_foot",
          "code_body",
          "offer_default_filter",
          "disable_ios_offers",
          "product_client_id"
        ].includes(name)) {
          if(!acc["dev"]) acc["dev"] = {};

          acc["dev"][name] = val;
        }

        if([
          "app_ios",
          "app_android",
        ].includes(name)) {
          if(!acc["download"]) acc["download"] = {};
          
          acc["download"][name + "_link"] = val;
        }
        return acc;
      }, {});

      return grouped;
    };

    const currentCountry = req.headers["x-country"]  ?? req.headers["cf-ipcountry"] ?? "unknown";

    const transformedData = transformData(transformedResponse);

    const pagesMetaTitleDesc = await settings.getPagesMetaTitleDesc();
    

    let pagesMetaTitleDescFormated = pagesMetaTitleDesc.reduce((a: any,i: any) => { 
      if(i['slug']) a[i['slug']] = i;
      if(i['meta_title']) a[i['slug']]['meta_title'] = a[i['slug']]['meta_title'][lang?.toString() || fallback_lang?.val || "en"];
      if(i['meta_desc']) a[i['slug']]['meta_desc'] = a[i['slug']]['meta_desc'][lang?.toString() || fallback_lang?.val || "en"];
      return a 
    }, {});

    transformedData['page_seo'] = pagesMetaTitleDescFormated;
    const offers_earning: string|null = await app.redis.get("offers_earning");
    const offers_count: string|null = await app.redis.get("offers_count");


    // If no group is specified, return all data
    return reply.sendSuccess(
      {
        ...transformedData,
        languages,
        bonuses,
        countries,
        currencies,
        currencySymbol,
        currentCountry,
        defaultCurrency,
        minimum_withdrawal_amount,
        offers_earning,
        offers_count
      },
      200,
      "null",
      null,
      null
    );
  
};
