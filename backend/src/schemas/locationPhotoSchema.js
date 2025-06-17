import { z } from "zod";

export const locationPhotoCreateSchema = z.object({
  imageURL: z.string(),
  description: z.string(),
  uploadedAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
});

export const lcoationPhotoFullSchema = locationPhotoCreateSchema.extend({
  id: z.number(),
  locationId: z.number(),
});

export const bulkUpdateLocationPhotosSchema = z.object({
  photosToAdd: z.array(locationPhotoCreateSchema),
  photosToDelete: z.array(z.number()),
});
