import { z } from "zod";

export const userCreateSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});
export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const userFullSchema = userCreateSchema.extend({
  id: z.number(),
  role: z.enum(["admin", "user"]),
});
