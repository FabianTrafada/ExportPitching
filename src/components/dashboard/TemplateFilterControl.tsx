"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";

interface TemplateFiltersProps {
  search: string;
  difficulty: string;
  industry: string;
  difficulties: string[];
  industries: string[];
}

export default function TemplateFilters({
  search,
  difficulty,
  industry,
  difficulties,
  industries,
}: TemplateFiltersProps) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  
  const [searchValue, setSearchValue] = useState(search);
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search: searchValue });
  };
  
  const applyFilters = (updates: {
    search?: string;
    difficulty?: string;
    industry?: string;
    page?: string;
  }) => {
    startTransition(() => {
      const params = new URLSearchParams();
      
      const searchParam = updates.search !== undefined ? updates.search : search;
      if (searchParam) params.set("search", searchParam);
      
      const difficultyParam = updates.difficulty !== undefined ? updates.difficulty : difficulty;
      if (difficultyParam && difficultyParam !== "all") params.set("difficulty", difficultyParam);
      
      const industryParam = updates.industry !== undefined ? updates.industry : industry;
      if (industryParam && industryParam !== "all") params.set("industry", industryParam);
      
      if (updates.page) params.set("page", updates.page);
      else params.set("page", "1");
      
      router.push(`/dashboard?${params.toString()}`);
    });
  };
  
  const clearFilters = () => {
    setSearchValue("");
    applyFilters({ search: "", difficulty: "all", industry: "all" });
  };

  const hasActiveFilters = search || difficulty || industry;
  
  return (
    <div className="w-full space-y-2 md:space-y-3">
      <div className="flex gap-2">
        {/* Search with Filter Button Beside It */}
        <div className="flex flex-1 gap-2">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search templates..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-8 pr-10 h-10"
              />
              {searchValue && (
                <button 
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" variant="default" size="sm" className="hidden sm:flex h-10">
              Search
            </Button>
          </form>

          {/* Filter toggle button - now positioned beside search */}
          <Button
            variant="outline"
            size="icon" 
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 ${showFilters ? 'bg-gray-100' : ''}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
            )}
          </Button>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-sm h-10"
          >
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Filter options - mobile friendly */}
      {showFilters && (
        <div className="flex flex-col gap-3 p-3 md:p-4 bg-gray-50 rounded-md animate-in fade-in">
          <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Select 
              value={difficulty || "all"} 
              onValueChange={(value) => applyFilters({ difficulty: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((diff) => (
                  <SelectItem key={diff} value={diff}>
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={industry || "all"} 
              onValueChange={(value) => applyFilters({ industry: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(false)}
              className="text-xs"
            >
              Close
            </Button>
            {hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}