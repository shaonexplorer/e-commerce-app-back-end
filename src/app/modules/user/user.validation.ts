import z from "zod";

export const createUserZodSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string().optional(),
  role: z.enum(["ADMIN", "SELLER", "BUYER"]).optional(),
});
