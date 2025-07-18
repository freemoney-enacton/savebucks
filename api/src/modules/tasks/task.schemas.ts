import { z } from "zod";

const taskDetailsSchema = z.object({
  task_id: z.number(),
  Name: z.string(),
  description: z.string().nullable(),
  instructions: z.string().nullable(),
  network: z.string(),
  offer_id: z.string(),
  category_id: z.number(),
  image: z.string().nullable(),
  url: z.string().nullable(),
  countries: z.string(), // JSON encoded string; consider transforming to array if practical for use
  platforms: z.string(), // JSON encoded string; consider transforming to array if practical for use
  payout: z.string(), // This is a string, presumably due to currency formatting
  is_featured: z.number(),
  code: z.string().nullable(),
  network_name: z.string().nullable(),
  logo: z.string().nullable(),
  id: z.number(),
  icon: z.string().nullable(),
  name: z.string(),
  bg_color: z.string(),
  sort_order: z.number(),
  status: z.string(),
  tier: z.number(),
});

// Define the main API response schema using the taskDetailsSchema
export const taskResponseSchema = z.object({
  success: z.boolean(),
  data: taskDetailsSchema,
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const activeTaskResponseSchema = z.object({
  success: z.boolean(),
  data: taskDetailsSchema,
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().nullable(),
});

const TaskSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  // instructions: z.string(),
  network: z.string(),
  offer_id: z.string(),
  task_id: z.string(),
  // category_id: z.number(),
  image: z.string(),
  url: z.string(),
  payout: z.string(),
  countries: z.array(z.string()),
  platforms: z.array(z.string()).nullable(),
  // status: z.string(),
  tier: z.number(),
  is_featured: z.number(),
  // goals_count: z.number(),
  // goals: z.array(
  //   z.object({
  //     id: z.string(),
  //     name: z.string(),
  //     payout: z.number(),
  //     cashback: z.number(),
  //   })
  // ),
  provider: z.object({
    code: z.string().nullable(),
    name: z.string(),
    icon: z.string().nullable(),
  }),
  category: z.object({
    name: z.string(),
    id: z.number(),
    icon: z.string().nullable(),
    bg_color: z.string(),
    sort_order: z.number(),
  }),
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(TaskSchema).optional(), // Mark as optional if `data` can be undefined
  error: z.union([z.string(), z.null()]).optional(), // Use z.union if `error` can be either a string or an object
  msg: z.string().optional(), // Mark as optional if `msg` can be undefined
});

export const taskGoalSchema = z.object({
  name: z.string(),
  description: z.string(),
  id: z.string(),
  payout: z.number(),
});

export const taskCategorySchema = z.object({
  name: z.string(),
  id: z.number(),
  icon: z.string().nullable(),
  bg_color: z.string(),
  sort_order: z.number(),
});

export const taskProviderSchema = z.object({
  code: z.string(),
  name: z.string(),
  icon: z.string(),
});

export const zodTaskItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  instructions: z.string(),
  id: z.number(),
  network: z.string(),
  offer_id: z.string(),
  category_id: z.number(),
  image: z.string(),
  url: z.string(),
  payout: z.string(),
  countries: z.array(z.string()),
  platforms: z.array(z.string()),
  status: z.string(),
  tier: z.number(),
  is_featured: z.number(),
  goals_count: z.number(),
  goals: z.array(taskGoalSchema),
  provider: taskProviderSchema,
  category: taskCategorySchema,
});

export const tasksSchema = z.array(zodTaskItemSchema, taskProviderSchema);

export const zodFetchTaskResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(tasksSchema),
  error: z.string().nullable(),
  msg: z.string().nullable(),
});

export const fetchTaskQuerySchema = z.object({
  name: z.string().optional().nullable().describe("Task name"),
  sort_by: z
    .enum(["highest_reward", "lowest_reward", "latest_featured", "popular"])
    .optional()
    .nullable()
    .describe("Sort by"),
  countries: z
    .string()
    .optional()
    .nullable()
    .describe("Comma separated country codes"),
  page: z.string().nullable().default("1"),
  limit: z.string().nullable().default("20"),
  platform: z
    .string()
    .optional()
    .nullable()
    .describe("Comma separated platform codes"),
  featured: z
    .string()
    .nullable()
    .optional()
    .describe("Featured or not (0 or 1)"),
  recommended: z
    .string()
    .nullable()
    .optional()
    .describe("Featured or not (0 or 1)"),
  network: z.string().optional().nullable().describe("Network name"),
  category: z.string().optional().nullable().describe("Category Slug"),
});

export type FetchTaskQuery = z.infer<typeof fetchTaskQuerySchema>;
