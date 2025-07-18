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
  usage_count: number | null;
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

export interface EmailTemplates {
  body: string;
  created_at: Date | null;
  id: Generated<number>;
  name: string;
  slug: string;
  subject: string;
  updated_at: Date | null;
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
  cashback_percent: Generated<Decimal | null>;
  categories: string | null;
  code: string;
  config_params: string | null;
  conversion_statuses: Json | null;
  countries: string | null;
  created_at: Date | null;
  default_conversion_status: string | null;
  enabled: Generated<number | null>;
  icon: string;
  id: Generated<number>;
  is_featured: Generated<number>;
  logo: string | null;
  name: string;
  offer_url: string | null;
  postback_key: string | null;
  postback_validation_key: string | null;
  pub_id: string | null;
  rating: Generated<Decimal>;
  rating_count: Generated<number>;
  render_type: Generated<"new_tab" | "popup" | "same_tab" | null>;
  support_url: string | null;
  survey_url: string | null;
  type: "surveys" | "tasks";
  updated_at: Date | null;
  whitelist_ips: string | null;
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
  status: Generated<"draft" | "publish" | "trash" | null>;
  task_offer_id: string;
  updated_at: Date | null;
}

export interface OfferwallTasks {
  banner_image: string | null;
  campaign_id: string;
  category_id: number;
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

export interface UserNotifications {
  created_at: Generated<Date | null>;
  id: Generated<number>;
  is_read: Generated<number | null>;
  message: Json;
  meta_data: Json;
  onesignal_response: Json | null;
  route: string | null;
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

export interface Users {
  affiliate_commission: Generated<Decimal>;
  affiliate_earnings: Generated<Decimal>;
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

export interface Stores {
  id: number; 
  name: Json; 
  slug: string; 
  logo?: string;
  banner_image?: string; 
  homepage: string; 
  domain_name?: string; 
  deeplink?: string; 
  extension_afflink?: string; 
  about?: string;
  terms_todo?: string; 
  terms_not_todo?: string;
  tips?: string;
  cats?: string; 
  cashback_enabled: boolean; 
  cashback_percent: Decimal; 
  cashback_amount?: Decimal; 
  cashback_type: string;
  cashback_was?: string; 
  tracking_speed?: string; 
  amount_type: 'percent' | 'fixed'; 
  rate_type: 'flat' | 'upto'; 
  confirm_duration?: string; 
  is_claimable: boolean; 
  is_shareable: boolean;
  is_featured: boolean; 
  country_tenancy?: Json; 
  is_promoted: boolean; 
  h1?: string;
  h2?: string;
  meta_title?: string; 
  meta_desc?: string; 
  meta_kw?: string; 
  exclude_sitemap: boolean; 
  visits: number; 
  offers_count: number; 
  ref_id?: string; 
  rating: Decimal; 
  rating_count: number;
  clicks: number; 
  creation_mode: string; 
  network_id?: number; 
  network_campaign_id: string; 
  ghost: boolean; 
  filter?: string; 
  status: 'publish' | 'draft' | 'trash'; 
  created_at: Date | null; 
  updated_at: Date | null;
  apply_coupon?: Json;
  checkout_url?: string; 
  exclude_extension: boolean; 
  discount?: string;
}

export interface StoreCashback {
  id: number;
  store_id: number;
  network_refid?: string;
  title?: string; // multi lang || type=lang
  description?: string; // multi lang || type=lang
  rate_type: 'fixed' | 'percent';
  commission: Decimal;
  cashback: Decimal; // Derived value
  enabled: boolean;
  is_manual: boolean;
  created_at: Date | null;
  updated_at: Date | null;
  lock_title: boolean;
}

export interface StoreCategories {
  id: Generated<number>;
  name: Json;
  slug: string;
  parent_id: number | null;
  description: Json | null;
  icon: string | null;
  header_image: string | null;
  is_featured: Generated<number>;
  h1: Json | null;
  h2: Json | null;
  meta_title: Json | null;
  meta_desc: Json | null;
  exclude_sitemap: Generated<number>;
  visits: number;
  store_count: number;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Coupons {
  id: Generated<number>; // Auto-incrementing primary key
  title: Json; // JSON type for multi-language support
  description: Json | null; // JSON type for multi-language support, can be null
  store_id: number; // Foreign key referencing the stores table
  code: string | null; // Coupon code
  link: string | null; // Merchant landing page
  extension_afflink: string | null; // Extended affiliate link
  is_affiliate_link: Generated<number>; // Indicates if it's an affiliate link
  cats: Json | null; // JSON type for categories the coupon belongs to
  is_featured: Generated<number>; // Indicates if the coupon is featured
  created_mode: string; // Source of creation
  network_id: number | null; // Foreign key for network
  network_coupon_id: string | null; // ID for the network coupon
  start_date: Date | null; // Start date of the coupon
  expiry_date: Date | null; // Expiry date of the coupon
  status: 'publish' | 'draft' | 'trash'; // Status of the coupon
  clicks: number; // Number of clicks on the coupon
  created_at: Date | null; // Timestamp for when the coupon was created
  updated_at: Date | null; // Timestamp for when the coupon was last updated
}

export interface Clicks {
  id: Generated<number>; 
  click_time: Date; 
  store_id: number; 
  user_id: number | null; 
  cashback_enabled: boolean; 
  cashback_type: string; 
  cashback_percent: Decimal; 
  boost_percent: Decimal; 
  referral_enabled: boolean; 
  referral_percent: Decimal; 
  can_claim: boolean;
  confirm_duration: string | null; 
  original_link: string; 
  redirect_link: string; 
  user_cashback_id: number | null; 
  network_id: number | null; 
  network_campaign_id: string | null; 
  source_type: string; 
  source_id: string; 
  extra_info: Json | null; 
  ip_address: string; 
  user_agent: string | null; 
  http_referrer: string | null; 
  created_at: Date | null; 
  updated_at: Date | null; 
}


export interface DB {
  auth_logs: AuthLogs;
  banners: Banners;
  blocks: Blocks;
  bonus_codes: BonusCodes;
  bonus_types: BonusTypes;
  business_inquiries: BusinessInquiries;
  cache: Cache;
  cache_locks: CacheLocks;
  contact_form_entries: ContactFormEntries;
  countries: Countries;
  currencies: Currencies;
  daily_bonus_ladder_configurations: DailyBonusLadderConfigurations;
  email_templates: EmailTemplates;
  fabricator_pages: FabricatorPages;
  failed_jobs: FailedJobs;
  faq_categories: FaqCategories;
  faqs: Faqs;
  footers: Footers;
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
  model_has_permissions: ModelHasPermissions;
  model_has_roles: ModelHasRoles;
  notification_templates: NotificationTemplates;
  offerwall_categories: OfferwallCategories;
  offerwall_networks: OfferwallNetworks;
  offerwall_postback_logs: OfferwallPostbackLogs;
  offerwall_task_goals: OfferwallTaskGoals;
  offerwall_tasks: OfferwallTasks;
  pages: Pages;
  password_reset_tokens: PasswordResetTokens;
  payment_types: PaymentTypes;
  paypal_logs: PaypalLogs;
  permissions: Permissions;
  personal_access_tokens: PersonalAccessTokens;
  role_has_permissions: RoleHasPermissions;
  roles: Roles;
  rooms: Rooms;
  sessions: Sessions;
  settings: Settings;
  spin_configuration: SpinConfiguration;
  spins: Spins;
  streak_configurations: StreakConfigurations;
  tickers: Tickers;
  tiers: Tiers;
  translations: Translations;
  user_activities: UserActivities;
  user_bonus: UserBonus;
  user_bonus_code_redemptions: UserBonusCodeRedemptions;
  user_daily_bonus_ladder: UserDailyBonusLadder;
  user_notifications: UserNotifications;
  user_offerwall_sales: UserOfferwallSales;
  user_otp: UserOtp;
  user_payment_modes: UserPaymentModes;
  user_payments: UserPayments;
  user_referral_earnings: UserReferralEarnings;
  user_spins: UserSpins;
  user_streaks: UserStreaks;
  user_task_clicks: UserTaskClicks;
  user_tasks: UserTasks;
  users: Users;
  users_admin: UsersAdmin;
  vw_chargeback_report: VwChargebackReport;
  vw_click_frauds: VwClickFrauds;
  vw_login_frauds: VwLoginFrauds;
  vw_user_earnings_report: VwUserEarningsReport;
  stores:Stores;
  store_cashback: StoreCashback;
  store_categories: StoreCategories;
  coupons: Coupons;
  clicks:Clicks;
}
