import Billboard from "@/components/dashboard/Billboard";
import PopularTemplate from "@/components/dashboard/PopularTemplate";

export default function DashboardPage() {
  return (
    <div>
      <Billboard />
      <PopularTemplate />
      {/* <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Practice Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceTemplates.map((template, index) => (
            <PracticeCard key={index} {...template} />
          ))}
        </div>
      </div> */}
    </div>
  );
}
