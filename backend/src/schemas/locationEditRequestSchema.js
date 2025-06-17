import { z } from "zod";
import { locationPhotoCreateSchema } from "./locationPhotoSchema.js";

export const payloadEditSchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1),
    description: z.string(),
    features: z.array(z.number()).min(1),
    photosToAdd: z.array(locationPhotoCreateSchema),
    photosToDelete: z.array(z.number()),
  })
  .strip()
  .partial();

export const locationEditRequestSchema = z
  .object({
    locationId: z.number(),
    comment: z.string().nullable(),
    payload: payloadEditSchema,
  })
  .strip();
export const locationEditRequestRetrieveSchema =
  locationEditRequestSchema.extend({
    id: z.number(),
    requestedBy: z.number(),
  });
const locationEditRequestFullSchema = locationEditRequestRetrieveSchema.extend({
  location: z.object({
    name: z.string(),
    address: z.string(),
  }),
});
export const locationEditRequestArrayFullSchema = z.array(
  locationEditRequestFullSchema
);
