import z from "zod";

export const createProductZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(), // For browse/search
  price: z.string(), // Base price
  quantity: z.string(), // Stock quantity
  sellerId: z.string().optional(),
});

export const updateProductZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(), // For browse/search
  price: z.string().optional(), // Base price
  quantity: z.string().optional(), // Stock quantity
  sellerId: z.string().optional(),
});
