import { z } from "zod";

export const querySchema = z.object({
  provider: z.string(),
  country: z.string(),
  sort: z.string().optional(),
  page: z.string().default("1"),
});
const surveyItemSchema = z.object({
  id: z.string(),
  network: z.string(),
  campaign_id: z.string(),
  title: z.string(),
  length_loi: z.number(),
  payout: z.number(),
  score: z.number(),
  rating: z.number(),
  rating_count: z.number(),
  type: z.string(),
  link: z.string().url(),
  category_name: z.string(),
  category_icon: z.string().url(),
  category_icon_name: z.string(),
});

export const responseSchema = z.object({
  success: z.boolean(),
  data: z.array(surveyItemSchema),
  error: z.union([z.string(), z.null()]), // Adjusted to accept a string "null" or a null value
  msg: z.union([z.string(), z.null()]), // Same adjustment as 'error' field
});
