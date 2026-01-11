// Frame attribute types for filters and display

export const FRAME_SHAPES = [
  { value: "ROUND", label: "Round", icon: "⭕" },
  { value: "SQUARE", label: "Square", icon: "⬛" },
  { value: "RECTANGLE", label: "Rectangle", icon: "▬" },
  { value: "AVIATOR", label: "Aviator", icon: "🕶️" },
  { value: "CAT_EYE", label: "Cat Eye", icon: "😺" },
  { value: "WAYFARER", label: "Wayfarer", icon: "🔲" },
  { value: "OVAL", label: "Oval", icon: "⬭" },
  { value: "GEOMETRIC", label: "Geometric", icon: "⬡" },
  { value: "CLUBMASTER", label: "Clubmaster", icon: "🎩" },
] as const;

export const FRAME_MATERIALS = [
  { value: "METAL", label: "Metal" },
  { value: "PLASTIC", label: "Plastic" },
  { value: "ACETATE", label: "Acetate" },
  { value: "TR90", label: "TR90" },
  { value: "TITANIUM", label: "Titanium" },
  { value: "WOOD", label: "Wood" },
  { value: "MIXED", label: "Mixed" },
] as const;

export const GENDERS = [
  { value: "MEN", label: "Men" },
  { value: "WOMEN", label: "Women" },
  { value: "UNISEX", label: "Unisex" },
  { value: "KIDS", label: "Kids" },
] as const;

export const FRAME_SIZES = [
  { value: "SMALL", label: "Small", description: "Narrow face width" },
  { value: "MEDIUM", label: "Medium", description: "Average face width" },
  { value: "LARGE", label: "Large", description: "Wide face width" },
  { value: "EXTRA_LARGE", label: "Extra Large", description: "Very wide face" },
] as const;

export const FRAME_COLORS = [
  { value: "black", label: "Black", code: "#000000" },
  { value: "gold", label: "Gold", code: "#FFD700" },
  { value: "silver", label: "Silver", code: "#C0C0C0" },
  { value: "brown", label: "Brown", code: "#8B4513" },
  { value: "blue", label: "Blue", code: "#0066CC" },
  { value: "tortoise", label: "Tortoise", code: "#8B4513" },
  { value: "transparent", label: "Transparent", code: "#F5F5F5" },
  { value: "rose-gold", label: "Rose Gold", code: "#B76E79" },
  { value: "gunmetal", label: "Gunmetal", code: "#2C3539" },
  { value: "red", label: "Red", code: "#DC143C" },
  { value: "green", label: "Green", code: "#228B22" },
  { value: "purple", label: "Purple", code: "#800080" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 500, label: "Under ₹500" },
  { min: 500, max: 1000, label: "₹500 - ₹1,000" },
  { min: 1000, max: 2000, label: "₹1,000 - ₹2,000" },
  { min: 2000, max: 3000, label: "₹2,000 - ₹3,000" },
  { min: 3000, max: 5000, label: "₹3,000 - ₹5,000" },
  { min: 5000, max: Infinity, label: "Above ₹5,000" },
] as const;

// Type exports
export type FrameShape = (typeof FRAME_SHAPES)[number]["value"];
export type FrameMaterial = (typeof FRAME_MATERIALS)[number]["value"];
export type Gender = (typeof GENDERS)[number]["value"];
export type FrameSize = (typeof FRAME_SIZES)[number]["value"];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
