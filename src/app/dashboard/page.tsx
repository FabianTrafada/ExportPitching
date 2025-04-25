import { getPracticeTemplates, getUniqueDifficulties, getUniqueIndustries } from "@/actions/general.actions";
import Billboard from "@/components/dashboard/Billboard";
import PopularTemplate from "@/components/dashboard/PopularTemplate";
import PracticeCard from "@/components/dashboard/PracticeCard";
import TemplateFilters from "@/components/dashboard/TemplateFilterControl";
import Pagination from "@/components/dashboard/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Use the Next.js provided type for page props
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // Handle search params properly
  const search = searchParams?.search?.toString() || "";
  const difficulty = searchParams?.difficulty?.toString() || "";
  const industry = searchParams?.industry?.toString() || "";
  const pageNumber = searchParams?.page ? parseInt(searchParams.page.toString()) : 1;
  
  const { templates, totalPages } = await getPracticeTemplates(
    search,
    difficulty,
    industry,
    pageNumber
  );
  
  const difficulties = await getUniqueDifficulties();
  const industries = await getUniqueIndustries();
  
  return (
    <div className="dashboard-content transition-all duration-300">
      <Billboard />
      <PopularTemplate />
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold">Practice Templates</h2>
          <TemplateFilters 
            search={search}
            difficulty={difficulty}
            industry={industry}
            difficulties={difficulties}
            industries={industries}
          />
        </div>
        
        <Suspense fallback={<TemplateSkeletons />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.length > 0 ? (
              templates.map((template) => (
                <PracticeCard key={template.id} {...template} />
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">No templates found. Try changing your filters.</p>
              </div>
            )}
          </div>
        </Suspense>
        
        {totalPages > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={pageNumber} totalPages={totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateSkeletons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden">
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}