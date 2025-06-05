import { z } from "zod";

export const featureCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export const featureFullSchema = featureCreateSchema.extend({
  id: z.number(),
});
