import { z } from "zod";

export const commentCreateSchema = z.object({
  content: z.string(),
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
});

export const commentEditSchema = commentCreateSchema.partial();

export const commentFullSchema = commentCreateSchema.extend({
  id: z.number(),
  locationId: z.number(),
  userId: z.number(),
  userName: z.string(),
});
