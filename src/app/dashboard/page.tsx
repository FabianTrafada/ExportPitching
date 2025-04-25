import {
  getPracticeTemplates,
  getUniqueDifficulties,
  getUniqueIndustries,
} from "@/actions/general.actions";
import Billboard from "@/components/dashboard/Billboard";
import PopularTemplate from "@/components/dashboard/PopularTemplate";
import PracticeCard from "@/components/dashboard/PracticeCard";
import TemplateFilters from "@/components/dashboard/TemplateFilterControl";
import Pagination from "@/components/dashboard/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DashboardPage({ searchParams }: Props) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;

  // Handle search params properly
  const search = resolvedSearchParams?.search?.toString() || "";
  const difficulty = resolvedSearchParams?.difficulty?.toString() || "";
  const industry = resolvedSearchParams?.industry?.toString() || "";
  const pageNumber = resolvedSearchParams?.page
    ? parseInt(resolvedSearchParams.page.toString())
    : 1;

  const { templates, totalPages } = await getPracticeTemplates(
    search,
    difficulty,
    industry,
    pageNumber
  );

  const difficulties = await getUniqueDifficulties();
  const industries = await getUniqueIndustries();

  return (
    <div className="dashboard-content transition-all duration-300 pt-12 md:pt-0">
      <Billboard />
      <PopularTemplate />
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col gap-3 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Practice Templates</h2>
          <TemplateFilters
            search={search}
            difficulty={difficulty}
            industry={industry}
            difficulties={difficulties}
            industries={industries}
          />
        </div>

        <Suspense fallback={<TemplateSkeletons />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {templates.length > 0 ? (
              templates.map((template) => (
                <PracticeCard key={template.id} {...template} />
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">
                  No templates found. Try changing your filters.
                </p>
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
      {Array(8)
        .fill(0)
        .map((_, i) => (
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
