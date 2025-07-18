import { z } from "zod";



export const fetchClickQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().default("20").optional(),
  date: z.string().max(50).describe("Date in MM_YYYY format").optional(),
});


