import { z } from "zod";

const payoutSchema = z.object({
  totalPaid: z.string().nullable(), // Assuming these should be strings formatted as numbers and can be null
  inProgressPayments: z.string().nullable(),
});

const responseDataSchema = z.object({
  lifetimeEarning: z.any(),
  availablePayout: z.any(),
  payout: payoutSchema,
  offerCompleted: z.number(),
  earningsLastDay: z.any().nullable(),
  referredUsers: z.any().nullable(),
});

export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: responseDataSchema,
  error: z.union([z.string(), z.null()]).optional(), // Adjusted to match "null" as a valid type
  msg: z.string().nullable(), // Corrected from "null" to null; use z.null() if the value must be exactly null
  currentPage: z.any(),
  lastPage: z.any(),
});
