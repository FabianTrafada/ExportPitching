"use client";

import { useState, useEffect } from "react";
import { getPracticeTemplates, getUniqueDifficulties, getUniqueIndustries } from "@/actions/general.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  PenSquare, 
  Trash2, 
  Eye,
  Award,
  Search,
  X,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Define template type to match database schema
interface Template {
  id: number;
  title: string;
  description: string;
  questions: string;
  difficulty: string;
  duration: number;
  industry: string;
  targetMarket: string;
  targetMarketCode: string;
  imageUrl: string | null;
  isActive: boolean;
  usageCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    difficulty: 'all',
    industry: 'all',
    status: 'all',
  });
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  // Fetch all data including templates and filter options
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch templates with filters
        const templatesData = await getPracticeTemplates(
          searchQuery,
          filters.difficulty === 'all' ? '' : filters.difficulty,
          filters.industry === 'all' ? '' : filters.industry,
          1,
          100
        );
        setTemplates(templatesData.templates);
        setTotalCount(templatesData.totalCount);
        
        // Fetch filter options
        const difficultyOptions = await getUniqueDifficulties();
        const industryOptions = await getUniqueIndustries();
        setDifficulties(difficultyOptions);
        setIndustries(industryOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      difficulty: 'all',
      industry: 'all',
      status: 'all',
    });
  };

  // Filter templates by active status if the filter is set
  const filteredTemplates = templates.filter(template => {
    if (filters.status === 'all') return true;
    return filters.status === 'active' ? template.isActive : !template.isActive;
  });

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length + 
    (searchQuery ? 1 : 0);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Templates Management</h1>
        
        <Link href="/admin/templates/create">
          <Button className="flex items-center bg-yellow-500 hover:bg-yellow-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-lg font-medium">All Templates ({loading ? '...' : totalCount})</h2>
            
            <div className="flex flex-col md:flex-row gap-2">
              {/* Search box */}
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filters dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 bg-yellow-500 hover:bg-yellow-600">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Filter Templates</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Difficulty filter */}
                  <div className="p-2">
                    <label className="text-xs font-medium mb-1 block">Difficulty</label>
                    <Select
                      value={filters.difficulty}
                      onValueChange={(value) => handleFilterChange('difficulty', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Industry filter */}
                  <div className="p-2">
                    <label className="text-xs font-medium mb-1 block">Industry</label>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => handleFilterChange('industry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Status filter */}
                  <div className="p-2">
                    <label className="text-xs font-medium mb-1 block">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => handleFilterChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full text-yellow-600 hover:text-yellow-700"
                      onClick={clearFilters}
                      disabled={activeFilterCount === 0}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {searchQuery && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="secondary">
                  Search: {searchQuery}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              
              {filters.difficulty !== 'all' && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="secondary">
                  Difficulty: {filters.difficulty}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('difficulty', 'all')}
                  />
                </Badge>
              )}
              
              {filters.industry !== 'all' && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="secondary">
                  Industry: {filters.industry}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('industry', 'all')}
                  />
                </Badge>
              )}
              
              {filters.status !== 'all' && (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200" variant="secondary">
                  Status: {filters.status}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('status', 'all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent"></div>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <p className="mt-2 text-gray-500">No templates found matching the filters</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Target Market</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{template.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{template.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${template.difficulty.toLowerCase() === 'beginner' ? 'bg-green-100 text-green-800' : 
                          template.difficulty.toLowerCase() === 'intermediate' ? 'bg-orange-100 text-orange-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {template.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{template.industry}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{template.targetMarket}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-gray-400 mr-1" />
                        {template.usageCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link href={`/admin/templates/edit/${template.id}`}>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <PenSquare className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/practice/${template.id}`} target="_blank">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/templates/delete/${template.id}`}>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
} 