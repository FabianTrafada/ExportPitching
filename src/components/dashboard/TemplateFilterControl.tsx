"use client"

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
import { Search, Filter, X, SlidersHorizontal, TrendingUp, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TemplateFiltersProps } from "@/types/type";

export default function TemplateFilters({
  search,
  difficulty,
  industry,
  sortBy,
  difficulties,
  industries,
}: TemplateFiltersProps) {
  const router = useRouter();
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
    sortBy?: string;
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
      
      const sortByParam = updates.sortBy !== undefined ? updates.sortBy : sortBy;
      if (sortByParam && sortByParam !== "default") params.set("sortBy", sortByParam);
      
      if (updates.page) params.set("page", updates.page);
      else params.set("page", "1");
      
      router.push(`/dashboard?${params.toString()}`);
    });
  };
  
  const clearFilters = () => {
    setSearchValue("");
    applyFilters({ search: "", difficulty: "all", industry: "all", sortBy: "default" });
    setShowFilters(false);
  };

  const hasActiveFilters = search || (difficulty && difficulty !== "all") || (industry && industry !== "all") || (sortBy && sortBy !== "default");
  
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-2">
        {/* Search with Filter Button Beside It */}
        <div className="flex flex-1 gap-2">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search templates..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-10 h-10 rounded-full border-gray-300 focus-visible:ring-yellow-500"
              />
              {searchValue && (
                <motion.button 
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    if (search) applyFilters({ search: "" });
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </div>
            <Button 
              type="submit" 
              variant="default" 
              size="sm" 
              className="hidden sm:flex h-10 bg-yellow-500 hover:bg-yellow-600 rounded-full px-5"
              disabled={isPending}
            >
              {isPending ? "Searching..." : "Search"}
            </Button>
          </form>

          {/* Filter toggle button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon" 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 w-10 rounded-full border-gray-300 ${showFilters ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}`}
              aria-label={showFilters ? "Close filters" : "Open filters"}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Filter options */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-md">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-yellow-500" /> Filters
                </div>
                
                {hasActiveFilters && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-1.5 text-xs font-medium text-yellow-700 hover:text-yellow-800 hover:bg-yellow-50"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset All Filters
                    </Button>
                  </motion.div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Difficulty</label>
                  <Select 
                    value={difficulty || "all"} 
                    onValueChange={(value) => applyFilters({ difficulty: value })}
                  >
                    <SelectTrigger className="w-full rounded-lg border-gray-200">
                      <SelectValue placeholder="All Difficulties" />
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
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Industry</label>
                  <Select 
                    value={industry || "all"} 
                    onValueChange={(value) => applyFilters({ industry: value })}
                  >
                    <SelectTrigger className="w-full rounded-lg border-gray-200">
                      <SelectValue placeholder="All Industries" />
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
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 ml-1">Sort By</label>
                  <Select 
                    value={sortBy || "default"} 
                    onValueChange={(value) => applyFilters({ sortBy: value })}
                  >
                    <SelectTrigger className="w-full rounded-lg border-gray-200">
                      <SelectValue placeholder="Default Sorting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Sorting</SelectItem>
                      <SelectItem value="popularity">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-yellow-500" />
                          <span>Most Popular</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="difficulty_asc">Difficulty: Easy to Hard</SelectItem>
                      <SelectItem value="difficulty_desc">Difficulty: Hard to Easy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end mt-1">
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => setShowFilters(false)}
                  className="text-xs bg-yellow-500 hover:bg-yellow-600"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Active filter tags */}
      {hasActiveFilters && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 pt-1"
        >
          {search && (
            <div className="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">Search: {search}</span>
              <button 
                onClick={() => applyFilters({ search: "" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {difficulty && difficulty !== "all" && (
            <div className="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">Difficulty: {difficulty}</span>
              <button 
                onClick={() => applyFilters({ difficulty: "all" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {industry && industry !== "all" && (
            <div className="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">Industry: {industry}</span>
              <button 
                onClick={() => applyFilters({ industry: "all" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          {sortBy && sortBy !== "default" && (
            <div className="inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1">
              <span className="mr-1">
                Sort: {sortBy === "popularity" ? "Most Popular" : 
                      sortBy === "newest" ? "Newest First" : 
                      sortBy === "difficulty_asc" ? "Easy to Hard" : 
                      sortBy === "difficulty_desc" ? "Hard to Easy" : sortBy}
              </span>
              <button 
                onClick={() => applyFilters({ sortBy: "default" })}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}