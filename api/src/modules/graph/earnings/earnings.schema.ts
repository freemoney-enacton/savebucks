import z from "zod";

const GraphDataSchema = z.object({
  month: z.string(),
  available: z.union([z.number(), z.string()]), // Assuming it can be a number or string based on your data
  pending: z.union([z.number(), z.string()]), // Assuming it can be a number or string based on your data
  withdraw: z.union([z.number(), z.string()]), // Assuming it can be a number or string based on your data
});

export const ResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    Available: z.string().optional(),
    Pending: z.string().optional(),
    Withdraw: z.string().nullable(),
    totalEarnings: z.number(),
    inProgressPayments: z.string().nullable(),
    graphData: z.array(GraphDataSchema),
  }),
  error: z.any().nullable(),
  msg: z.string().nullable(),
  currentPage: z.any(),
  lastPage: z.any(),
});
