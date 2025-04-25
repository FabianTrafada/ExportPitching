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
import { Search, Filter, X } from "lucide-react";

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
    <div className="w-full md:w-auto space-y-3">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search templates..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button type="submit" variant="default" size="sm" className="hidden md:flex">
            Search
          </Button>
        </form>

        {/* Filter toggle button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 w-10 ${showFilters ? 'bg-gray-100' : ''}`}
        >
          <Filter className="h-4 w-4" />
        </Button>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1 text-sm"
          >
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-2 p-4 bg-gray-50 rounded-md animate-in fade-in">
          <Select 
            value={difficulty || "all"} 
            onValueChange={(value) => applyFilters({ difficulty: value })}
          >
            <SelectTrigger className="w-full md:w-40">
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
            <SelectTrigger className="w-full md:w-40">
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
      )}
    </div>
  );
}