"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, calculateDiscount } from "@/lib/helpers";
import { useCartStore } from "@/lib/store/cart-store";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  shape?: string;
  material?: string;
  colors?: string[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const discount = product.comparePrice 
    ? calculateDiscount(product.price, product.comparePrice) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {/* Product Image */}
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-gray-50 to-gray-100">
            👓
          </div>
          
          {/* Discount Badge */}
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {discount}% OFF
            </Badge>
          )}

          {/* Wishlist Button */}
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Quick Add Button */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="sm" 
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="p-3">
          {/* Product Info */}
          <div className="space-y-1">
            {/* Shape & Material */}
            {(product.shape || product.material) && (
              <p className="text-xs text-gray-500">
                {product.shape} {product.material && `• ${product.material}`}
              </p>
            )}
            
            {/* Name */}
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1 pt-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
