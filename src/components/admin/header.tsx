"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-800 bg-gray-950 px-6">
      {/* Search */}
      <div className="flex-1 ml-12 lg:ml-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products, orders, users..."
            className="pl-9 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-gold/50 focus:ring-gold/20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-gray-800">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gold text-black font-semibold">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-gray-900 border-gray-700">
            <DropdownMenuLabel className="text-white">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
              <p className="font-medium text-white">New Order #1234</p>
              <p className="text-xs text-gray-400">
                Order worth ₹2,499 received from Rahul
              </p>
              <p className="text-xs text-gray-500">2 min ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
              <p className="font-medium text-white">Low Stock Alert</p>
              <p className="text-xs text-gray-400">
                Classic Aviator Gold Frame is running low (5 left)
              </p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
              <p className="font-medium text-white">New Review</p>
              <p className="text-xs text-gray-400">
                5-star review on Round Retro Black Frame
              </p>
              <p className="text-xs text-gray-500">3 hours ago</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-center text-gold cursor-pointer hover:bg-gray-800 focus:bg-gray-800 justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
