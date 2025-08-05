import type { ColumnType } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export interface Audits {
  auditable_id: number;
  auditable_type: string;
  created_at: Date | null;
  event: string;
  id: Generated<number>;
  ip_address: string | null;
  new_values: string | null;
  old_values: string | null;
  tags: string | null;
  updated_at: Date | null;
  url: string | null;
  user_agent: string | null;
  user_id: number | null;
  user_type: string | null;
}

export interface AuthLogs {
  created_at: Generated<Date | null>;
  device_id: string | null;
  id: Generated<number>;
  ip: string | null;
  meta_data: Json | null;
  updated_at: Date | null;
  user_id: number | null;
}

export interface Banners {
  btn_link: string;
  btn_text: string;
  created_at: Generated<Date>;
  description: string;
  desktop_img: string;
  have_content: Generated<number | null>;
  id: Generated<number>;
  link: string;
  mobile_img: string;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Date | null;
}

export interface Blocks {
  blocks: string;
  content: string | null;
  created_at: Generated<Date>;
  description: string | null;
  id: Generated<number>;
  name: string;
  purpose: string;
  status: "" | "draft" | "publish" | "trash";
  title: string | null;
  updated_at: Date | null;
}

export interface BonusCodes {
  amount: Decimal | null;
  code: string;
  created_at: Date | null;
  description: string | null;
  enabled: Generated<number>;
  end_date: Date | null;
  id: Generated<number>;
  image: string | null;
  reward_type: string;
  spin_code: string | null;
  start_date: Date | null;
  tier: number | null;
  title: string;
  updated_at: Date | null;
  usage_count: Generated<number>;
  usage_limit: number | null;
}

export interface BonusTypes {
  amount: Decimal;
  code: string;
  enabled: Generated<number>;
  id: Generated<number>;
  name: string;
  qualifying_amount: number;
  validity_days: Generated<number>;
}

export interface Broadcasts {
  content: string;
  created_at: Generated<Date>;
  id: Generated<number>;
  image: string | null;
  title: string;
  updated_at: Generated<Date>;
  url: string;
  user_id: Generated<number | null>;
}

export interface BusinessInquiries {
  company_name: string | null;
  created_at: Generated<Date | null>;
  email: string;
  id: Generated<number>;
  message: string | null;
  name: string;
  reason: string;
  subject: string;
  updated_at: Generated<Date | null>;
  website: string | null;
}

export interface Cache {
  expiration: number;
  key: string;
  value: string;
}

export interface CacheLocks {
  expiration: number;
  key: string;
  owner: string;
}

export interface CampaignRates {
  amount: Decimal;
  base_amount: Decimal;
  campaign_id: number;
  created_at: Date | null;
  currency: string | null;
  deleted_at: Date | null;
  found_batch_id: number | null;
  id: Generated<number>;
  name: string;
  network_campaign_id: string;
  network_id: number;
  network_rate_id: string;
  type: Generated<"fixed" | "percent">;
  updated_at: Date | null;
}

export interface Campaigns {
  affiliate_link: string | null;
  campaign_name: string;
  campaign_status: string;
  campaign_type: string | null;
  categories: string | null;
  countries: string | null;
  country: string | null;
  cr: Decimal | null;
  created_at: Date | null;
  currency: string | null;
  deeplink_allowed: number | null;
  deeplink_format: string | null;
  deleted_at: Date | null;
  description: string | null;
  domain_name: string | null;
  domains: string | null;
  end_date: Date | null;
  epc: Decimal | null;
  extra_information: string | null;
  found_batch_id: number | null;
  group_id: number | null;
  id: Generated<number>;
  ignored: Generated<number>;
  initialize: Generated<number>;
  logo: string | null;
  mapping_type: string | null;
  name: string | null;
  network_campaign_id: Generated<string>;
  network_id: number;
  offer_id: string | null;
  rating: Decimal | null;
  raw_categories: string | null;
  raw_commission: string | null;
  restriction: string | null;
  start_date: Date | null;
  stats: string | null;
  status: Generated<"declined" | "joined" | "not_joined" | "pending">;
  updated_at: Date | null;
  website: string | null;
}

export interface Clicks {
  boost_percent: Generated<Decimal>;
  can_claim: Generated<number>;
  cashback_enabled: Generated<number>;
  cashback_percent: Generated<Decimal>;
  cashback_type: Generated<"cashback" | "reward">;
  click_time: Generated<Date>;
  code: string;
  confirm_duration: string | null;
  extra_info: Json | null;
  http_referrer: string | null;
  id: Generated<number>;
  ip_address: string;
  network_campaign_id: string | null;
  network_id: number | null;
  original_link: Generated<string>;
  redirect_link: Generated<string>;
  referral_enabled: Generated<number>;
  referral_percent: Generated<Decimal>;
  source_id: string;
  source_type: string;
  store_id: number;
  user_agent: string | null;
  user_cashback_id: number | null;
  user_id: number | null;
}

export interface ContactFormEntries {
  created_at: Generated<Date | null>;
  email: string;
  id: Generated<number>;
  message: string | null;
  name: string;
  reason: string;
  updated_at: Generated<Date | null>;
}

export interface Countries {
  code: string;
  created_at: Date | null;
  currency: string | null;
  default_language: Generated<string>;
  dial_code: string | null;
  id: Generated<number>;
  is_enabled: Generated<number>;
  languages: Generated<string>;
  name: string;
  updated_at: Date | null;
}

export interface Coupons {
  cats: Json | null;
  clicks: Generated<number>;
  code: string | null;
  created_at: Date | null;
  created_mode: Generated<string>;
  description: Json | null;
  expiry_date: Date | null;
  extension_afflink: string | null;
  id: Generated<number>;
  is_affiliate_link: Generated<number>;
  is_featured: Generated<number>;
  link: string | null;
  network_coupon_id: string | null;
  network_id: number | null;
  start_date: Date | null;
  status: Generated<"draft" | "publish" | "trash">;
  store_id: number;
  title: Json;
  updated_at: Date | null;
}

export interface Currencies {
  conversion_rate: Generated<Decimal>;
  created_at: Date | null;
  enabled: Generated<number>;
  id: Generated<number>;
  iso_code: string;
  name: string;
  symbol: string;
  symbol_position: Generated<"prefix" | "suffix" | null>;
  updated_at: Date | null;
}

export interface CustomCashbackRules {
  cashback: Decimal;
  created_at: Date | null;
  enabled: Generated<number>;
  end_date: Date;
  id: Generated<number>;
  maximum_amount: Decimal;
  minimum_amount: Decimal;
  priority: Generated<number>;
  start_date: Date;
  store_id: number;
  updated_at: Date | null;
}

export interface DailyBonusLadderConfigurations {
  active_color: string | null;
  amount: Decimal;
  bg_color: string | null;
  created_at: Date | null;
  enabled: Generated<number>;
  icon: string | null;
  id: Generated<number>;
  probability: Decimal;
  step: number;
  title: string | null;
  updated_at: Date | null;
}

export interface DailyEarningReport {
  bonus: Decimal | null;
  date: Date | null;
  id: Generated<number>;
  net_profit: Decimal | null;
  referral: Decimal | null;
  sales_revenue: Decimal | null;
  store_cashback: Decimal | null;
  task_cashback: Decimal | null;
  task_revenue: Decimal | null;
  total_bonus: Decimal | null;
  total_cashback: Decimal | null;
  total_revenue: Decimal | null;
}

export interface Deals {
  cashback: Decimal | null;
  cats: string | null;
  clicks: Generated<number>;
  code: string | null;
  created_at: Date | null;
  created_mode: Generated<string>;
  description: string | null;
  discount: string | null;
  exclude_sitemap: Generated<number>;
  expiry_date: Date | null;
  h1: Json | null;
  h2: Json | null;
  id: Generated<number>;
  image: string | null;
  is_affiliate_link: Generated<number>;
  is_featured: Generated<number>;
  link: string;
  meta_desc: Json | null;
  meta_title: Json | null;
  network_deal_id: number | null;
  network_id: number | null;
  offer_price: Decimal;
  retail_price: Decimal | null;
  slug: string;
  start_date: Date | null;
  status: Generated<"draft" | "publish" | "trash">;
  store_id: number;
  title: string;
  updated_at: Date | null;
  visits: Generated<number>;
}

export interface EarningByStores {
  homepage: string;
  id: Generated<number>;
  name: Json;
  offers_count: Generated<number>;
  status: Generated<"draft" | "publish" | "trash">;
  total_commission: Generated<Decimal>;
  total_sales: Generated<Decimal>;
  visits: Generated<number>;
}

export interface EarningsByNetwork {
  affiliate_id: string | null;
  id: Generated<number>;
  name: string;
  total_commission: Generated<Decimal>;
  total_sales: Generated<Decimal>;
}

export interface EmailTemplates {
  bcc_to: string | null;
  cc_to: string | null;
  created_at: Date | null;
  from_email: string | null;
  from_name: string | null;
  id: Generated<number>;
  name: string;
  reply_to: string | null;
  subject: string;
  template: string;
  updated_at: Date | null;
  view_name: string;
}

export interface EmailTemplatesFreemoney {
  body: string;
  created_at: Date | null;
  id: Generated<number>;
  name: string;
  slug: string;
  subject: string;
  updated_at: Date | null;
}

export interface EventsAlerts {
  event_code: string;
  id: Generated<number>;
  name: string;
  vars_used: string;
}

export interface Exports {
  completed_at: Date | null;
  created_at: Date | null;
  exporter: string;
  file_disk: string;
  file_name: string | null;
  id: Generated<number>;
  processed_rows: Generated<number>;
  successful_rows: Generated<number>;
  total_rows: number;
  updated_at: Date | null;
  user_id: number;
}

export interface FabricatorPages {
  blocks: string;
  content: string | null;
  created_at: Date | null;
  exclude_seo: Generated<number>;
  id: Generated<number>;
  layout: Generated<string>;
  name: string | null;
  parent_id: number | null;
  slug: string;
  status: Generated<"draft" | "publish" | "trash">;
  title: string;
  updated_at: Date | null;
}

export interface FailedImportRows {
  created_at: Date | null;
  data: Json;
  id: Generated<number>;
  import_id: number;
  updated_at: Date | null;
  validation_error: string | null;
}

export interface FailedJobs {
  connection: string;
  exception: string;
  failed_at: Generated<Date>;
  id: Generated<number>;
  payload: string;
  queue: string;
  uuid: string;
}

export interface FaqCategories {
  category_code: string;
  created_at: Date | null;
  id: Generated<number>;
  name: string;
  sort_order: Generated<number>;
  updated_at: Date | null;
}

export interface Faqs {
  answer: string | null;
  category_code: string | null;
  created_at: Date | null;
  id: Generated<number>;
  question: string;
  sort_order: number | null;
  status: Generated<string>;
  updated_at: Date | null;
}

export interface Footers {
  created_at: Date | null;
  footer_type: string;
  footer_value: string | null;
  id: Generated<number>;
  sort_order: Generated<number>;
  status: Generated<string>;
  title: string;
  updated_at: Date | null;
}

export interface FrequencyParameters {
  created_at: Date | null;
  frequency_id: number;
  id: Generated<number>;
  name: string;
  updated_at: Date | null;
  value: string;
}

export interface GiftcardBrands {
  active: Generated<number>;
  card_status: string;
  countries: Json | null;
  created: Date | null;
  created_at: Date | null;
  currency: string | null;
  denomination: Json | null;
  description: string | null;
  extra_information: string | null;
  id: Generated<number>;
  image: string | null;
  items: Json | null;
  last_updated_at: Date | null;
  name: string | null;
  sku: string;
  status: Generated<"draft" | "publish" | "trash">;
  terms: string | null;
  updated_at: Date | null;
  vendor: string;
}

export interface GiftcardBrandsB {
  active: Generated<number>;
  card_status: string;
  countries: Json | null;
  created: Date | null;
  created_at: Date | null;
  currency: string | null;
  denomination: Json | null;
  description: string | null;
  extra_information: string | null;
  id: Generated<number>;
  image: string | null;
  items: Json | null;
  last_updated_at: Date | null;
  name: string | null;
  sku: string;
  status: Generated<"draft" | "publish" | "trash">;
  terms: string | null;
  updated_at: Date | null;
  vendor: string;
}

export interface GiftcardBrandsSandbox {
  card_status: string;
  countries: Json | null;
  created: Date | null;
  created_at: Date | null;
  denomination: Json | null;
  description: string | null;
  extra_information: string | null;
  id: Generated<number>;
  image: string | null;
  items: Json | null;
  last_updated_at: Date | null;
  name: string | null;
  sku: string;
  status: Generated<"draft" | "publish" | "trash">;
  terms: string | null;
  updated_at: Date | null;
  vendor: string;
}

export interface Iexceptions {
  action: string;
  id: Generated<number>;
  message: string | null;
  params: string | null;
  reported_at: Generated<Date>;
  url: string | null;
}

export interface Imports {
  completed_at: Date | null;
  created_at: Date | null;
  file_name: string;
  file_path: string;
  id: Generated<number>;
  importer: string;
  processed_rows: Generated<number>;
  successful_rows: Generated<number>;
  total_rows: number;
  updated_at: Date | null;
  user_id: number;
}

export interface JobBatches {
  cancelled_at: number | null;
  created_at: number;
  failed_job_ids: string;
  failed_jobs: number;
  finished_at: number | null;
  id: string;
  name: string;
  options: string | null;
  pending_jobs: number;
  total_jobs: number;
}

export interface Jobs {
  attempts: number;
  available_at: number;
  created_at: number;
  id: Generated<number>;
  payload: string;
  queue: string;
  reserved_at: number | null;
}

export interface LanguageLines {
  created_at: Date | null;
  group: string;
  id: Generated<number>;
  key: string;
  text: Json;
  updated_at: Date | null;
}

export interface Languages {
  code: string;
  created_at: Date | null;
  flag: string | null;
  id: Generated<number>;
  is_enabled: Generated<number>;
  name: string;
  updated_at: Date | null;
}

export interface LeaderboardEntries {
  created_at: Date | null;
  earnings: Generated<Decimal>;
  id: Generated<number>;
  leaderboard_id: number;
  rank: number;
  reward: string;
  status: Generated<"completed" | "pending">;
  updated_at: Date | null;
  user_id: number | null;
}

export interface LeaderboardRuns {
  awarded_at: Date | null;
  code: string | null;
  created_at: Date | null;
  distribution_config: Json | null;
  distribution_logic: string | null;
  end_date: Date;
  frequency: "Daily" | "Manual" | "Monthly" | "Weekly" | null;
  id: Generated<number>;
  name: string;
  prize: Decimal;
  start_date: Date;
  status: Generated<"awarded" | "completed" | "running">;
  updated_at: Date | null;
  users: number | null;
}

export interface LeaderboardSettings {
  code: string | null;
  created_at: Date | null;
  distribution_config: Json | null;
  distribution_logic: string | null;
  frequency: "Daily" | "Manual" | "Monthly" | "Weekly";
  id: Generated<number>;
  is_enabled: Generated<number>;
  name: string;
  prize: Decimal | null;
  updated_at: Date | null;
  users: Generated<number>;
}

export interface Media {
  alt: string | null;
  caption: string | null;
  created_at: Date | null;
  curations: string | null;
  description: string | null;
  directory: Generated<string>;
  disk: Generated<string>;
  exif: string | null;
  ext: string;
  height: number | null;
  id: Generated<number>;
  name: string;
  path: string;
  size: number | null;
  tenant_id: number | null;
  title: string | null;
  type: Generated<string>;
  updated_at: Date | null;
  visibility: Generated<string>;
  width: number | null;
}

export interface Menus {
  created_at: Generated<Date>;
  id: Generated<number>;
  links: string;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Date | null;
}

export interface Messages {
  content: string;
  country: string | null;
  id: Generated<number>;
  is_hidden: Generated<number>;
  mentions: Json | null;
  room_code: string;
  sent_at: Generated<Date>;
  user_avatar: string | null;
  user_id: number;
  user_name: string | null;
  user_private: number | null;
  user_referral_code: string | null;
  user_tier: number | null;
}

export interface Migrations {
  batch: number;
  id: Generated<number>;
  migration: string;
}

export interface MockSales {
  aff_sub1: string | null;
  aff_sub2: string | null;
  aff_sub3: string | null;
  aff_sub4: string | null;
  aff_sub5: string | null;
  base_commission: Decimal | null;
  commission_id: string | null;
  created_at: Generated<Date>;
  currency: Generated<string>;
  extra_information: string | null;
  id: Generated<number>;
  network_campaign_id: number;
  network_id: number;
  order_id: string | null;
  sale_amount: Decimal | null;
  sale_date: string | null;
  status: Generated<"confirmed" | "declined" | "delayed" | "pending">;
  transaction_id: string;
  updated_at: Generated<Date>;
}

export interface ModelHasPermissions {
  model_id: number;
  model_type: string;
  permission_id: number;
}

export interface ModelHasRoles {
  model_id: number;
  model_type: string;
  role_id: number;
}

export interface NetworkApiCallLogs {
  created_at: Date | null;
  endpoint: string;
  headers: string;
  id: Generated<number>;
  network: string;
  params: string;
  request_method: string;
  response_status: number | null;
  updated_at: Date | null;
  url: string;
}

export interface NetworkCategories {
  id: Generated<number>;
  mapping_for: Generated<"campaign" | "coupon">;
  network: string;
  network_cat_id: number | null;
  network_cat_name: string | null;
  parent_cat_id: number | null;
  parent_cat_name: string | null;
  sys_cat: string | null;
}

export interface NetworkCoupons {
  affiliate_link: string | null;
  categories: string | null;
  coupon_code: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
  description: string | null;
  discount: string | null;
  end_date: Date | null;
  exclusive: Generated<number>;
  extra_information: string | null;
  found_batch_id: number | null;
  id: Generated<number>;
  image: string | null;
  initialize: Generated<number>;
  link_type: string | null;
  network_campaign_id: number;
  network_coupon_id: string;
  network_id: number;
  plain_link: string | null;
  raw_categories: string | null;
  start_date: Date | null;
  stats: string | null;
  sys_tag: string | null;
  tag: string | null;
  title: string | null;
  updated_at: Date | null;
}

export interface NetworkRun {
  end_time: Date | null;
  entries: number | null;
  id: Generated<number>;
  network: string;
  network_id: number | null;
  parameter: string | null;
  start_time: Generated<Date>;
  type: "campaign" | "campaign_rate" | "coupon" | "merchant" | "sale";
}

export interface Networks {
  affiliate_id: string | null;
  api_key: string | null;
  auth_tokens: string | null;
  campaign_info_url: string | null;
  campaign_statuses: string | null;
  columns_update: string | null;
  confirm_days: Generated<number>;
  confirm_duration: Generated<string>;
  created_at: Date | null;
  credentials: string | null;
  currency: Generated<string>;
  direct_merchant: number | null;
  enabled: Generated<number>;
  id: Generated<number>;
  name: string;
  namespace: string | null;
  network_platform: string | null;
  network_subids: string | null;
  network_unique_key: string | null;
  parent_id: number | null;
  purpose: Generated<string | null>;
  sale_statuses: string | null;
  shortname: string | null;
  subids: string | null;
  updated_at: Date | null;
  website_id: string | null;
}

export interface Notifications {
  created_at: Date | null;
  data: string | null;
  id: string;
  notifiable_id: number;
  notifiable_type: string;
  read_at: Date | null;
  type: string;
  updated_at: Date | null;
}

export interface NotificationTemplates {
  created_at: Generated<Date | null>;
  description: Json;
  id: Generated<number>;
  route: string | null;
  template_code: string;
  title: Json;
  updated_at: Date | null;
}

export interface OfferwallCategories {
  banner_img: string | null;
  bg_color: string | null;
  created_at: Date | null;
  fg_color: string | null;
  icon: string | null;
  id: Generated<number>;
  is_enabled: Generated<number>;
  is_featured: Generated<number>;
  item_count: Generated<number>;
  mapping_for: Generated<string>;
  match_keywords: string;
  match_order: Generated<number>;
  name: string;
  show_menu: Generated<number>;
  slug: string | null;
  sort_order: Generated<number>;
  text_color: string | null;
  updated_at: Date | null;
}

export interface OfferwallNetworks {
  api_key: string | null;
  app_id: string | null;
  background_image: string | null;
  cashback_percent: Generated<Decimal>;
  categories: string | null;
  code: string;
  config_params: string | null;
  conversion_statuses: Json | null;
  countries: string | null;
  created_at: Date | null;
  default_conversion_status: string | null;
  enabled: Generated<number | null>;
  hidden: Generated<number>;
  icon: string;
  id: Generated<number>;
  is_featured: Generated<number>;
  logo: string | null;
  name: string;
  offer_url: string | null;
  open_task_external_browser: Generated<number>;
  postback_key: string | null;
  postback_validation_key: string | null;
  pub_id: string | null;
  rating: Generated<Decimal>;
  rating_count: Generated<number>;
  render_type: Generated<"new_tab" | "popup" | "same_tab" | null>;
  sort_order: Generated<number | null>;
  sub_id: Json | null;
  support_url: string | null;
  survey_url: string | null;
  task_iframe_only: Generated<number>;
  type: "surveys" | "tasks";
  updated_at: Date | null;
  whitelist_ips: Json | null;
}

export interface OfferwallPostbackLogs {
  created_at: Generated<Date | null>;
  data: string | null;
  id: Generated<number>;
  message: string | null;
  network: string | null;
  payload: string | null;
  status: Generated<"error" | "pending" | "processed">;
  transaction_id: string | null;
  updated_at: Generated<Date | null>;
}

export interface OfferwallTaskGoals {
  cashback: Generated<Decimal>;
  created_at: Generated<Date | null>;
  description: string | null;
  id: Generated<number>;
  image: string | null;
  import_id: string | null;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_goal_id: string;
  network_goal_name: string;
  network_task_id: string;
  revenue: Generated<Decimal>;
  sort_order: Generated<number>;
  status: Generated<"draft" | "publish" | "trash" | null>;
  task_offer_id: string;
  updated_at: Date | null;
}

export interface OfferwallTasks {
  app_open_external_browser: Generated<number>;
  banner_image: string | null;
  campaign_id: string;
  category_id: number | null;
  clicks: Generated<number>;
  conversion_rate: Decimal | null;
  countries: string | null;
  created_at: Generated<Date | null>;
  created_date: Date | null;
  daily_cap: Decimal | null;
  description: string | null;
  devices: string | null;
  end_date: Date | null;
  goals_count: Generated<number>;
  id: Generated<number>;
  image: string | null;
  import_id: string | null;
  instructions: string | null;
  is_featured: Generated<number>;
  is_recomended: Generated<number>;
  is_translated: Generated<number>;
  name: string;
  network: string;
  network_categories: string | null;
  network_goals: string | null;
  network_image: string | null;
  offer_id: string;
  offer_type: string | null;
  payout: Generated<Decimal>;
  payout_type: Generated<"fixed" | "percent">;
  platforms: string | null;
  redemptions: Generated<number>;
  score: Decimal | null;
  screenshot_instructions: string | null;
  screenshot_upload: Generated<number>;
  slug: string | null;
  start_date: Date | null;
  status: Generated<"draft" | "publish" | "removed" | "trash" | null>;
  tier: Generated<number>;
  tracking_speed: string | null;
  updated_at: Date | null;
  url: string;
}

export interface Pages {
  blocks: string;
  content: string | null;
  created_at: Generated<Date>;
  exclude_seo: Generated<number | null>;
  id: Generated<number>;
  layout: string | null;
  meta_desc: Json | null;
  meta_title: Json | null;
  name: string | null;
  parent_id: number | null;
  slug: string | null;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Date | null;
}

export interface PagesBkp {
  blocks: string;
  content: string | null;
  created_at: Generated<Date>;
  exclude_seo: Generated<number | null>;
  id: Generated<number>;
  layout: string | null;
  meta_desc: Json | null;
  meta_title: Json | null;
  name: string | null;
  parent_id: number | null;
  slug: string | null;
  status: "" | "draft" | "publish" | "trash";
  title: string;
  updated_at: Date | null;
}

export interface PasswordResetTokens {
  created_at: Date | null;
  email: string;
  token: string;
}

export interface PaymentTypes {
  account_input_hint: string;
  account_input_label: string;
  account_input_type: string;
  bonus_allowed: Generated<number | null>;
  card_image: string | null;
  cashback_allowed: Generated<number | null>;
  code: string;
  conversion_enabled: number | null;
  conversion_rate: number | null;
  country_configuration: Json | null;
  country_customizable: Generated<number | null>;
  created_at: Generated<Date>;
  description: string | null;
  enabled: Generated<number>;
  icon: string | null;
  id: Generated<number>;
  image: string;
  minimum_amount: Decimal;
  minimum_amount_first: string | null;
  name: string;
  payment_group: string;
  payment_inputs: Json;
  transaction_bonus_allowed: string | null;
  transaction_bonus_amount: Decimal | null;
  transaction_bonus_type: "fixed" | "percent" | null;
  transaction_fees_allowed: number | null;
  transaction_fees_amount: Decimal | null;
  transaction_fees_type: "fixed" | "percent" | null;
  updated_at: Generated<Date>;
}

export interface PaypalLogs {
  created_at: Date | null;
  error_message: string | null;
  id: Generated<number>;
  ip_address: string | null;
  log_type: Generated<string | null>;
  payment_id: number;
  paypal_batch_id: string | null;
  request_payload: Json | null;
  request_type: string;
  response_payload: Json | null;
  status_code: string | null;
  success: Generated<number>;
  updated_at: Date | null;
}

export interface Permissions {
  created_at: Date | null;
  guard_name: string;
  id: Generated<number>;
  name: string;
  updated_at: Date | null;
}

export interface PersonalAccessTokens {
  abilities: string | null;
  created_at: Date | null;
  expires_at: Date | null;
  id: Generated<number>;
  last_used_at: Date | null;
  name: string;
  token: string;
  tokenable_id: number;
  tokenable_type: string;
  updated_at: Date | null;
}

export interface PostbackLogs {
  action_by: Generated<"admin" | "network">;
  aff_sub1: string | null;
  aff_sub2: string | null;
  aff_sub3: string | null;
  aff_sub4: string | null;
  aff_sub5: string | null;
  base_commission: Decimal | null;
  commission_id: string | null;
  created_at: Date | null;
  currency: Generated<string>;
  exception: string | null;
  id: Generated<number>;
  inputs: Json | null;
  network_campaign_id: string;
  network_id: number;
  network_unique_key: string | null;
  order_id: string | null;
  sale_amount: Decimal | null;
  sale_date: string | null;
  sale_id: string | null;
  sale_status: Generated<string>;
  transaction_id: string;
  updated_at: Date | null;
}

export interface RoleHasPermissions {
  permission_id: number;
  role_id: number;
}

export interface Roles {
  created_at: Date | null;
  guard_name: string;
  id: Generated<number>;
  name: string;
  updated_at: Date | null;
}

export interface Rooms {
  code: string;
  countries: Json | null;
  created_at: Generated<Date>;
  enabled: Generated<number>;
  icon: string | null;
  id: Generated<number>;
  name: string;
  tier: number | null;
  updated_at: Generated<Date>;
}

export interface Sales {
  aff_sub1: string | null;
  aff_sub2: string | null;
  aff_sub3: string | null;
  aff_sub4: string | null;
  aff_sub5: string | null;
  base_commission: Decimal | null;
  click_date: Date | null;
  commission_amount: Decimal;
  commission_id: string | null;
  created_at: Date | null;
  currency: Generated<string>;
  extra_information: string | null;
  found_batch_id: number | null;
  id: Generated<number>;
  network_campaign_id: string;
  network_id: number;
  order_id: string | null;
  sale_amount: Decimal | null;
  sale_date: Date | null;
  sale_status: string;
  sale_updated_time: Date | null;
  status: Generated<"confirmed" | "declined" | "delayed" | "pending">;
  transaction_id: string;
  updated_at: Date | null;
}

export interface Sessions {
  id: string;
  ip_address: string | null;
  last_activity: number;
  payload: string;
  user_agent: string | null;
  user_id: number | null;
}

export interface Settings {
  created_at: Date | null;
  group: Generated<string>;
  id: Generated<number>;
  name: string;
  updated_at: Date | null;
  val: string | null;
}

export interface SpinConfiguration {
  amount: Decimal | null;
  code: string;
  created_at: Date | null;
  enabled: Generated<number>;
  icon: string | null;
  id: Generated<number>;
  max_amount: Decimal | null;
  min_amount: Decimal | null;
  probability: Decimal;
  spin_code: string;
  title: string | null;
  updated_at: Date | null;
}

export interface Spins {
  code: string;
  created_at: Date | null;
  enabled: Generated<number>;
  id: Generated<number>;
  image: string | null;
  name: string;
  updated_at: Date | null;
  variable_rewards: Generated<number>;
}

export interface StoreCashback {
  cashback: Generated<Decimal>;
  commission: Generated<Decimal>;
  created_at: Date | null;
  description: string | null;
  enabled: Generated<number>;
  id: Generated<number>;
  is_manual: Generated<number>;
  lock_title: Generated<number>;
  network_refid: string | null;
  rate_type: Generated<"fixed" | "percent">;
  store_id: number;
  title: string | null;
  updated_at: Date | null;
}

export interface StoreCategories {
  created_at: Date | null;
  description: Json | null;
  exclude_sitemap: Generated<number>;
  h1: Json | null;
  h2: Json | null;
  header_image: string | null;
  icon: string | null;
  id: Generated<number>;
  is_featured: Generated<number>;
  meta_desc: Json | null;
  meta_title: Json | null;
  name: Json;
  parent_id: number | null;
  slug: string;
  store_count: Generated<number>;
  updated_at: Date | null;
  visits: Generated<number>;
}

export interface StoreExtraCashbackRules {
  cashback_times: Decimal;
  created_at: Date | null;
  enabled: Generated<number>;
  end_date: Date;
  id: Generated<number>;
  start_date: Date;
  store_id: Json;
  updated_at: Date | null;
}

export interface Stores {
  about: string | null;
  amount_type: Generated<"fixed" | "percent">;
  apply_coupon: Json | null;
  banner_image: string | null;
  cashback_amount: Decimal | null;
  cashback_enabled: Generated<number>;
  cashback_percent: Generated<Decimal>;
  cashback_type: Generated<string>;
  cashback_was: string | null;
  cats: string | null;
  checkout_url: string | null;
  clicks: Generated<number>;
  confirm_duration: string | null;
  country_tenancy: Json | null;
  created_at: Date | null;
  creation_mode: Generated<string>;
  deeplink: string | null;
  discount: string | null;
  domain_name: string | null;
  exclude_extension: Generated<number>;
  exclude_sitemap: Generated<number>;
  extension_afflink: string | null;
  filter: string | null;
  ghost: Generated<number>;
  h1: string | null;
  h2: string | null;
  homepage: string;
  id: Generated<number>;
  is_claimable: Generated<number>;
  is_featured: Generated<number>;
  is_promoted: Generated<number>;
  is_shareable: Generated<number>;
  logo: string | null;
  meta_desc: string | null;
  meta_kw: string | null;
  meta_title: string | null;
  name: Json;
  network_campaign_id: Generated<string>;
  network_id: Generated<number | null>;
  offers_count: Generated<number>;
  rate_type: Generated<"flat" | "upto">;
  rating: Generated<Decimal>;
  rating_count: Generated<number>;
  ref_id: string | null;
  slug: string;
  status: Generated<"draft" | "publish" | "trash">;
  terms_not_todo: string | null;
  terms_todo: string | null;
  tips: string | null;
  tracking_speed: string | null;
  updated_at: Date | null;
  visits: Generated<number>;
}

export interface StreakConfigurations {
  amount: Decimal | null;
  created_at: Date | null;
  day: number;
  enabled: Generated<number>;
  id: Generated<number>;
  reward_type: string;
  spin_code: string | null;
  updated_at: Date | null;
}

export interface TangoLogs {
  created_at: Date | null;
  data: Json;
  id: Generated<number>;
  response: Json;
  status: string;
  status_code: string;
  success: number;
  type: "payment" | "status";
  updated_at: Date | null;
  user_payment_id: string;
}

export interface TaskFrequencies {
  created_at: Date | null;
  id: Generated<number>;
  interval: string;
  label: string;
  task_id: number;
  updated_at: Date | null;
}

export interface TaskResults {
  created_at: Date | null;
  duration: Generated<Decimal>;
  id: Generated<number>;
  ran_at: Generated<Date>;
  result: string;
  task_id: number;
  updated_at: Date | null;
}

export interface Tasks {
  auto_cleanup_num: Generated<number>;
  auto_cleanup_type: string | null;
  command: string;
  created_at: Date | null;
  description: string;
  dont_overlap: Generated<number>;
  expression: string | null;
  id: Generated<number>;
  is_active: Generated<number>;
  notification_email_address: string | null;
  notification_phone_number: string | null;
  notification_slack_webhook: string | null;
  parameters: string | null;
  run_in_background: Generated<number>;
  run_in_maintenance: Generated<number>;
  run_on_one_server: Generated<number>;
  timezone: Generated<string>;
  updated_at: Date | null;
}

export interface TbAlertTemplates {
  event_code: string;
  id: Generated<number>;
  template: string;
  title: string;
  url: string;
}

export interface Tickers {
  created_at: Date | null;
  id: Generated<number>;
  ticker_data: Json;
  ticker_type: string;
  updated_at: Date | null;
  user_id: string;
}

export interface Tiers {
  affiliate_commission: Decimal;
  created_at: Date | null;
  enabled: Generated<number>;
  icon: string;
  id: Generated<number>;
  label: Json;
  required_affiliate_earnings: Decimal;
  required_affiliate_earnings_last_30_days: Decimal | null;
  tier: number;
  updated_at: Date | null;
}

export interface Translations {
  id: Generated<number>;
  module: string | null;
  page: string;
  trans_key: string;
  trans_value: string | null;
}

export interface UserActivities {
  activity_type: "bonus_earnings" | "payouts" | "referral_earnings" | "referrals" | "tasks_earnings";
  amount: number | null;
  created_at: Generated<Date>;
  data: string | null;
  icon: string;
  id: Generated<number>;
  status: string | null;
  title: string;
  updated_at: Date | null;
  url: string | null;
  user_id: number;
}

export interface UserAlertTemplates {
  event_code: string;
  id: Generated<number>;
  sms_enabled: Generated<number>;
  sms_template: string;
  template: string;
  title: string;
  url: string;
}

export interface UserBonus {
  admin_note: string | null;
  amount: Decimal;
  awarded_on: Date | null;
  bonus_code: string;
  created_at: Generated<Date | null>;
  expires_on: Date | null;
  id: Generated<number>;
  metadata: Json | null;
  note: string | null;
  referred_bonus_id: number | null;
  status: Generated<"confirmed" | "declined" | "expired" | "pending">;
  updated_at: Date | null;
  user_id: number;
}

export interface UserBonusCodeRedemptions {
  bonus_code: string;
  created_at: Date | null;
  id: Generated<number>;
  updated_at: Date | null;
  user_id: number;
}

export interface UserClaims {
  admin_note: string | null;
  click_code: string | null;
  click_id: number;
  click_time: Date;
  closed_by: Generated<"admin" | "user">;
  created_at: Date | null;
  currency: string;
  id: Generated<number>;
  network_campaign_id: string | null;
  network_id: number | null;
  order_amount: Decimal;
  order_id: string;
  platform: Generated<"android" | "ios" | "mobile" | "website">;
  receipt: string | null;
  status: Generated<"answered" | "closed" | "hold" | "open">;
  store_id: number;
  transaction_date: Date;
  updated_at: Date | null;
  user_id: number;
  user_message: string | null;
}

export interface UserDailyBonusLadder {
  amount: Decimal;
  claimed_at: Date | null;
  created_at: Date | null;
  expires_at: Date | null;
  id: Generated<number>;
  status: string;
  step: number;
  updated_at: Date | null;
  user_id: number;
}

export interface UserEarnings {
  active: Generated<"active" | "banned" | "disabled">;
  available_bonus: Generated<Decimal>;
  available_cashback: Generated<Decimal>;
  available_referral: Generated<Decimal>;
  banned: Generated<number>;
  confirmed_bonus: Generated<Decimal>;
  confirmed_cashback: Generated<Decimal>;
  confirmed_referral: Generated<Decimal>;
  declined_bonus: Generated<Decimal>;
  declined_cashback: Generated<Decimal>;
  declined_referral: Generated<Decimal>;
  email: string | null;
  lang: string | null;
  name: string;
  paid_cashback: Generated<Decimal>;
  paid_reward: Generated<Decimal>;
  paid_total: Generated<number>;
  pending_bonus: Generated<Decimal>;
  pending_cashback: Generated<Decimal>;
  pending_referral: Generated<Decimal>;
  phone_no: string | null;
  provider_type: string | null;
  user_id: Generated<number>;
}

export interface UserNotifications {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  is_read: Generated<number | null>;
  message: Json;
  meta_data: Json;
  notifiable_id: number | null;
  notifiable_type: string | null;
  onesignal_response: Json | null;
  route: string | null;
  type: string | null;
  updated_at: Date | null;
  user_id: number;
}

export interface UserOfferwallSales {
  admin_note: string | null;
  amount: Decimal;
  click_ip: string | null;
  created_at: Generated<Date | null>;
  extra_info: string | null;
  id: Generated<number>;
  is_chargeback: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: string | null;
  note: string | null;
  offer_id: string;
  payout: Decimal;
  score: string | null;
  status: Generated<"confirmed" | "declined" | "pending">;
  survey_id: string | null;
  survey_name: string | null;
  task_name: string | null;
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  updated_at: Date | null;
  user_id: number;
}

export interface UserOfferwallSalesBkp {
  admin_note: string | null;
  amount: Decimal;
  click_ip: string | null;
  created_at: Generated<Date | null>;
  extra_info: string | null;
  id: Generated<number>;
  is_chargeback: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: string | null;
  note: string | null;
  offer_id: string;
  payout: Decimal;
  score: string | null;
  status: Generated<"confirmed" | "declined" | "pending">;
  survey_id: string | null;
  survey_name: string | null;
  task_name: string | null;
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  updated_at: Date | null;
  user_id: number;
}

export interface UserOfferwallSalesTest {
  admin_note: string | null;
  amount: Decimal;
  click_ip: string | null;
  created_at: Generated<Date | null>;
  extra_info: string | null;
  id: Generated<number>;
  is_chargeback: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: string | null;
  note: string | null;
  offer_id: string;
  payout: Decimal;
  score: string | null;
  status: Generated<"confirmed" | "declined" | "pending">;
  survey_id: string | null;
  survey_name: string | null;
  task_name: string | null;
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  updated_at: Date | null;
  user_id: number;
}

export interface UserOtp {
  created_at: Generated<Date | null>;
  email: string | null;
  expiration: Date;
  id: Generated<number>;
  otp: number | null;
  phone_no: string | null;
  updated_at: Generated<Date | null>;
}

export interface UserPaymentModes {
  account: string | null;
  admin_note: string | null;
  created_at: Date | null;
  enabled: Generated<number>;
  id: Generated<number>;
  name: string;
  payment_inputs: string | null;
  payment_method_code: string;
  updated_at: Date | null;
  user_id: number;
  verified_at: string | null;
  verify_code: string | null;
}

export interface UserPayments {
  account: string;
  admin_note: string | null;
  amount: number;
  api_reference_id: string | null;
  api_response: string | null;
  api_status: string | null;
  bonus_amount: number | null;
  cashback_amount: number | null;
  created_at: Generated<Date>;
  id: Generated<number>;
  note: string | null;
  paid_at: Date | null;
  payable_amount: number;
  payment_id: number;
  payment_input: string;
  payment_method_code: string;
  status: "completed" | "created" | "declined" | "processing";
  updated_at: Generated<Date>;
  user_id: number;
}

export interface UserReferralEarnings {
  admin_note: string | null;
  amount: Decimal;
  created_at: Generated<Date>;
  id: Generated<number>;
  network: string;
  note: string | null;
  offer_id: string;
  payout: Decimal;
  referee_id: number;
  referral_amount: Decimal;
  sale_id: number;
  status: "" | "confirmed" | "declined" | "pending";
  task_offer_id: string;
  task_type: string;
  transaction_id: string;
  transaction_time: Date | null;
  updated_at: Date | null;
  user_id: number;
}

export interface UserReferrerSales {
  admin_note: string | null;
  created_at: Date | null;
  currency: string;
  id: Generated<number>;
  mail_sent: Generated<number>;
  order_amount: Decimal;
  referral_amount: Decimal;
  sales_id: number;
  shopper_id: number;
  status: Generated<"confirmed" | "declined" | "pending">;
  store_id: number;
  transaction_time: Date;
  updated_at: Date | null;
  user_id: number;
}

export interface Users {
  affiliate_click_code: string | null;
  affiliate_commission: Generated<Decimal>;
  affiliate_earnings: Generated<Decimal>;
  avatar: string | null;
  can_refer_earn: Generated<number>;
  country_code: string | null;
  created_at: Generated<Date | null>;
  current_level: number | null;
  current_level_tokens: number | null;
  current_tier: Generated<number>;
  deleted_at: Date | null;
  device_id: string | null;
  email: string | null;
  id: Generated<number>;
  is_deleted: Generated<number>;
  is_email_verified: Generated<number | null>;
  is_phone_no_verified: Generated<number | null>;
  is_private: Generated<number>;
  kyc_session_id: string | null;
  kyc_verification_payload: Json | null;
  kyc_verification_status: Generated<string>;
  kyc_verified: Generated<number>;
  kyc_verified_at: Date | null;
  lang: Generated<string>;
  mentions_count: Generated<number>;
  metadata: Json | null;
  name: string;
  onesignal_notification_id: string | null;
  password: string | null;
  phone_no: string | null;
  promotion_update: Generated<number>;
  provider_id: string | null;
  provider_type: string | null;
  referral_code: string | null;
  referrer_code: string | null;
  remember_token: string | null;
  signup_ip: string | null;
  status: Generated<"active" | "banned" | "disabled">;
  timezone: string | null;
  total_tokens: number | null;
  updated_at: Generated<Date | null>;
}

export interface UsersAdmin {
  created_at: Date | null;
  email: string;
  email_verified_at: Date | null;
  id: Generated<number>;
  name: string;
  password: string;
  remember_token: string | null;
  updated_at: Date | null;
}

export interface UserSales {
  admin_note: string | null;
  cashback: Decimal;
  cashback_type: Generated<"cashback" | "reward">;
  click_code: string | null;
  click_id: number;
  created_at: Date | null;
  currency: string;
  expected_date: Date | null;
  id: Generated<number>;
  lock_amount: Generated<number>;
  lock_status: Generated<number>;
  mail_sent: Generated<number>;
  network_id: number;
  note: Json | null;
  order_amount: Decimal;
  order_id: string | null;
  sales_id: number;
  status: "confirmed" | "declined" | "pending";
  store_id: number;
  transaction_time: Date;
  updated_at: Date | null;
  user_id: number;
}

export interface UsersBkp30042025 {
  affiliate_commission: Generated<Decimal>;
  affiliate_earnings: Generated<Decimal>;
  avatar: string | null;
  can_refer_earn: Generated<number>;
  country_code: string | null;
  created_at: Generated<Date | null>;
  current_level: number | null;
  current_level_tokens: number | null;
  current_tier: Generated<number>;
  deleted_at: Date | null;
  device_id: string | null;
  email: string | null;
  id: Generated<number>;
  is_deleted: Generated<number>;
  is_email_verified: Generated<number | null>;
  is_phone_no_verified: Generated<number | null>;
  is_private: Generated<number>;
  kyc_session_id: string | null;
  kyc_verification_payload: Json | null;
  kyc_verification_status: Generated<string>;
  kyc_verified: Generated<number>;
  kyc_verified_at: Date | null;
  metadata: Json | null;
  name: string;
  password: string | null;
  phone_no: string | null;
  promotion_update: Generated<number>;
  provider_id: string | null;
  provider_type: string | null;
  referral_code: string | null;
  referrer_code: string | null;
  remember_token: string | null;
  signup_ip: string | null;
  status: Generated<"active" | "banned" | "disabled">;
  timezone: string | null;
  total_tokens: number | null;
  updated_at: Generated<Date | null>;
}

export interface UsersNew {
  active: Generated<number>;
  banned: Generated<number>;
  can_refer_earn: Generated<number>;
  can_share_earn: Generated<number>;
  country: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
  email: string;
  email_verified_at: Date | null;
  first_name: string | null;
  lang: Generated<string>;
  last_name: string | null;
  notification_settings: string | null;
  password: string | null;
  phone_number: string | null;
  phone_verified_at: Date | null;
  postback_confirmations: Json | null;
  profile_picture: string | null;
  provider_id: string | null;
  provider_type: Generated<string>;
  referral_code: string | null;
  referral_percent: Generated<number>;
  referred_by: number | null;
  referrer_code: string | null;
  remember_token: string | null;
  secondary_email: string | null;
  social_avatar: string | null;
  tracking_params: Json | null;
  updated_at: Date | null;
  user_id: Generated<number>;
  user_token: string | null;
}

export interface UserSpins {
  awarded_at: Date;
  code: string;
  created_at: Date | null;
  expires_at: Date | null;
  id: Generated<number>;
  max_reward_amount: Decimal;
  reward_code: string | null;
  source: string;
  spin_code: string;
  spin_config: Json;
  status: Generated<"available" | "claimed" | "denied" | "expired">;
  updated_at: Date | null;
  user_id: number;
}

export interface UsersTestImport {
  affiliate_commission: Generated<Decimal>;
  affiliate_earnings: Generated<Decimal>;
  avatar: string | null;
  can_refer_earn: Generated<number>;
  country_code: string | null;
  created_at: Generated<Date | null>;
  current_level: number | null;
  current_level_tokens: number | null;
  current_tier: Generated<number>;
  deleted_at: Date | null;
  device_id: string | null;
  email: string | null;
  id: Generated<number>;
  is_deleted: Generated<number>;
  is_email_verified: Generated<number | null>;
  is_phone_no_verified: Generated<number | null>;
  is_private: Generated<number>;
  kyc_session_id: string | null;
  kyc_verification_payload: Json | null;
  kyc_verification_status: Generated<string>;
  kyc_verified: Generated<number>;
  kyc_verified_at: Date | null;
  metadata: Json | null;
  name: string;
  password: string | null;
  phone_no: string | null;
  promotion_update: Generated<number>;
  provider_id: string | null;
  provider_type: string | null;
  referral_code: string | null;
  referrer_code: string | null;
  remember_token: string | null;
  signup_ip: string | null;
  status: Generated<"active" | "banned" | "disabled">;
  timezone: string | null;
  total_tokens: number | null;
  updated_at: Generated<Date | null>;
}

export interface UserStreaks {
  amount: Decimal | null;
  created_at: Generated<Date>;
  day: number;
  id: Generated<number>;
  reward_type: string;
  spin_code: string | null;
  updated_at: Date | null;
  user_id: number;
}

export interface UserTaskClicks {
  campaign_id: string;
  click_code: string | null;
  clicked_on: Generated<Date>;
  countries: string;
  created_at: Generated<Date>;
  device_id: string | null;
  id: Generated<number>;
  ip: string | null;
  locale: string;
  network: string;
  platform: string;
  referer: string | null;
  task_offer_id: string | null;
  task_type: string;
  updated_at: Date | null;
  user_agent: string;
  user_id: number;
}

export interface UserTasks {
  amount: Decimal;
  created_at: Generated<Date | null>;
  extra_info: string | null;
  id: Generated<number>;
  mail_sent: Generated<number>;
  network: string;
  network_goal_id: string | null;
  offer_id: string;
  payout: Decimal;
  status: Generated<"confirmed" | "declined" | "pending">;
  task_name: string;
  task_offer_id: string | null;
  task_type: string;
  transaction_id: string;
  updated_at: Generated<Date | null>;
  user_id: number;
}

export interface UserTaskUploads {
  created_at: Date | null;
  id: Generated<number>;
  network: string;
  offer_id: string;
  platform: string;
  task_offer_id: string;
  updated_at: Date | null;
  upload_path: string;
  user_id: number;
}

export interface VwChargebackReport {
  chargeback_amount: Decimal | null;
  chargeback_count: Generated<number>;
  chargeback_ratio: Decimal | null;
  confirmed_sales_count: Generated<number>;
  email: string | null;
  name: string;
  pending_sales_count: Generated<number>;
  total_amount: Decimal | null;
  total_sales_count: Generated<number>;
  user_id: Generated<number>;
}

export interface VwClickFrauds {
  clicked_ips: string | null;
  distinct_clicks_count: Generated<number>;
  distinct_ip_count: Generated<number>;
  email: string | null;
  name: string;
  total_clicks_count: Generated<number>;
  user_id: Generated<number>;
}

export interface VwLoginFrauds {
  ip_match: Generated<number>;
  ips: string | null;
  joinee_email: string | null;
  joinee_user_id: Generated<number>;
  referer_email: string | null;
  referrer_user_id: Generated<number>;
}

export interface VwUserEarningsReport {
  confirmed_bonus: Generated<Decimal>;
  confirmed_referral_earnings: Generated<Decimal>;
  confirmed_task_earnings: Generated<Decimal>;
  current_balance: Generated<number>;
  current_level: number | null;
  current_tier: Generated<number>;
  declined_bonus: Generated<Decimal>;
  declined_referral_earnings: Generated<Decimal>;
  declined_task_earnings: Generated<Decimal>;
  declined_withdrawals_amount: Generated<number>;
  declined_withdrawals_count: Generated<Decimal>;
  deleted_at: Date | null;
  email: string | null;
  expired_bonus: Generated<Decimal>;
  name: string;
  pending_bonus: Generated<Decimal>;
  pending_referral_earnings: Generated<Decimal>;
  pending_task_earnings: Generated<Decimal>;
  pending_withdrawals_amount: Generated<number>;
  pending_withdrawals_count: Generated<Decimal>;
  phone_no: string | null;
  surveys_completed: Generated<Decimal>;
  total_bonus: Generated<Decimal>;
  total_earnings: Generated<Decimal>;
  total_referral_earnings: Generated<Decimal>;
  total_task_earnings: Generated<Decimal>;
  total_tasks: Generated<number>;
  total_withdrawals_amount: Generated<number>;
  user_id: Generated<number>;
  withdrawn_amount: Generated<number>;
  withdrawn_count: Generated<Decimal>;
}

export interface DB {
  audits: Audits;
  auth_logs: AuthLogs;
  banners: Banners;
  blocks: Blocks;
  bonus_codes: BonusCodes;
  bonus_types: BonusTypes;
  broadcasts: Broadcasts;
  business_inquiries: BusinessInquiries;
  cache: Cache;
  cache_locks: CacheLocks;
  campaign_rates: CampaignRates;
  campaigns: Campaigns;
  clicks: Clicks;
  contact_form_entries: ContactFormEntries;
  countries: Countries;
  coupons: Coupons;
  currencies: Currencies;
  custom_cashback_rules: CustomCashbackRules;
  daily_bonus_ladder_configurations: DailyBonusLadderConfigurations;
  daily_earning_report: DailyEarningReport;
  deals: Deals;
  earning_by_stores: EarningByStores;
  earnings_by_network: EarningsByNetwork;
  email_templates: EmailTemplates;
  email_templates_freemoney: EmailTemplatesFreemoney;
  events_alerts: EventsAlerts;
  exports: Exports;
  fabricator_pages: FabricatorPages;
  failed_import_rows: FailedImportRows;
  failed_jobs: FailedJobs;
  faq_categories: FaqCategories;
  faqs: Faqs;
  footers: Footers;
  frequency_parameters: FrequencyParameters;
  giftcard_brands: GiftcardBrands;
  giftcard_brands_b: GiftcardBrandsB;
  giftcard_brands_sandbox: GiftcardBrandsSandbox;
  iexceptions: Iexceptions;
  imports: Imports;
  job_batches: JobBatches;
  jobs: Jobs;
  language_lines: LanguageLines;
  languages: Languages;
  leaderboard_entries: LeaderboardEntries;
  leaderboard_runs: LeaderboardRuns;
  leaderboard_settings: LeaderboardSettings;
  media: Media;
  menus: Menus;
  messages: Messages;
  migrations: Migrations;
  mock_sales: MockSales;
  model_has_permissions: ModelHasPermissions;
  model_has_roles: ModelHasRoles;
  network_api_call_logs: NetworkApiCallLogs;
  network_categories: NetworkCategories;
  network_coupons: NetworkCoupons;
  network_run: NetworkRun;
  networks: Networks;
  notification_templates: NotificationTemplates;
  notifications: Notifications;
  offerwall_categories: OfferwallCategories;
  offerwall_networks: OfferwallNetworks;
  offerwall_postback_logs: OfferwallPostbackLogs;
  offerwall_task_goals: OfferwallTaskGoals;
  offerwall_tasks: OfferwallTasks;
  pages: Pages;
  pages_bkp: PagesBkp;
  password_reset_tokens: PasswordResetTokens;
  payment_types: PaymentTypes;
  paypal_logs: PaypalLogs;
  permissions: Permissions;
  personal_access_tokens: PersonalAccessTokens;
  postback_logs: PostbackLogs;
  role_has_permissions: RoleHasPermissions;
  roles: Roles;
  rooms: Rooms;
  sales: Sales;
  sessions: Sessions;
  settings: Settings;
  spin_configuration: SpinConfiguration;
  spins: Spins;
  store_cashback: StoreCashback;
  store_categories: StoreCategories;
  store_extra_cashback_rules: StoreExtraCashbackRules;
  stores: Stores;
  streak_configurations: StreakConfigurations;
  tango_logs: TangoLogs;
  task_frequencies: TaskFrequencies;
  task_results: TaskResults;
  tasks: Tasks;
  tb_alert_templates: TbAlertTemplates;
  tickers: Tickers;
  tiers: Tiers;
  translations: Translations;
  user_activities: UserActivities;
  user_alert_templates: UserAlertTemplates;
  user_bonus: UserBonus;
  user_bonus_code_redemptions: UserBonusCodeRedemptions;
  user_claims: UserClaims;
  user_daily_bonus_ladder: UserDailyBonusLadder;
  user_earnings: UserEarnings;
  user_notifications: UserNotifications;
  user_offerwall_sales: UserOfferwallSales;
  user_offerwall_sales_bkp: UserOfferwallSalesBkp;
  user_offerwall_sales_test: UserOfferwallSalesTest;
  user_otp: UserOtp;
  user_payment_modes: UserPaymentModes;
  user_payments: UserPayments;
  user_referral_earnings: UserReferralEarnings;
  user_referrer_sales: UserReferrerSales;
  user_sales: UserSales;
  user_spins: UserSpins;
  user_streaks: UserStreaks;
  user_task_clicks: UserTaskClicks;
  user_task_uploads: UserTaskUploads;
  user_tasks: UserTasks;
  users: Users;
  users_admin: UsersAdmin;
  users_bkp_30042025: UsersBkp30042025;
  users_new: UsersNew;
  users_test_import: UsersTestImport;
  vw_chargeback_report: VwChargebackReport;
  vw_click_frauds: VwClickFrauds;
  vw_login_frauds: VwLoginFrauds;
  vw_user_earnings_report: VwUserEarningsReport;
}
