import { z } from "zod";
import { locationUpdateSchema } from "./locationSchema.js";
import { bulkUpdateLocationPhotosSchema } from "./locationPhotoSchema.js";
const payloadEditSchema = z
  .object({
    locationUpdateSchema,
    bulkUpdateLocationPhotosSchema,
    features: z.array(z.number()).min(1),
  })
  .strip()
  .partial();

export const editRequestSchema = z.object({
  id: z.number(),
  location_id: z.number(),
  requested_by: z.number(),
  comment: z.string().nullable(),
  payload: payloadEditSchema,
});
