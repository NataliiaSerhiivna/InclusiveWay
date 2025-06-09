import { z } from "zod";

//Request
export const userCreateSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();
export const userLoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  .strict();
export const userFullSchema = userCreateSchema
  .extend({
    id: z.number(),
    role: z.enum(["admin", "user"]),
  })
  .strict();

export const userEditSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
  })
  .strip()
  .partial();
export const userReturnSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    role: z.enum(["admin", "user"]),
  })
  .strip();
