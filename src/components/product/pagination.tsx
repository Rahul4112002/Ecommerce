"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
}

export function Pagination({ currentPage, totalPages, total }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm text-muted-foreground">
        Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, total)} of {total} products
      </p>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {getPageNumbers().map((page, index) => (
          typeof page === "number" ? (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="px-2">...</span>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
