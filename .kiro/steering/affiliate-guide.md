# Affiliate Panel Development Guide

The affiliate panel is built with Next.js 14.2 using the App Router, React 18, and TypeScript. It provides affiliates with campaign management, link generation, commission tracking, and payout management capabilities for the SaveBucks affiliate marketing platform.

### Core Principles

- **Component-First**: Reusable, composable UI components with Radix UI
- **Type Safety**: Full TypeScript coverage with Drizzle ORM
- **Performance**: Optimized for affiliate dashboard analytics and reporting
- **Security**: Secure authentication and data protection
- **Internationalization**: Multi-language support with next-intl
- **Database-First**: PostgreSQL with Drizzle ORM for type-safe queries

## Project Structure

```
affiliate-panel/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected affiliate pages
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   ├── layouts/           # Layout components
│   ├── links/             # Link management components
│   ├── payouts/           # Payout management components
│   ├── settings/          # Settings components
│   ├── transactions/      # Transaction components
│   └── ui/                # Generic UI components (Radix UI)
├── db/                    # Database layer
│   ├── schema.ts          # Drizzle schema definitions
│   ├── index.ts           # Database connection
│   └── migration.ts       # Migration runner
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization
├── models/                # Data models and API functions
├── services/              # Business logic services
├── utils/                 # Utility functions
└── crons/                 # Scheduled tasks
```

## Database Schema & Models

### Core Database Schema

**`db/schema.ts`**

```typescript
import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  timestamp,
  bigint,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const approvalStatusEnum = pgEnum("approval_status", [
  "approved",
  "rejected",
  "suspended",
  "pending",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "active",
  "paused",
  "ended",
]);

export const conversionStatusEnum = pgEnum("conversion_status", [
  "pending",
  "approved",
  "declined",
  "paid",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
  "pending",
  "processing",
  "rejected",
  "paid",
]);

// Affiliates table
export const affiliates = pgTable("affiliates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password_hash", { length: 255 }).notNull(),
  approvalStatus: approvalStatusEnum("approval_status").default("pending"),
  paypalAddress: varchar("paypal_address", { length: 255 }),
  bankDetails: jsonb("bank_details"),
  address: jsonb("address"),
  taxId: varchar("tax_id", { length: 255 }),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  emailVerifiedAt: timestamp("email_verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  logoUrl: varchar("logo_url", { length: 255 }),
  campaignType: varchar("campaign_type", { length: 255 }).notNull(),
  status: campaignStatusEnum("status").notNull().default("active"),
  termsAndConditions: text("terms_and_conditions"),
  minPayoutAmount: numeric("min_payout_request").notNull().default("0.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Campaign goals table
export const campaignGoals = pgTable("campaign_goals", {
  id: serial("id").primaryKey(),
  campaignId: bigint("campaign_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  commissionType: varchar("commission_type", { length: 255 }).notNull(),
  commissionAmount: numeric("commission_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  trackingCode: char("tracking_code", { length: 10 }).notNull().unique(),
  status: statusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Type exports
export type Affiliate = typeof affiliates.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type CampaignGoal = typeof campaignGoals.$inferSelect;
```

### Model Implementation

**`models/affiliates-model/index.ts`**

```typescript
import { db } from "@/db";
import { affiliates } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAffiliateById = async (id: number) => {
  try {
    const result = await db
      .select()
      .from(affiliates)
      .where(eq(affiliates.id, id));

    return {
      data: result[0] || null,
      message: "ok",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};

export const updateAffiliateProfile = async (id: number, updateData: any) => {
  try {
    const result = await db.transaction(async (tx) => {
      const updated = await tx
        .update(affiliates)
        .set({
          name: updateData.name,
          address: updateData.address,
          updatedAt: new Date(),
        })
        .where(eq(affiliates.id, id))
        .returning();
      return updated[0];
    });

    if (!result) {
      return {
        data: null,
        message: "Affiliate not found",
        status: "error",
      };
    }

    return {
      data: result,
      message: "Affiliate updated successfully",
      status: "success",
    };
  } catch (error: any) {
    return {
      data: null,
      message: error.message || "An error occurred",
      status: "error",
    };
  }
};
```

## Component Architecture

### Dashboard Components

**`components/dashboard/StatsCard.tsx`**

```typescript
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}) => {
  const changeColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change && (
          <p className={`text-xs ${changeColors[changeType]} mt-1`}>{change}</p>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
```

**`components/dashboard/EarningsChart.tsx`**

```typescript
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EarningsData {
  date: string;
  earnings: number;
  clicks: number;
  conversions: number;
}

interface EarningsChartProps {
  data: EarningsData[];
  period: string;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({
  data,
  period,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings Overview - {period}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number, name: string) => [
                name === "earnings" ? `$${value.toFixed(2)}` : value,
                name.charAt(0).toUpperCase() + name.slice(1),
              ]}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
```

### Link Management Components

**`components/links/LinkGenerator.tsx`**

```typescript
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: number;
  name: string;
  status: string;
}

interface LinkGeneratorProps {
  campaigns: Campaign[];
  onLinkGenerated: (link: any) => void;
}

const validationSchema = Yup.object({
  campaignId: Yup.number().required("Campaign is required"),
  name: Yup.string().required("Link name is required"),
  destinationUrl: Yup.string()
    .url("Must be a valid URL")
    .required("Destination URL is required"),
  sub1: Yup.string().optional(),
  sub2: Yup.string().optional(),
  sub3: Yup.string().optional(),
});

export const LinkGenerator: React.FC<LinkGeneratorProps> = ({
  campaigns,
  onLinkGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      campaignId: "",
      name: "",
      destinationUrl: "",
      sub1: "",
      sub2: "",
      sub3: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsGenerating(true);
      try {
        const response = await fetch("/api/affiliate-links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (result.status === "success") {
          const affiliateLink = `${window.location.origin}/l/${result.data.slug}`;
          setGeneratedLink(affiliateLink);
          onLinkGenerated(result.data);

          toast({
            title: "Link Generated Successfully",
            description:
              "Your affiliate link has been created and is ready to use.",
          });
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to generate link",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Affiliate Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaignId">Campaign *</Label>
              <Select
                value={formik.values.campaignId}
                onValueChange={(value) =>
                  formik.setFieldValue("campaignId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns
                    .filter((c) => c.status === "active")
                    .map((campaign) => (
                      <SelectItem
                        key={campaign.id}
                        value={campaign.id.toString()}
                      >
                        {campaign.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formik.touched.campaignId && formik.errors.campaignId && (
                <p className="text-sm text-red-600 mt-1">
                  {formik.errors.campaignId}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="name">Link Name *</Label>
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Homepage Banner"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-600 mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="destinationUrl">Destination URL *</Label>
            <Input
              id="destinationUrl"
              name="destinationUrl"
              value={formik.values.destinationUrl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="https://example.com/landing-page"
            />
            {formik.touched.destinationUrl && formik.errors.destinationUrl && (
              <p className="text-sm text-red-600 mt-1">
                {formik.errors.destinationUrl}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sub1">Sub ID 1</Label>
              <Input
                id="sub1"
                name="sub1"
                value={formik.values.sub1}
                onChange={formik.handleChange}
                placeholder="Optional tracking parameter"
              />
            </div>
            <div>
              <Label htmlFor="sub2">Sub ID 2</Label>
              <Input
                id="sub2"
                name="sub2"
                value={formik.values.sub2}
                onChange={formik.handleChange}
                placeholder="Optional tracking parameter"
              />
            </div>
            <div>
              <Label htmlFor="sub3">Sub ID 3</Label>
              <Input
                id="sub3"
                name="sub3"
                value={formik.values.sub3}
                onChange={formik.handleChange}
                placeholder="Optional tracking parameter"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !formik.isValid}
            className="w-full"
          >
            {isGenerating ? "Generating..." : "Generate Link"}
          </Button>
        </form>

        {generatedLink && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Label className="text-sm font-medium text-green-800">
              Your Affiliate Link:
            </Label>
            <div className="flex items-center gap-2 mt-2">
              <Input value={generatedLink} readOnly className="bg-white" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(generatedLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## Pages Implementation

### Dashboard Page

**`app/(protected)/dashboard/page.tsx`**

```typescript
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EarningsChart } from "@/components/dashboard/EarningsChart";
import { DollarSign, MousePointer, TrendingUp, Users } from "lucide-react";

interface DashboardStats {
  totalEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  pendingEarnings: number;
  paidEarnings: number;
}

interface EarningsData {
  date: string;
  earnings: number;
  clicks: number;
  conversions: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats
      const statsResponse = await fetch(
        `/api/dashboard/stats?period=${period}`
      );
      const statsResult = await statsResponse.json();

      if (statsResult.status === "success") {
        setStats(statsResult.data);
      }

      // Fetch earnings chart data
      const earningsResponse = await fetch(
        `/api/dashboard/earnings?period=${period}`
      );
      const earningsResult = await earningsResponse.json();

      if (earningsResult.status === "success") {
        setEarningsData(earningsResult.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your affiliate performance overview
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings.toFixed(2) || "0.00"}`}
          change={`$${stats?.pendingEarnings.toFixed(2) || "0.00"} pending`}
          changeType="neutral"
          icon={DollarSign}
          description="Lifetime commission earnings"
        />

        <StatsCard
          title="Total Clicks"
          value={stats?.totalClicks.toLocaleString() || "0"}
          icon={MousePointer}
          description="Total link clicks generated"
        />

        <StatsCard
          title="Conversions"
          value={stats?.totalConversions.toLocaleString() || "0"}
          icon={TrendingUp}
          description="Successful conversions"
        />

        <StatsCard
          title="Conversion Rate"
          value={`${stats?.conversionRate.toFixed(2) || "0.00"}%`}
          changeType={stats?.conversionRate > 2 ? "positive" : "neutral"}
          icon={Users}
          description="Click to conversion ratio"
        />
      </div>

      {/* Earnings Chart */}
      <EarningsChart data={earningsData} period={period} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generate New Link
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Create a new affiliate link for your campaigns
          </p>
          <a
            href="/links"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Link
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Request Payout
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Withdraw your earned commissions
          </p>
          <a
            href="/payouts"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Request Payout
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            View Reports
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Detailed analytics and transaction history
          </p>
          <a
            href="/transactions"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Reports
          </a>
        </div>
      </div>
    </div>
  );
}
```

## Authentication & Middleware

### NextAuth Configuration

**`app/api/auth/[...nextauth]/route.ts`**

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { getAffiliateByEmail } from "@/models/affiliates-model";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await getAffiliateByEmail(credentials.email);

          if (result.status !== "success" || !result.data) {
            return null;
          }

          const affiliate = result.data;

          // Check if email is verified
          if (!affiliate.isEmailVerified) {
            throw new Error("Please verify your email before signing in");
          }

          // Check approval status
          if (affiliate.approvalStatus !== "approved") {
            throw new Error("Your account is pending approval");
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            affiliate.password
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: affiliate.id.toString(),
            email: affiliate.email,
            name: affiliate.name,
            approvalStatus: affiliate.approvalStatus,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.approvalStatus = user.approvalStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.approvalStatus = token.approvalStatus as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
});

export { handler as GET, handler as POST };
```

## API Routes

### Dashboard Stats API

**`app/api/dashboard/stats/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/db";
import { conversions, clicks, payouts } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized" },
        { status: 401 }
      );
    }

    const affiliateId = parseInt(session.user.id);
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    // Calculate date range
    const daysMap: { [key: string]: number } = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = daysMap[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get total earnings
    const earningsResult = await db
      .select({
        totalEarnings: sql<number>`COALESCE(SUM(${conversions.commission}), 0)`,
        pendingEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${conversions.status} = 'pending' THEN ${conversions.commission} ELSE 0 END), 0)`,
        paidEarnings: sql<number>`COALESCE(SUM(CASE WHEN ${conversions.status} = 'paid' THEN ${conversions.commission} ELSE 0 END), 0)`,
      })
      .from(conversions)
      .where(
        and(
          eq(conversions.affiliateId, affiliateId),
          gte(conversions.convertedAt, startDate)
        )
      );

    // Get total clicks
    const clicksResult = await db
      .select({
        totalClicks: sql<number>`COUNT(*)`,
      })
      .from(clicks)
      .where(
        and(
          eq(clicks.affiliateId, affiliateId),
          gte(clicks.clickedAt, startDate)
        )
      );

    // Get total conversions
    const conversionsResult = await db
      .select({
        totalConversions: sql<number>`COUNT(*)`,
      })
      .from(conversions)
      .where(
        and(
          eq(conversions.affiliateId, affiliateId),
          gte(conversions.convertedAt, startDate)
        )
      );

    const stats = {
      totalEarnings: earningsResult[0]?.totalEarnings || 0,
      pendingEarnings: earningsResult[0]?.pendingEarnings || 0,
      paidEarnings: earningsResult[0]?.paidEarnings || 0,
      totalClicks: clicksResult[0]?.totalClicks || 0,
      totalConversions: conversionsResult[0]?.totalConversions || 0,
      conversionRate:
        clicksResult[0]?.totalClicks > 0
          ? ((conversionsResult[0]?.totalConversions || 0) /
              clicksResult[0].totalClicks) *
            100
          : 0,
    };

    return NextResponse.json({
      status: "success",
      data: stats,
    });
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Best Practices

### DO:

- Use TypeScript for all components and functions
- Implement proper error boundaries and loading states
- Use Drizzle ORM for type-safe database operations
- Implement proper form validation with Formik and Yup
- Use NextAuth for secure authentication
- Implement proper authorization checks
- Use Radix UI components for accessibility
- Write comprehensive API error handling
- Implement proper logging and monitoring
- Use environment variables for configuration
- Implement proper data validation on both client and server
- Use proper HTTP status codes in API responses

### DON'T:

- Skip input validation and sanitization
- Store sensitive data in client-side storage
- Use `any` type in TypeScript
- Skip error handling in API routes
- Ignore accessibility requirements
- Hardcode configuration values
- Skip authentication checks in protected routes
- Use plain text passwords
- Skip rate limiting on API endpoints
- Ignore database transaction requirements
- Skip proper logging for audit trails

## Environment Configuration

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/affiliate_panel

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
AUTH_SECRET=your-auth-secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# PayPal (for payouts)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run ESLint

# Database
npm run migrate                # Run database migrations
npm run studio                 # Open Drizzle Studio
npm run db:push                # Push schema changes to database

# Utilities
npm run crons                  # Start cron jobs
npm run type-check             # Check TypeScript types
```
