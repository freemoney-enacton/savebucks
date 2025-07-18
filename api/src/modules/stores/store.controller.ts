import { FastifyReply, FastifyRequest } from "fastify";
import * as storeModel from "./store.model";
import { FetchStoreQuery,storeResponseSchema, storesResponseSchema } from "./store.schemas";
import app from "../../app";
import { db } from "../../database/database";
import { getSetCachedData } from "../../utils/getCached";

export const listStores = async (req: FastifyRequest, reply: FastifyReply) => {
  const {name,  page = 1, limit = 20, category, country ,logic,store_ids} = req.query as FetchStoreQuery;
  const default_lang: any = await getSetCachedData(
    "default_lang",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_lang")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  
  const langHeader = req.headers["x-language"];
  const lang = Array.isArray(langHeader) ? langHeader[0] : langHeader || "en"; 

  const stores = await storeModel.listStores( 
    name != undefined ? `%${name}%` : null,
    Number(page) || null,
    limit != null ? parseInt(limit.toString()) : limit,
    lang?.toString(),       // CORRECT: lang parameter
    category || null,       // CORRECT: category parameter
    country || null,         // CORRECT: country parameter
    logic || null,
    store_ids || null
  );
  
  const lastPage = limit
  ? Number(stores?.count) / Number(limit)
  : Number(stores?.count) / 20;

  // Fetch all categories and cache them
  const categoryMap = await getAllCategories(lang); //console.log("categoryMap",categoryMap);

  const storeData = await Promise.all(stores.stores.map(async (store: any) => {
    // Normalize countryTenancy to always be an array
    let countryTenancy = store.country_tenancy;
    if (typeof countryTenancy === 'string') {
      // Check if it's a string representation of an array
      if (countryTenancy.startsWith('[') && countryTenancy.endsWith(']')) {
        try {
          countryTenancy = JSON.parse(countryTenancy);
        } catch (e) {
          countryTenancy = [countryTenancy];
        }
      } else {
        // It's a plain string like "IN"
        countryTenancy = [countryTenancy];
      }
    } else if (!Array.isArray(countryTenancy)) {
      // Handle null, undefined, or other non-array types
      countryTenancy = countryTenancy ? [countryTenancy] : [];
    }
    
    return {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logo,
      banner_image: store.banner_image,
      homepage: store.homepage,
      domain_name: store.domain_name,
      deeplink: store.deeplink,
      about: JSON.parse(store.about),
      terms_todo: JSON.parse(store.terms_todo),
      terms_not_todo: JSON.parse(store.terms_not_todo),
      tips: JSON.parse(store.tips),
      cats: JSON.parse(store.cats),
      cashback_enabled: store.cashback_enabled,
      cashback_percent: store.cashback_enabled ?store.cashback_percent :null,
      cashback_amount: store.cashback_enabled ? store.cashback_amount : null,
      cashback_type: store.cashback_type,
      cashback_was: store.cashback_was,
      tracking_speed: JSON.parse(store.tracking_speed),
      amount_type: store.amount_type,
      rate_type: store.rate_type,
      confirm_duration: store.confirm_duration,
      cashback_string: store.cashback_enabled? await getCashbackString(store, lang,default_lang?.val):null,
      is_claimable: store.is_claimable,
      is_shareable: store.is_shareable,
      is_featured: store.is_featured,
      country_tenancy: countryTenancy,  // Using our normalized array here
      h1: JSON.parse(store.h1),
      h2: JSON.parse(store.h2),
      meta_title: JSON.parse(store.meta_title),
      meta_desc: JSON.parse(store.meta_desc),
      offers_count: store.offers_count,
      rating: store.rating,
      rating_count: store.rating_count,
      discount: store.discount,
      categories: store.cats ? await getStoreCategories(lang,store,categoryMap):null
    };
  }));
  return reply.sendSuccess(
    storeData,
    200,
    "null",
    Number(page),
    Number(lastPage.toFixed(0)) == 0 ? 1 : Math.ceil(Number(lastPage))
  );
};

export const getStoreBySlug = async (req: FastifyRequest, reply: FastifyReply) => {
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
  const default_lang: any = await getSetCachedData(
    "default_lang",
    async () => {
      const curr = await db
        .selectFrom("settings")
        .select("val")
        .where("name", "=", "default_lang")
        .executeTakeFirst();
      return JSON.stringify(curr);
    },
    3600,
    app
  );
  const { slug } = req.params as { slug: string };
  const langHeader = req.headers["x-language"];
  const lang = Array.isArray(langHeader) ? langHeader[0] : langHeader; 
  console.log(lang)

  const store = await storeModel.findStoreBySlug(slug, lang!);
  if (!store) {
    return reply.status(404).send({
      success: false,
      data: null,
      error: "Store not found",
      msg: null,
    });
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency?.val,
  });
  const parts: any = formatter.formatToParts(0);

  const currencySymbol = parts.find(
    (part: any) => part.type === "currency"
  ).value;
  console.log("single store"); 

  // Handle country_tenancy to always be an array
// Handle country_tenancy to always be an array
let countryTenancy = store.country_tenancy;

// Convert to array regardless of input format
if (typeof countryTenancy === 'string') {
  // Check if it's a string representation of an array
  if (countryTenancy.startsWith('[') && countryTenancy.endsWith(']')) {
    try {
      countryTenancy = JSON.parse(countryTenancy);
    } catch (e) {
      countryTenancy = [countryTenancy];
    }
  } else {
    // It's a plain string like "IN"
    countryTenancy = [countryTenancy];
  }
} else if (!Array.isArray(countryTenancy)) {
  // Handle null, undefined, or other non-array types
  countryTenancy = countryTenancy ? [countryTenancy] : [];
}

  // const confirmDuration = store.confirm_duration || '90 days'; 
  // const timestamp = parseDuration(confirmDuration); 
  const confirmDays = store.confirm_duration;

let daysToAdd = 0;
let monthsToAdd = 0;

if (confirmDays) {
  const str = confirmDays.toString();
  const match = str.match(/(\d+)\s*(day|week|month|year)s?/i);

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case "day":
        daysToAdd = value;
        break;
      case "week":
        daysToAdd = value * 7;
        break;
      case "month":
        monthsToAdd = value;
        break;
      case "year":
        monthsToAdd = value * 12;
        break;
      default:
        daysToAdd = 0;
    }
  } else {
    // Fallback: try to extract numbers only
    const numMatch = str.match(/\d+/);
    if (numMatch) {
      daysToAdd = parseInt(numMatch[0], 10);
    }
  }
}

const currentDate = new Date();
let endDate = new Date(currentDate);

// Add months
if (monthsToAdd > 0) {
  endDate.setMonth(endDate.getMonth() + monthsToAdd);
}

// Add days
if (daysToAdd > 0) {
  endDate.setDate(endDate.getDate() + daysToAdd);
}

console.log("End Date:", endDate.toISOString().split("T")[0]);
  
  // Format the date as "Month Day, Year" (e.g., "March 30, 2025")
  const cashbackDuration = endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const storeDetail = {
    id: store.id,
    name: store.name,
    slug: store.slug,
    logo: store.logo,
    banner_image: store.banner_image,
    homepage: store.homepage,
    domain_name: store.domain_name,
    deeplink: store.deeplink,
    about: store.about ? JSON.parse(store.about):null,
    terms_todo: store.terms_todo ? JSON.parse(store.terms_todo):null,
    terms_not_todo: store.terms_not_todo ? JSON.parse(store.terms_not_todo):null,
    tips: store.tips ? JSON.parse(store.tips) :null,
    cats: store.cats ? JSON.parse(store.cats) : null,
    cashback_enabled: store.cashback_enabled,
    cashback_percent: store.cashback_percent,
    cashback_amount: store.cashback_amount,
    cashback_type: store.cashback_type,
    cashback_was: store.cashback_was,
    tracking_speed: store.tracking_speed ? JSON.parse(store.tracking_speed) :null,
    amount_type: store.amount_type,
    rate_type: store.rate_type,
    confirm_duration: store.confirm_duration,
    confirm_days : store.confirm_duration? cashbackDuration : null,
    cashback_string:await getCashbackString(store,lang!,default_lang?.val),
    is_claimable: store.is_claimable,
    is_shareable: store.is_shareable,
    is_featured: store.is_featured,
    country_tenancy: countryTenancy,
    h1: store.h1 ? JSON.parse(store.h1) : null, 
    h2: store.h2 ? JSON.parse(store.h2) : null, 
    meta_title: store.meta_title ? JSON.parse(store.meta_title) : null, 
    meta_desc: store.meta_desc ? JSON.parse(store.meta_desc) : null,
    offers_count: store.offers_count,
    rating: store.rating,
    rating_count: store.rating_count,
    currency: currencySymbol,
    cashback:Array.isArray(store.cashback) ?store.cashback:[store.cashback],
    coupons:store.coupons,
    similarStores:store.similarStores,
    categories:store.categories
  };
return reply.sendSuccess(
  storeDetail,
    200,
    "null",
    null,
    null
  );
};

export const getCountries = async (req: FastifyRequest, reply: FastifyReply) => {
  const countries = await db
    .selectFrom("stores")
    .select(["country_tenancy"])
    .where("country_tenancy", "is not", null)
    .where("status", "=", "publish")
    .execute();

  const countryList: string[] = [];

  for (const row of countries) {
    const val = row.country_tenancy;

    // Case 1: It's an array (either JSON array string or JS array)
    if (Array.isArray(val)) {
      const codes = val
        .filter((c): c is string => typeof c === "string" && c.trim().length === 2)
        .map(c => c.trim());

      countryList.push(...codes);
    }

    // Case 2: It's a plain string (like "DE")
    else if (typeof val === "string") {
      const code = val.trim();
      if (code.length === 2) {
        countryList.push(code);
      }
    }

    // Case 3: Ignore objects or other types
  }

  // Deduplicate and return
  const uniqueCountries = [...new Set(countryList)];

  return reply.sendSuccess(uniqueCountries, 200, "Countries fetched successfully",null,null);
};

export const createCashback = async (req: FastifyRequest, reply: FastifyReply) => {
  // Implement your logic to create cashback here
  // This is a placeholder function
  return reply.send({ success: true, message: "Cashback created" });
};

// Note: Removed getCashbackByStoreId from the controller since it's not needed as a separate API
export const StoreController = {
  listStores,
  getStoreBySlug,
  createCashback,
  getCountries
};

// function formatDate(date, formatString) {
//   const day = String(date.getDate()).padStart(2, '0'); // Two-digit day
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Two-digit month (0-based)
//   const year = date.getFullYear(); // Four-digit year
//   const hours = String(date.getHours()).padStart(2, '0'); // Two-digit hours
//   const minutes = String(date.getMinutes()).padStart(2, '0'); // Two-digit minutes
//   const seconds = String(date.getSeconds()).padStart(2, '0'); // Two-digit seconds

//   switch (formatString) {
//       case 'L':
//           return `${month}/${day}/${year}`; // Short date format
//       case 'LL':
//           return `${month}/${day}/${year}`; // Long date format (same as L for simplicity)
//       case 'LLL':
//           return `${month}/${day}/${year} ${hours}:${minutes}`; // Long date format with time
//       case 'LLLL':
//           return `${day}/${month}/${year} ${hours}:${minutes}`; // Full date format with time
//       default:
//           return date.toString(); // Fallback to default string representation
//   }
// }

// function pcb_date(timestamp = null, locale = 'en', formatString = 'L') {
//   const date = timestamp ? new Date(timestamp * 1000) : new Date(); // Convert timestamp to milliseconds
//   return formatDate(date, formatString); // Use the formatDate function
// }


// function parseDuration(duration) {
//   const match = duration.match(/(\d+)\s*(days?|weeks?|months?|years?)/i);
//   if (match) {
//       const value = parseInt(match[1], 10);
//       const unit = match[2].toLowerCase();
//       const now = Date.now();

//       switch (unit) {
//           case 'day':
//           case 'days':
//               return now + value * 86400000; // Convert days to milliseconds
//           case 'week':
//           case 'weeks':
//               return now + value * 604800000; // Convert weeks to milliseconds
//           case 'month':
//           case 'months':
//               return now + value * 2629800000; // Approximate month to milliseconds
//           case 'year':
//           case 'years':
//               return now + value * 31557600000; // Approximate year to milliseconds
//           default:
//               return now; // Default to now if no match
//       }
//   }
//   return Date.now(); // Default to now if no match
// }

async function getCashbackString(store: any,lang:string,default_lang:string): Promise<string|null> {
  if (!store.cashback_enabled) {
      return '';
  }

  // Determine the cashback amount based on the type
  let amount = store.cashback_amount ? store.cashback_amount.toString() : '0';
  const cashbackType = store.cashback_type || 'Cashback';
  const rateType = store.rate_type || 'upto';
  const amountType = store.amount_type || 'fixed';
  try
  {const result=await db
    .selectFrom("settings")
    .selectAll()
    .where("name","=","cashback_sentence")
    .executeTakeFirst()

  if (!result || result.val === null || result.val === undefined) {
    return '';
  }


  // Construct the cashback string based on the type and rate
  const cashbackSentence=JSON.parse(result.val!)
  let cashbackString = cashbackSentence[lang] || cashbackSentence[default_lang] as string;
  

  // Example sentence structure, you can customize this
  if (amountType === 'fixed') {
    amount=await appendCurrency(amount,0)
      cashbackString=cashbackString
      .replace(/#rate_type/i, rateType)
      .replace(/#\s*amount/gi, amount);
      
  } else {
      cashbackString= cashbackString
      .replace(/#rate_type/i, rateType)
      .replace(/#\s*amount/gi, amount+"%");
      
  }

  return cashbackString;}
  catch(e){
    return ''
  }
}

async function appendCurrency(amt :string| number ,prefix:0|1){
  const result=await db
    .selectFrom("settings")
    .selectAll()
    .where("name","=","default_currency")
    .executeTakeFirst()

  if(!result){
    return ''
  }

  if(prefix===1){
    return `${result.val!} ${amt}`
  }
  return `${amt} ${result.val!}`
}

export const getAllCategories = async (lang: string): Promise<Map<number, string>> => {
  const categories = await db
    .selectFrom("store_categories")
    .select(["id", "name"])
    .execute();

  const categoryMap = new Map<number, string>();
  categories.forEach((category: any) => {
    categoryMap.set(category.id, category.name[lang] || category.name["en"]);
  });

  await app.redis.set(
    "all_categories", 
    JSON.stringify(Array.from(categoryMap.entries())), 
    'EX', 
    3600
  );

  return categoryMap;
};

export const getStoreCategories = async (lang: string, store: any,categoryMap:any) => {
  if (!store.cats) {
    return null;
  }

  // Parse the category IDs from the store
  const categoryIds = JSON.parse(store.cats);

  // If categoryMap is not defined, fetch categories
  const categoriesName = categoryIds
    .map((id: string) => categoryMap.get(Number(id)))
    .filter(Boolean); // Remove any undefined values

  return categoriesName.length > 0 ? categoriesName : null;
};

