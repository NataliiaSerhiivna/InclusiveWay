import { z } from "zod";

export const reviewCreateSchema = z.object({
  content: z.string(),
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  rating: z.number().min(1).max(5),
});

export const reviewEditSchema = reviewCreateSchema.partial();

export const reviewFullSchema = reviewCreateSchema.extend({
  id: z.number(),
  locationId: z.number(),
  userId: z.number(),
});
