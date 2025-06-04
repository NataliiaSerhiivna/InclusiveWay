import { z } from "zod";

export const featureCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});
