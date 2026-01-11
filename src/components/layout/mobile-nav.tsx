"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { X, ChevronRight, User, Heart, Package, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { name: string; href: string }[];
}

export function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
  const { data: session } = useSession();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">👓 EyeFrames</SheetTitle>
            <button onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* User Section */}
          <div className="p-4 bg-gray-50">
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-sm text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Login for best experience</p>
                <div className="flex space-x-2">
                  <Link href="/login" onClick={onClose}>
                    <Button size="sm">Login</Button>
                  </Link>
                  <Link href="/register" onClick={onClose}>
                    <Button size="sm" variant="outline">Sign Up</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Categories */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CATEGORIES</h3>
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium">{category.name}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </nav>
            </div>

            <Separator />

            {/* Quick Links */}
            {session && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">MY ACCOUNT</h3>
                <nav className="space-y-1">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <Package className="h-5 w-5 text-gray-500" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100"
                  >
                    <Heart className="h-5 w-5 text-gray-500" />
                    <span>Wishlist</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {session && (
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  signOut();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
