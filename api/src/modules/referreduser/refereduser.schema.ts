import { z } from "zod";

const referredUserSchema = z.object({
  email: z.any(),
  name: z.string(),
  joining_date: z.any(),
  earnings: z.any(),
  referral_earning: z.any(),
  count: z.any(),
});

export const referralsApiSchema = z.object({
  success: z.boolean(),
  data: z.array(referredUserSchema),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().nullable().default(null),
  currentPage: z.any(),
  lastPage: z.any(),
});
