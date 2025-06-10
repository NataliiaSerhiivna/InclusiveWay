import { z } from "zod";

import {
  lcoationPhotoFullSchema,
  locationPhotoCreateSchema,
} from "./locationPhotoSchema.js";
import { featureFullSchema } from "./featureSchema.js";
import { commentFullSchema } from "./commentSchema.js";

export const locationCreateSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(10),
  approved: z.boolean(),
  verified: z.boolean(),
  createdAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  features: z.array(z.number()).min(1),
  photos: z.array(locationPhotoCreateSchema).min(1),
});
export const locationUpdateSchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1),
    description: z.string().min(10),
    approved: z.boolean(),
    verified: z.boolean(),
  })
  .strip()
  .partial();

export const locationFullSchema = locationCreateSchema.extend({
  id: z.number(),
  createdBy: z.number().min(1),

  features: z.array(featureFullSchema),
  photos: z.array(lcoationPhotoFullSchema),
  comments: z.array(commentFullSchema).min(0),
});

export const bulkUpdateLocationFeaturesSchema = z.object({
  featuresToAdd: z.array(z.number()),
  featuresToDelete: z.array(z.number()),
});
