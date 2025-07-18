import { z } from "zod";

const categoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().nullable(),
  icon: z.string().nullable(),
  bg_color: z.string().nullable(),
  text_color: z.string().nullable(),
  sort_order: z.number(),
  show_menu: z.any(),
});

export const fetchCategoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(categoryItemSchema),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().nullable().default(null),
  currentPage: z.any(),
  lastPage: z.any(),
});
