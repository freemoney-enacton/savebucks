import { z } from "zod";

export type bodyType = {
  payment_method_code: string;
  account: string;
  payment_input: string;
  amount: number;
  pay_amount?: number | null;
  receivable_amount?: number | null;
  cashback_amount?: number;
  bonus_amount?: number;
};
export interface UserPayment {
  payment_id: number;
  user_id: number;
  payment_method_code: string;
  account: string;
  payment_input: any;
  amount: number;
  payable_amount: number;
  cashback_amount?: number;
  bonus_amount?: number;
  status: "created" | "declined";
}
export const PaymentSchema = z.object({
  payment_method_code: z.string(),
  account: z
    .string()
    .min(1, "Account is required")
    .max(255, "Account must be less than 255 characters"),
  payment_input: z.any(),
  amount: z.number(),
  pay_amount: z
    .number()
    .optional()
    .nullable(),
  receivable_amount: z
    .number()
    .optional()
    .nullable(),
  cashback_amount: z.number().optional(),
  bonus_amount: z.number().optional(),
   additional_info: z.any().optional(),
});
