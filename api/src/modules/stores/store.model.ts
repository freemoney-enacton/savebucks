import { db } from "../../database/database";
import { sql, ColumnType } from "kysely"; // Ensure ColumnType is imported
import transformResponse from "../../utils/transformResponse";
import transformData from "../../utils/transformData";
import app from "../../app";
import { getSetCachedData } from "../../utils/getCached";
import { Stores } from "../../database/db"; // Import the Stores interface

export type Decimal = ColumnType<string, number | string, number | string>;

export const columns = {
  translatable: ["name", "about", "terms_todo", "terms_not_todo", "tips", "h1","h2", "meta_title","meta_desc","tracking_speed","title","description"],
  money: [],
  date: ["created_at", "updated_at"],
};

export const couponColumns = {
  translatable: ["title", "description"],
  money: [],
  date: ["start_date","end_date"],
};

export const cashbackColumns = {
  translatable: ["title","description"],
  money: [],
  date: [],
};


export interface StoreCashback {
  id: number;
  store_id: number;
  network_refid?: string;
  title?: string; // multi lang || type=lang
  description?: string; // multi lang || type=lang
  rate_type: 'fixed' | 'percent';
  commission: Decimal; // Use Decimal type
  cashback: Decimal; // Use Decimal type
  enabled: boolean;
  is_manual: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  lock_title: boolean;
}

export interface TransformedCategory {
  id: number;
  name: string; // Assuming the name is a string after transformation
}

export const findStoreBySlug = async (slug: string, language: string) => { console.log("id",slug);
  const store = await db
    .selectFrom("stores")
    .select([
      "id",
      "name",
      "slug",
      "logo",
      "banner_image",
      "homepage",
      "domain_name",
      "deeplink",
      "about",
      "terms_todo",
      "terms_not_todo",
      "tips",
      "cats",
      "cashback_enabled",
      "cashback_percent",
      "cashback_amount",
      "cashback_type",
      "cashback_was",
      "tracking_speed",
      "amount_type",
      "rate_type",
      "confirm_duration",
      "is_claimable",
      "is_shareable",
      "is_featured",
      "country_tenancy",
      "h1",
      "h2",
      "meta_title",
      "meta_desc",
      "offers_count",
      "rating",
      "rating_count"
    ])
    .where("status", "=", "publish")
    .where("slug", "=", slug)
    .executeTakeFirst();

  if (store) {
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
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.val,
    });
    const parts: any = formatter.formatToParts(0);
  
    const currencySymbol = parts.find(
      (part: any) => part.type === "currency"
    ).value;
    //console.log("single store"); 
    //@ts-ignore
    const lang: any =language || JSON.parse(await app.redis.get("default_lang")).val || JSON.parse(await app.redis.get("fallback_lang")).val || "en";
    //console.log("🚀 ~ findStoreBySlug ~ lang:", lang)
    const cashback = await getCashbackByStoreId(store.id,lang,currencySymbol);
    //console.log("🚀 ~ findStoreBySlug ~ cashback:", cashback)
    const coupons = await getCouponsByStoreId(store.id,lang);
 
    let categoriesName = null;
    let similarStores = null;
    if (
  store.cats !== null &&
  store.cats !== undefined &&
  !(Array.isArray(store.cats) && store.cats.length === 0) &&
  !(typeof store.cats === "string" && JSON.parse(store.cats).length === 0)
) {       console.log("if store.cats");
      //console.log(store.cats);  
      const categoryIds = JSON.parse(store.cats);
      
      const categories = await db
        .selectFrom("store_categories")
        .select(["id", "name"]) 
        .where("id", "in", categoryIds)
        .execute();  

        
        
        if(categories.length > 0){
        categoriesName = categories?.map((category:any):string[] => {
          return category.name[lang] || category.name["en"];
        }); 
        if(categoriesName)
        categoriesName = categoriesName ? categoriesName : null; 
       }
        similarStores = await getSimilarStores(store.cats,store.id);

    }

    await db.updateTable("stores")
      .set({
            'visits': sql`visits + 1`
          })
      .where("slug", "=", slug)
      .execute();

 
    const transformedStore = {
      ...store,
      cashback,
      coupons:coupons,
      categories:categoriesName,
      similarStores:similarStores
    };
 
    return transformedStore;
    
  }

  return null;
};

export const listStores = async (name:string|null, page: number | null, limit: number | null, lang: string, category: string|null, country: string|null, logic:string|null,storeIds:string|null) => {
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
  let cat=null
  if(category){
    cat=await db.selectFrom("store_categories")
      .select(["id"])
      .where("slug","=",category)
      .executeTakeFirst()

      await db.updateTable("store_categories").set({'visits': sql`visits + 1`}).where("slug","=",category).execute()
  }
  const count = await db
  .selectFrom("stores")
  .select([sql`COUNT(*)`.as("store_count")])
  .$if(name != null, (qb) =>
    qb.where(sql<any>`JSON_SEARCH(LOWER(stores.name), 'one', LOWER(${name}))   IS NOT NULL`)
  )   
  .$if(country != null, (qb) =>
    // Properly handle the JSON array column for country filtering
    qb.where(sql<any>`JSON_CONTAINS(stores.country_tenancy, JSON_QUOTE(${country}))`)
  )
  .$if(cat != null, (qb) =>
    // Properly handle the category which is stored as longtext but should be JSON
    qb.where(sql<any>`JSON_CONTAINS(stores.cats, JSON_QUOTE(${cat!.id.toString()}))`)
  )
  .$if(logic != null,(qb)=>
    {
      switch (logic) {
        case 'popular':
          // Order by clicks (descending) for popular stores
          return qb.orderBy('clicks', 'desc');
        case 'featured':
          // Filter for featured stores only
          return qb.where('is_featured', '=', 1);
        case 'latest':
          return qb.orderBy("id","desc")
        default:
          // Default sorting if logic value is unrecognized
          return qb
      }
    } 
  ) 
  .$if(logic === "hand_picked" && storeIds != null, (qb) => {
    // Make sure storeIds is a non-empty string before proceeding
    if (typeof storeIds === 'string' && storeIds.trim().length > 0) {
      // Split the string by commas, trim each element, convert to numbers, and filter out invalid numbers.
      const numericIds = storeIds
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));
      
      // If there are valid numeric IDs, apply the filter to the query builder.
      return numericIds.length > 0 ? qb.where('id', 'in', numericIds) : qb;
    }
    return qb;
  })
  
  .where("status", "=", "publish")
  .executeTakeFirst();
// console.log("count", count);
  const query = db
    .selectFrom("stores")
    .select([
      "id",
      "name",
      "slug",
      "logo",
      "banner_image",
      "homepage",
      "domain_name",
      "deeplink",
      "about",
      "terms_todo",
      "terms_not_todo",
      "tips",
      "cats",
      "cashback_enabled",
      "cashback_percent",
      "cashback_amount",
      "cashback_type",
      "cashback_was",
      "tracking_speed",
      "amount_type",
      "rate_type",
      "confirm_duration",
      "is_claimable",
      "is_shareable",
      "is_featured",
      "country_tenancy",
      "is_promoted",
      "h1",
      "h2",
      "meta_title",
      "meta_desc",
      "meta_kw",
      "exclude_sitemap",
      "offers_count",
      "ref_id",
      "rating",
      "rating_count",
      "creation_mode",
      "network_id",
      "network_campaign_id",
      "ghost",
      "filter",
      "status",
      "apply_coupon",
      "checkout_url",
      "exclude_extension",
      "discount",
    ])
    .$if(name != null, (qb) =>
      qb.where(sql<any>`JSON_SEARCH(LOWER(stores.name), 'one', LOWER(${name}))   IS NOT NULL`)
    )   
    .$if(country != null, (qb) =>
      // Properly handle the JSON array column for country filtering
      qb.where(sql<any>`JSON_CONTAINS(stores.country_tenancy, JSON_QUOTE(${country}))`)
    )
    .$if(cat != null, (qb) =>
      // Properly handle the category which is stored as longtext but should be JSON
      qb.where(sql<any>`JSON_CONTAINS(stores.cats, JSON_QUOTE(${cat!.id.toString()}))`)
    )
    .$if(logic != null,(qb)=>
      //switch case, if logic== popular, order by clicks
    //logic==featured if featured flag i set
    //handpicked
    {
      switch (logic) {
        case 'popular':
          // Order by clicks (descending) for popular stores
          return qb.orderBy('clicks', 'desc');
        case 'featured':
          // Filter for featured stores only
          return qb.where('is_featured', '=', 1);
        case 'latest':
          return qb.orderBy("id","desc")
        default:
          // Default sorting if logic value is unrecognized
          return qb
      }
    }
    )
    .$if(logic === "hand_picked" && storeIds != null, (qb) => {
      // Make sure storeIds is a non-empty string before proceeding
      if (typeof storeIds === 'string' && storeIds.trim().length > 0) {
        // Split the string by commas, trim each element, convert to numbers, and filter out invalid numbers.
        const numericIds = storeIds
          .split(',')
          .map(id => parseInt(id.trim(), 10))
          .filter(id => !isNaN(id));
        
        // If there are valid numeric IDs, apply the filter to the query builder.
        return numericIds.length > 0 ? qb.where('id', 'in', numericIds) : qb;
      }
      return qb;
    })
    .$if(page !== undefined, (qb) =>
      qb
        .limit(limit ? limit : 20)
        .offset(
          limit && page
            ? (page - 1) * (limit !== undefined ? limit : 20)
            : 0
        )
    )  
    .where("status", "=", "publish");

 
  //  console.log("count",count);
  // console.log(query.compile());

  const stores = await query.execute(); console.log("stores"); //console.log(stores);
  const currency = await app.redis.get("default_currency");
  const fallback_lang = "en";

  // const transformedData = await transformResponse(
  //   stores,
  //   columns,
  //   fallback_lang,
  //   lang,
  //   currency
  // );
  return { stores, count: count?.store_count ?? 0 };
};



export const getCashbackByStoreId = async (storeId: number, fallback_lang: string, currency: string) => {
  const result = await db
    .selectFrom("store_cashback")
    .select(["cashback", "rate_type", "enabled", "is_manual", "title", "description"])
    .where("store_id", "=", storeId)
    .where("enabled", "=", 1)
    .execute();

  // First transform the response to handle localization
  const transformedResult = await transformResponse(
    result,
    cashbackColumns,
    "en",
    fallback_lang?.toString(),
    null
  );

  // Then add the formatted rate
  const resultsWithFormattedRate = transformedResult.map((item: any) => {
    let rate;
    if (item.rate_type === "percent") {
      rate = `${item.cashback}%`;
    } else if (item.rate_type === "fixed") {
      rate = `${currency}${item.cashback}`;
    } else {
      rate = item.cashback;
    }
    
    return {
      ...item,
      rate
    };
  });

  return resultsWithFormattedRate;
};

export const getCouponsByStoreId = async (storeId: number,lang:string) => {
  const storeCoupons = await db
    .selectFrom("coupons")
    .select(["id","title", "description","store_id", "code","is_featured","start_date","expiry_date"])
    .where("store_id", "=", storeId)
    .execute();

    const transformedResult = await transformResponse(
    storeCoupons,
    cashbackColumns,
    "en",
    lang?.toString(),
    null
  );

  return transformedResult;
};


export const getSimilarStores = async (categoryIds: any, storeId: number) => {
  //console.log("🚀 ~ getSimilarStores ~ categoryIds:", categoryIds);
  
  try {
    // Parse the category IDs
    const categoriesArray: string[] = typeof categoryIds === 'string' 
      ? JSON.parse(categoryIds) 
      : categoryIds;
      
    //console.log("🚀 ~ getSimilarStores ~ categoriesArray:", categoriesArray);
    
    // Use a very basic query that should work with any Kysely setup
    const similarStores = await db
      .selectFrom('stores')
      .select([
        'id', 'name', 'slug', 'logo', 'banner_image', 'homepage', 'domain_name',
        'deeplink', 'cashback_enabled', 'cashback_percent', 'cashback_amount',
        'cashback_type', 'cashback_was', 'tracking_speed', 'amount_type',
        'rate_type', 'confirm_duration', 'is_claimable', 'is_shareable',
        'is_featured', 'country_tenancy', 'rating', 'rating_count', 'status'
      ])
      .where('status', '=', 'publish')
      .where('id', '<>', storeId)
      //@ts-ignore
      .where(eb => {
        // Add category filters one by one
        if (categoriesArray.length === 0) {
          return eb.ref('id'); // Return a dummy condition that's always true
        }
        
        // For the first category
        let condition = eb('cats', 'like', `%"${categoriesArray[0]}"%`);
        
        // Add OR conditions for each additional category
        for (let i = 1; i < categoriesArray.length; i++) {
          //@ts-ignore
          condition = condition.or('cats', 'like', `%"${categoriesArray[i]}"%`);
        }
        
        return condition;
      })
      .limit(10)
      .execute();
    
    //console.log(`Found ${similarStores.length} similar stores`);
    return similarStores;
  } catch (error) {
    console.error("Error in getSimilarStores:", error);
    return [];
  }
};
