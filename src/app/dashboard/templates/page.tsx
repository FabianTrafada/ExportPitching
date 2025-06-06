import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Award, Clock } from "lucide-react";
import {
  getPracticeTemplates,
} from "@/actions/general.actions";

export default async function TemplatesPage() {
  const { templates, totalCount } = await getPracticeTemplates("", "", "", 1, 4);

  return (
    <div className="dashboard-content transition-all duration-300 pt-12 md:pt-0">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Templates Library</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Hero section */}
          <div className="relative bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 md:p-8 border-b border-yellow-200">
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="#FFC107" d="M44.9,-76.2C59.3,-69.2,73.1,-59.3,81.6,-45.4C90.2,-31.6,93.5,-13.8,92.1,3.3C90.7,20.4,84.7,36.7,74.6,50.1C64.5,63.5,50.4,74,35,78.3C19.5,82.6,2.7,80.7,-13.9,77.3C-30.5,73.9,-46.9,69.1,-60.1,59.1C-73.3,49.1,-83.4,33.8,-87.7,16.7C-92.1,-0.4,-90.7,-19.5,-83.9,-35.2C-77.1,-51,-64.8,-63.5,-50.2,-70.5C-35.6,-77.5,-18.8,-79,-2.2,-75.6C14.4,-72.1,30.5,-83.3,44.9,-76.2Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div className="max-w-2xl">
                <h2 className="text-xl md:text-2xl font-semibold mb-2 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
                  Curated Pitch Templates
                </h2>
                <p className="text-gray-700 md:text-lg">
                  Explore our professionally designed templates to practice your export pitches
                  and improve your international business skills.
                </p>
              </div>
              
              <Link href="/dashboard" className="mt-4 md:mt-0">
                <Button className="bg-yellow-500 hover:bg-yellow-600 shadow-sm rounded-full px-6">
                  Browse All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Templates section */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-medium mb-5 flex items-center">
              <Award className="mr-2 h-5 w-5 text-yellow-500" />
              Featured Templates
            </h3>
            
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {templates.map((template) => (
                  <Link href={`/practice/${template.id}`} key={template.id}>
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-yellow-400 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group">
                      <h3 className="font-medium text-lg mb-2 line-clamp-1 group-hover:text-yellow-600 transition-colors">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                      <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${template.difficulty.toLowerCase() === 'beginner' ? 'bg-green-100 text-green-800' : 
                            template.difficulty.toLowerCase() === 'intermediate' ? 'bg-orange-100 text-orange-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {template.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {template.duration} min
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link href="/dashboard">
                  <Button variant="outline" className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-300">
                    View all {totalCount} templates <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 