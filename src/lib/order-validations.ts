import { z } from "zod";

// Order creation schema
export const createOrderSchema = z.object({
    addressId: z.string().min(1, "Address is required"),
    paymentMethod: z.enum(["COD", "RAZORPAY", "UPI"]),
    couponCode: z.string().nullish(), // Allow null, undefined, or string
    notes: z.string().nullish(), // Allow null, undefined, or string
});

// Order item for cart
export const orderItemSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
