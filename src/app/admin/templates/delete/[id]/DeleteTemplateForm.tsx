"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { deleteTemplate } from "@/actions/admin.actions";

interface TemplateType {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  industry: string;
  targetMarket: string;
  usageCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function DeleteTemplateForm({ 
  initialTemplate, 
  templateId 
}: { 
  initialTemplate: TemplateType | null;
  templateId: number;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  // Display error if template is not found
  if (!initialTemplate) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-gray-600">Template not found</p>
          <Button 
            className="mt-4"
            onClick={() => router.push("/admin/templates")}
          >
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await deleteTemplate(templateId);

      if (response.success) {
        router.push("/admin/templates");
      } else {
        setError(response.error || "Failed to delete template");
      }
    } catch (err) {
      setError("An error occurred while deleting the template");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold">Delete Template</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <h2 className="text-xl font-semibold text-red-600">Delete Confirmation</h2>
        </div>
        
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete the following template? This action cannot be undone.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium mb-2">{initialTemplate.title}</h3>
          <p className="text-gray-600 mb-2">{initialTemplate.description}</p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded-md">{initialTemplate.difficulty}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">{initialTemplate.industry}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">{initialTemplate.targetMarket}</span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">
              Used {initialTemplate.usageCount} times
            </span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:justify-end">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/templates")}
            disabled={isDeleting}
            className="md:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 md:order-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Template"
            )}
          </Button>
        </div>
      </div>
    </>
  );
} 