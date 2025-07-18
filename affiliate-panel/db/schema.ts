import { metadata } from "@/app/layout";
import {
  mysqlTable,
  serial,
  varchar,
  text,
  decimal,
  timestamp,
  bigint,
  boolean,
  char,
  json,
  mysqlEnum,
  int,
} from "drizzle-orm/mysql-core";

export const approvalStatusEnum = [
  "approved",
  "rejected",
  "suspended",
  "pending",
] as const;

export const statusEnum = ["active", "inactive"] as const;

export const campaignStatusEnum = [
  "active",
  "paused",
  "ended",
] as const;

export const conversionStatusEnum = [
  "pending",
  "approved",
  "declined",
  "paid",
] as const;

export const payoutStatusEnum = [
  "pending",
  "processing",
  "rejected",
  "paid",
] as const;

export const postbackStatusEnum = [
  "success",
  "failure",
  "pending",
] as const;


// Affiliates table
export const affiliates = mysqlTable("affiliates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password_hash", { length: 255 }).notNull(),
  approvalStatus: mysqlEnum("approval_status", approvalStatusEnum).default("pending"),
  paypalAddress: varchar("paypal_address", { length: 255 }),
  bankDetails: json("bank_details"),
  address: json("address"),
  taxId: varchar("tax_id", { length: 255 }),
  token: varchar("token", { length: 255 }),
  tokenExpiry: timestamp("token_expiry"),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  emailVerifiedAt: timestamp("email_verified_at"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Campaigns table
export const campaigns = mysqlTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  logoUrl: varchar("logo_url", { length: 255 }),
  campaignType: varchar("campaign_type", { length: 255 }).notNull(),
  status: mysqlEnum("campaign_status", campaignStatusEnum).notNull().default("active"),
  termsAndConditions: text("terms_and_conditions"),
  termsAndConditionsUrl: text("terms_and_condition_url"),
  minPayoutAmount: decimal("min_payout_request").notNull().default("0.00"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Campaign goals table
export const campaignGoals = mysqlTable("campaign_goals", {
  id: serial("id").primaryKey(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  commissionType: varchar("commission_type", { length: 255 }).notNull(),
  commissionAmount: decimal("commission_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  trackingCode: char("tracking_code", { length: 10 }).notNull().unique(),
  status: mysqlEnum("status", statusEnum).notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Affiliate campaign goals table
export const affiliateCampaignGoals = mysqlTable("affiliate_campaign_goals", {
  id: serial("id").primaryKey(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  campaignGoalId: bigint("campaign_goal_id", { mode: "number" }).notNull(),
  customCommissionRate: decimal("custom_commission_rate", {
    precision: 5,
    scale: 2,
  }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Affiliate links table
export const affiliateLinks = mysqlTable("affiliate_links", {
  id: serial("id").primaryKey(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  destinationUrl: varchar("destination_url", { length: 1000 }).notNull(),
  sub1: varchar("sub1", { length: 255 }),
  sub2: varchar("sub2", { length: 255 }),
  sub3: varchar("sub3", { length: 255 }),
  totalClicks: bigint("total_clicks", { mode: "number" }).notNull().default(0),
  totalEarnings: decimal("total_earnings", { precision: 12, scale: 2 })
    .notNull()
    .default("0"),
  status: mysqlEnum("status", statusEnum).notNull().default("active"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Clicks table
export const clicks = mysqlTable("clicks", {
  id: serial("id").primaryKey(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  affiliateLinkId: bigint("affiliate_link_id", { mode: "number" }).notNull(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  clickCode: varchar("click_code", { length: 255 }).notNull().unique(),
  ipAddress: varchar("ip_address", { length: 255 }).notNull(),
  userAgent: varchar("user_agent", { length: 1000 }).notNull(),
  referrer: varchar("referrer", { length: 255 }),
  country: varchar("country", { length: 255 }),
  city: varchar("city", { length: 255 }),
  deviceType: varchar("device_type", { length: 255 }),
  sub1: varchar("sub1", { length: 255 }),
  sub2: varchar("sub2", { length: 255 }),
  sub3: varchar("sub3", { length: 255 }),
  isConverted: boolean("is_converted").notNull().default(false),
  clickedAt: timestamp("clicked_at", { mode: "string" }).notNull(),
});

// Postback logs table
export const postbackLogs = mysqlTable("postback_logs", {
  id: serial("id").primaryKey(),
  rawPostbackData: json("raw_postback_data").notNull(),
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  status: mysqlEnum("postback_status", postbackStatusEnum).notNull(),
  statusMessages: json("status_messages"),
  receivedAt: timestamp("received_at", { mode: "string" }).notNull(),
  processedAt: timestamp("processed_at", { mode: "string" }),
});

// Payouts table
export const payouts = mysqlTable("payouts", {
  id: serial("id").primaryKey(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  requestedAmount: decimal("requested_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
  status: mysqlEnum("payout_status", payoutStatusEnum).notNull().default("pending"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  paymentAccount: varchar("payment_account", { length: 255 }).notNull(),
  paymentDetails: json("payment_details"),
  adminNotes: varchar("admin_notes", { length: 500 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  apiResponse: json("api_response"),
  paidAt: timestamp("paid_at", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Conversions table
export const conversions = mysqlTable("conversions", {
  id: serial("id").primaryKey(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  postbackLogId: bigint("postback_log_id", { mode: "number" }).notNull(),
  clickCode: varchar("click_code", { length: 255 }).notNull(),
  campaignGoalId: bigint("campaign_goal_id", { mode: "number" }).notNull(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  transactionId: varchar("transaction_id", { length: 255 }).notNull().unique(),
  conversionValue: decimal("conversion_value", {
    precision: 12,
    scale: 2,
  }).notNull(),
  commission: decimal("commission", { precision: 12, scale: 2 }).notNull(),
  sub1: varchar("sub1", { length: 255 }),
  sub2: varchar("sub2", { length: 255 }),
  sub3: varchar("sub3", { length: 255 }),
  status: mysqlEnum("conversion_status", conversionStatusEnum).notNull().default("pending"),
  payoutId: bigint("payout_id", { mode: "number" }),
  adminNotes: varchar("admin_notes", { length: 500 }),
  convertedAt: timestamp("converted_at", { mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Affiliate postbacks table
export const affiliatePostbacks = mysqlTable("affiliate_postbacks", {
  id: serial("id").primaryKey(),
  affiliateId: bigint("affiliate_id", { mode: "number" }).notNull(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  campaignGoalId: bigint("campaign_goal_id", { mode: "number" }),
  postbackUrl: varchar("postback_url", { length: 1500 }).notNull(),
  methodType: varchar("method_type", { length: 50 }).notNull().default("GET"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const affiliateConversionsSummary = mysqlTable("vw_affiliate_conversions", {
  conversionId: int("conversion_id").notNull(),
  transactionId: varchar("transaction_id", { length: 255 }),
  clickCode: varchar("click_code", { length: 255 }).notNull(),
  conversionValue: decimal("conversion_value", { precision: 12, scale: 2 }),
  commission: decimal("commission", { precision: 12, scale: 2 }),
  conversionStatus: varchar("conversion_status", { length: 255 }).notNull(),
  convertedAt: timestamp("converted_at", { mode: "string" }).notNull(),
  conversionCreatedAt: timestamp("conversion_created_at", {
    mode: "string",
  }).notNull(),
  conversionSub1: varchar("conversion_sub1", { length: 255 }),
  conversionSub2: varchar("conversion_sub2", { length: 255 }),
  conversionSub3: varchar("conversion_sub3", { length: 255 }),
  adminNotes: varchar("admin_notes", { length: 500 }),
  payoutId: int("payout_id"),

  campaignId: int("campaign_id").notNull(),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  campaignType: varchar("campaign_type", { length: 255 }).notNull(),
  campaignStatus: varchar("campaign_status", { length: 255 }).notNull(),

  campaignGoalId: int("campaign_goal_id").notNull(),
  goalName: varchar("goal_name", { length: 255 }).notNull(),
  commissionType: varchar("commission_type", { length: 255 }).notNull(),
  goalCommissionAmount: decimal("goal_commission_amount", {
    precision: 12,
    scale: 2,
  }),
  trackingCode: varchar("tracking_code", { length: 10 }).notNull(),
  goalStatus: varchar("goal_status", { length: 255 }).notNull(),

  affiliateId: int("affiliate_id").notNull(),
  affiliateName: varchar("affiliate_name", { length: 255 }).notNull(),
  affiliateEmail: varchar("affiliate_email", { length: 255 }).notNull(),
  affiliateStatus: varchar("affiliate_status", { length: 255 }).notNull(),

  affiliateLinkId: int("affiliate_link_id").notNull(),
  linkSlug: varchar("link_slug", { length: 255 }).notNull(),
  destinationUrl: varchar("destination_url", { length: 1000 }).notNull(),
  linkStatus: varchar("link_status", { length: 255 }).notNull(),
  linkSub1: varchar("link_sub1", { length: 255 }),
  linkSub2: varchar("link_sub2", { length: 255 }),
  linkSub3: varchar("link_sub3", { length: 255 }),

  clickId: int("click_id").notNull(),
  ipAddress: varchar("ip_address", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }),
  city: varchar("city", { length: 255 }),
  deviceType: varchar("device_type", { length: 255 }),
  referrer: varchar("referrer", { length: 255 }),
  clickedAt: timestamp("clicked_at", { mode: "string" }).notNull(),
  clickSub1: varchar("click_sub1", { length: 255 }),
  clickSub2: varchar("click_sub2", { length: 255 }),
  clickSub3: varchar("click_sub3", { length: 255 }),

  hoursToConversion: decimal("hours_to_conversion", {
    precision: 10,
    scale: 2,
  }),
  conversionYear: timestamp("conversion_year", { mode: "string" }).notNull(),
});

export const appInstallEvents = mysqlTable("app_install_events", {
  id: serial("id").primaryKey(),
  clickCode: varchar("click_code", { length: 255 }).notNull().unique(),
  deviceId: varchar("device_id", { length: 255 }).notNull(),
  deviceType: varchar("device_type", { length: 255 }).notNull(),
  installTimestamp: varchar("install_timestamp", { length: 255 }).notNull(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AffiliateConversionsSummary =
  typeof affiliateConversionsSummary.$inferSelect;

// Type exports for convenience
export type Affiliate = typeof affiliates.$inferSelect;
export type NewAffiliate = typeof affiliates.$inferInsert;

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

export type CampaignGoal = typeof campaignGoals.$inferSelect;
export type NewCampaignGoal = typeof campaignGoals.$inferInsert;

export type AffiliateCampaignGoal = typeof affiliateCampaignGoals.$inferSelect;
export type NewAffiliateCampaignGoal =
  typeof affiliateCampaignGoals.$inferInsert;

export type AffiliateLink = typeof affiliateLinks.$inferSelect;
export type NewAffiliateLink = typeof affiliateLinks.$inferInsert;

export type Click = typeof clicks.$inferSelect;
export type NewClick = typeof clicks.$inferInsert;

export type PostbackLog = typeof postbackLogs.$inferSelect;
export type NewPostbackLog = typeof postbackLogs.$inferInsert;

export type Payout = typeof payouts.$inferSelect;
export type NewPayout = typeof payouts.$inferInsert;

export type Conversion = typeof conversions.$inferSelect;
export type NewConversion = typeof conversions.$inferInsert;

export type AffiliatePostback = typeof affiliatePostbacks.$inferSelect;
export type NewAffiliatePostback = typeof affiliatePostbacks.$inferInsert;
