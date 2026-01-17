import { z } from "zod";

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Invalid Indian phone number (10 digits starting with 6-9)",
    }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Address schema
export const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  address: z.string().min(10, "Enter complete address"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
  type: z.enum(["HOME", "OFFICE", "OTHER"]).default("HOME"),
  isDefault: z.boolean().default(false),
});

// Product schema (for admin)
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  comparePrice: z.number().positive().optional(),
  sku: z.string().min(3, "SKU is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  // Frame attributes
  shape: z.enum([
    "ROUND", "SQUARE", "RECTANGLE", "AVIATOR", "CAT_EYE",
    "WAYFARER", "OVAL", "GEOMETRIC", "CLUBMASTER"
  ]),
  material: z.enum([
    "METAL", "PLASTIC", "ACETATE", "TR90", "TITANIUM", "WOOD", "MIXED"
  ]),
  gender: z.enum(["MEN", "WOMEN", "UNISEX", "KIDS"]),
  frameSize: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE"]),
  frameWidth: z.number().int().positive().optional(),
  bridgeWidth: z.number().int().positive().optional(),
  templeLength: z.number().int().positive().optional(),
  weight: z.number().int().positive().optional(),
});

// Product variant schema
export const productVariantSchema = z.object({
  color: z.string().min(2, "Color name is required"),
  colorCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color code"),
  stock: z.number().int().min(0),
  price: z.number().positive().optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1-5"),
  title: z.string().optional(),
  comment: z.string().optional(),
});

// Coupon schema
export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean().default(true),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional(),
  subject: z.string().min(5, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CouponInput = z.infer<typeof couponSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
