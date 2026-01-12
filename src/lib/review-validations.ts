import { z } from "zod";

export const reviewSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
    rating: z.number().min(1).max(5),
    title: z.string().max(100, "Title must be less than 100 characters").optional(),
    comment: z.string().max(500, "Comment must be less than 500 characters").optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
