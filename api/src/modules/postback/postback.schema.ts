import { z } from "zod";

export const postbackDataSchema = z.object({
  hash: z.string(),
  typ: z.string(),
  net: z.string(),
  iky: z.string(),
  uid: z.string(),
  tid: z.string(),
  sts: z.string(),
  amt: z.string().optional(),
  pyt: z.string(),
  oid: z.string().optional(), // Optional fields
  onm: z.string().optional(),
  gid: z.string().optional(),
  sid: z.string().optional(),
  snm: z.string().optional(),
  cip: z.string().optional(),
  scr: z.string().optional(),
  currency:z.string().optional(),
});
 const InBrainRawSchema = z.object({
  Sig: z.string(),
  PanelistId: z.string(),
  RewardType: z.enum(["survey_completed", "survey_disqualified"]),
  UniqueSurveyId:z.string(),
  RewardId: z.string(),
  Reward: z.number(),
  RevenueAmount: z.number(),
  ClientId: z.string(),
  Timestamp: z.string().datetime(),
  Signature: z.string(),
  IsTest: z.boolean(),
});

// Create a callable function (not a schema)
export const InBrainMappedSchema = async (
  rawBody: any,
) => {
  // 1. Parse raw inBrain data
  const payload = InBrainRawSchema.parse(rawBody);

  return {
    hash: payload.Sig,
    typ: "surveys",
    net: "inbrain",
    iky: "PqMHeHLOqTFa34", // ← We'll override this in handler
    uid: payload.PanelistId,
    tid: payload.RewardId,
    sts: "completed",
    amt: payload.Reward.toFixed(2),
    pyt: payload.RevenueAmount.toFixed(2),
    sid: payload.UniqueSurveyId,
    snm: "InBrain Survey",
  };
};
