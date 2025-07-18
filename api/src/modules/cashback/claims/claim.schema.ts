import { z } from "zod";

const claimSchema = z.object({
  id: z.any(),
  network: z.any(),
  networkIcon: z.any(),
  networkName: z.any(),
  transaction_id: z.any(),
  user_id: z.any(),
  task_offer_id: z.any(),
  network_goal_id: z.any(),
  offer_id: z.any(),
  task_name: z.any(),
  task_type: z.any(),
  amount: z.any(),
  payout: z.any(),
  status: z.any(),
  mail_sent: z.any(),
  created_at: z.any(),
});
export const requestClaimSchema = z.object({
  store_id: z.string(),
  click_id: z.string(),
  platform: z.string(),
  order_id: z.string(),
  order_amount: z.string(),
  currency: z.string(),
  transaction_date: z.string(),
  user_message: z.string().optional(),
  receipt:z.any().optional()
});
export type ClaimRequestBody = z.infer<typeof requestClaimSchema>;
export const apiResponseSchema = z.object({
  success: z.any(),
  data: z.array(claimSchema),
  error: z.union([z.string(), z.null()]).optional(),
  msg: z.string().nullable().default(null),
  currentPage: z.any(),
  lastPage: z.any(),
});
