import { z } from "zod";

// Define a single payment input structure
const PaymentInput = z.object({
  field: z.string(),
  label: z.string(),
});

// Correctly define the PaymentType schema, focusing on fixing the payment_inputs transformation
const PaymentType = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  image: z.string(),
  account_input_type: z.any(),
  account_input_label: z.any(),
  account_input_hint: z.any(),
  payment_inputs: z.any(),
  minimum_amount: z.string(),
  transaction_fees_amount: z.string().optional().nullable(),
  transaction_fees_type: z
    .union([z.literal("fixed"), z.literal("percent")])
    .optional()
    .nullable(),
  transaction_bonus_amount: z.string().optional().nullable(),
  transaction_bonus_type: z.string().optional().nullable(),
  cashback_allowed: z.number(),
  bonus_allowed: z.number(),
  payment_group: z.any(),
  enabled: z.number(),
});

export const fetchTypesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(PaymentType),
  // Transform the string "null" to actual null for both error and msg, handling both expected and unexpected formats
  error: z
    .union([z.string(), z.null()])
    .transform((val) => (val === "null" ? null : val)),
  msg: z
    .union([z.string(), z.null()])
    .transform((val) => (val === "null" ? null : val)),
  currentPage: z.any(),
  lastPage: z.any(),
});
