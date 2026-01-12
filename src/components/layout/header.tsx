"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  Package,
  Settings,
  Truck,
  Glasses
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/search/search-bar";
// Theme toggle removed - dark mode only
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileNav } from "./mobile-nav";
import { useCartStore } from "@/lib/store/cart-store";

const categories = [
  { name: "Men", href: "/products?gender=MEN" },
  { name: "Women", href: "/products?gender=WOMEN" },
  { name: "Kids", href: "/products?gender=KIDS" },
  { name: "Sunglasses", href: "/products?category=sunglasses" },
  { name: "New Arrivals", href: "/products?sort=newest" },
  { name: "Sale", href: "/products?sale=true" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-gold/20">
      {/* Top Bar - Announcement */}
      <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-black text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        Free Shipping on orders above ₹999 | Use code: FIRST10 for 10% off
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* Icon Mark */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-gold via-gold-light to-gold border border-gold/50 shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all">
              <Glasses className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            {/* Brand Text - visible on all screens with responsive sizing */}
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl md:text-2xl font-bold font-heading tracking-wide bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
                LeeHit
              </span>
              <span className="text-[8px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] text-gray-400 -mt-0.5">
                Eyewear
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:block">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {session.user?.role === "ADMIN" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Category Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-8 py-3 border-t">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Search - Below header on mobile */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </header>
  );
}
