import z from "zod";

export const createProductZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(), // For browse/search
  price: z.float64(), // Base price
  quantity: z.number().int().nonnegative(), // Stock quantity
  sellerId: z.string().optional(),
});

export const updateProductZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(), // For browse/search
  price: z.float64().optional(), // Base price
  quantity: z.number().int().nonnegative().optional(), // Stock quantity
  sellerId: z.string().optional(),
});
