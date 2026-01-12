import { z } from "zod";

// Order creation schema
export const createOrderSchema = z.object({
    addressId: z.string().min(1, "Address is required"),
    paymentMethod: z.enum(["COD", "RAZORPAY", "UPI"]),
    couponCode: z.string().optional(),
    notes: z.string().optional(),
});

// Order item for cart
export const orderItemSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
