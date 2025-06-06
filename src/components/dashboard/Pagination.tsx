// src/components/dashboard/Pagination.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationProps } from "@/types/type";

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/dashboard?${params.toString()}`;
  };
  
  const getPageNumbers = () => {
    const maxPagesToShow = window.innerWidth < 640 ? 3 : 5; // Show fewer page numbers on small screens
    const pages = [];
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust for mobile
      if (window.innerWidth < 640) {
        if (currentPage <= 2) {
          end = Math.min(totalPages - 1, 2);
        } else if (currentPage >= totalPages - 1) {
          start = Math.max(2, totalPages - 2);
        } else {
          start = currentPage;
          end = currentPage;
        }
      } else {
        if (currentPage <= 2) {
          end = Math.min(totalPages - 1, 4);
        } else if (currentPage >= totalPages - 1) {
          start = Math.max(2, totalPages - 3);
        }
      }
      
      if (start > 2) {
        pages.push(-1); // Ellipsis
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push(-2); // Ellipsis
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((pageNumber, i) => {
        if (pageNumber < 0) {
          return (
            <span key={`ellipsis-${i}`} className="px-1 sm:px-2 text-sm">
              ...
            </span>
          );
        }
        
        return (
          <Button
            key={`page-${pageNumber}`}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="sm"
            onClick={() => router.push(createPageURL(pageNumber))}
            className="h-8 w-8"
          >
            {pageNumber}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}