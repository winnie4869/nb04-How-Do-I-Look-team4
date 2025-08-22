import { z } from "zod";

export const createCurationSchema =  z.object({
  nickname: z.string().max(20),
  password: z.string().min(8).max(16),
  content: z.string().max(150),
  trendy: z.number().int().min(0).max(10),
  personality: z.number().int().min(0).max(10),
  practicality: z.number().int().min(0).max(10),
  costEffectiveness: z.number().int().min(0).max(10),
});