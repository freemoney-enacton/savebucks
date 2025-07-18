import { z } from "zod";

export const clickTaskSchema = z.object({
  platform: z.string().max(50),
  task_type: z.string().max(25),
  network: z.string().max(25),
  task_offer_id: z.string().max(50).nullable(),
  campaign_id: z.string().max(50),
});
export const clickTaskQuerySchema = z.object({
  platform: z.string().max(50),
  task_type: z.string().max(25),
  network: z.string().max(25),
  campaign_id: z.string().max(50),
});
export const clickInsertResponse = z.object({
  success: z.boolean(),
  data: z.string().optional(), // Assuming `data` can be an empty string and is optional.
  error: z
    .union([z.string(), z.literal("null")])
    .nullable()
    .optional(), // If `error` can be 'null' as a string or a true null value.
  msg: z.string(), // Corrected to match the JSON response field name.
});
export const fetchClickTaskQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().default("20").optional(),
  platform: z.string().max(50).optional(),
  task_type: z.string().max(25).optional(),
  network: z.string().max(25).optional(),
  date: z.string().max(50).describe("Date in MM_YYYY format").optional(),
});
const clickItemSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().optional(),
  platform: z.string().optional(),
  task_type: z.string().optional(),
  network: z.string().optional(),
  task_offer_id: z.string().optional().nullable(),
  campaign_id: z.string().optional(),
  clicked_on: z.string().optional(),
  countries: z.string().optional(),
  locale: z.string().optional(),
  Referer: z.string().optional(),
  user_agent: z.string().optional(),
});

// Schema for the entire API response
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(clickItemSchema),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().optional(),
  currentPage: z.any(),
  lastPage: z.any(),
});

export type ClickTaskQuery = z.infer<typeof clickTaskSchema>;
