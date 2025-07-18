import { optional, z } from "zod";

export const cashbackSchema = z.object({
  id: z.number(),
  store_id: z.number(),
  network_refid: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  rate_type: z.enum(['fixed', 'percent']),
  commission: z.number(),
  cashback: z.number(),
  enabled: z.boolean(),
  is_manual: z.boolean(),
  created_at: z.date().nullable(),
  updated_at: z.date().nullable(),
  lock_title: z.boolean(),
});

export const storeDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  banner_image: z.string().nullable(),
  homepage: z.string(),
  domain_name: z.string().nullable(),
  deeplink: z.string().nullable(),
  // extension_afflink: z.string().nullable(),
  about: z.string().nullable(),
  terms_todo: z.string().nullable(),
  terms_not_todo: z.string().nullable(),
  tips: z.string().nullable(),
  cats: z.string().nullable(),
  cashback_enabled: z.boolean().default(true),
  cashback_percent: z.number(),
  cashback_amount: z.number().nullable(),
  cashback_type: z.string(),
  cashback_was: z.string().nullable(),
  tracking_speed: z.string().nullable(),
  amount_type: z.enum(['percent', 'fixed']),
  rate_type: z.enum(['flat', 'upto']),
  confirm_duration: z.string().nullable(),
  is_claimable: z.boolean().default(true),
  is_shareable: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  country_tenancy: z.string().nullable(),
  is_promoted: z.boolean().default(false),
  h1: z.string().nullable(),
  h2: z.string().nullable(),
  meta_title: z.string().nullable(),
  meta_desc: z.string().nullable(),
  // exclude_sitemap: z.boolean().default(false),
  offers_count: z.number().default(0),
  rating: z.number(),
  rating_count: z.number(),
  // creation_mode: z.string(),
  network_id: z.number().nullable(),
  network_campaign_id: z.string(),
  ghost: z.boolean().default(false),
  status: z.enum(['publish', 'draft', 'trash']),
  // created_at: z.date().nullable(),
  // updated_at: z.date().nullable(),
  // apply_coupon: z.string().nullable(),
  // checkout_url: z.string().nullable(),
  // exclude_extension: z.boolean().default(false),
  // discount: z.string().nullable(),
  cashback: cashbackSchema.nullable(),
});

export const storeResponseSchema = z.object({
  success: z.boolean(),
  data: storeDetailsSchema,
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const storesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(storeDetailsSchema).optional(),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const fetchStoreQuerySchema = z.object({
  name: z.string().optional().nullable().describe("Search keyword"),
  page: z.string().nullable().default("1"),
  limit: z.string().nullable().default("20"),
  country: z.string().optional().nullable().describe("Country code"),
  category: z.string().optional().nullable().describe("Category Id"),
  logic:z.string().optional().nullable().describe("popular/featured/hand_picked"),
  store_ids:z.string().optional().nullable().describe("handpicked store ids")
});

export type FetchStoreQuery = z.infer<typeof fetchStoreQuerySchema>;
