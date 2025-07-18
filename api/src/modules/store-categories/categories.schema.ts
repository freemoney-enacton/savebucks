import { z } from "zod";

const categoryItemSchema = z.object({
  id: z.number(),
  name: z.record(z.string()).nullable(),
  slug: z.string().nullable(),
  parent_id: z.number().nullable(),
  description: z.record(z.string()).nullable(),
  icon: z.string().nullable(),
  header_image: z.string().nullable(),
  is_featured: z.number(),
  h1: z.record(z.string()).nullable(),
  h2: z.record(z.string()).nullable(),
  meta_title: z.record(z.string()).nullable(),
  meta_desc: z.record(z.string()).nullable()
});

export const fetchCategoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(categoryItemSchema),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().nullable().default(null),
  currentPage: z.any(),
  lastPage: z.any(),
});
