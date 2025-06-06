"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { updateTemplate } from "@/actions/admin.actions";

interface TemplateType {
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
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export default function EditTemplateForm({ initialTemplate }: { initialTemplate: TemplateType | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Format questions array back to string for form
  const formatQuestions = (data: TemplateType | null) => {
    if (!data) return "";
    
    const questions = data.questions;
    return Array.isArray(questions) 
      ? questions.join('\n') 
      : typeof questions === 'string' && questions.startsWith('[') 
        ? JSON.parse(questions).join('\n')
        : questions;
  };

  // Template form state
  const [template, setTemplate] = useState<TemplateType>({
    id: initialTemplate?.id || 0,
    title: initialTemplate?.title || "",
    description: initialTemplate?.description || "",
    questions: formatQuestions(initialTemplate),
    difficulty: initialTemplate?.difficulty || "",
    duration: initialTemplate?.duration || 0,
    industry: initialTemplate?.industry || "",
    targetMarket: initialTemplate?.targetMarket || "",
    targetMarketCode: initialTemplate?.targetMarketCode || "",
    imageUrl: initialTemplate?.imageUrl || null,
    isActive: initialTemplate?.isActive ?? true,
    usageCount: initialTemplate?.usageCount || 0,
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate({
      ...template,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setTemplate({
      ...template,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setTemplate({
      ...template,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Format questions as JSON if they're provided as comma-separated or line-separated text
      const formattedQuestions = template.questions
        .split("\n")
        .filter(q => q.trim() !== "")
        .map(q => q.trim());

      const response = await updateTemplate({
        ...template,
        questions: JSON.stringify(formattedQuestions),
        duration: typeof template.duration === 'string' ? parseInt(String(template.duration)) : template.duration,
      });

      if (response.success) {
        router.push("/admin/templates");
      } else {
        setError(response.error || "Failed to update template");
      }
    } catch (err) {
      setError("An error occurred while updating the template");
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
        <h1 className="text-3xl font-bold">Edit Template</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-2">Template Title*</Label>
                  <Input
                    id="title"
                    name="title"
                    value={template.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="mb-2">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={template.description}
                    onChange={handleChange}
                    placeholder="Describe what this template is about"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="questions" className="mb-2">Questions (one per line)*</Label>
                  <Textarea
                    id="questions"
                    name="questions"
                    value={template.questions}
                    onChange={handleChange}
                    placeholder="Enter questions separated by line breaks"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="isActive" className="mb-2">Active Status</Label>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <Switch
                      id="isActive"
                      checked={template.isActive}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("isActive", checked)
                      }
                    />
                    <Label htmlFor="isActive" className="font-normal text-sm cursor-pointer">
                      {template.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="difficulty" className="mb-2">Difficulty Level*</Label>
                  <Select
                    name="difficulty"
                    value={template.difficulty}
                    onValueChange={(value) => handleSelectChange("difficulty", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration" className="mb-2">Duration (minutes)*</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={template.duration}
                    onChange={handleChange}
                    type="number"
                    placeholder="Enter duration in minutes"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="industry" className="mb-2">Industry*</Label>
                  <Input
                    id="industry"
                    name="industry"
                    value={template.industry}
                    onChange={handleChange}
                    placeholder="e.g. Textiles, Agriculture, Technology"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="targetMarket" className="mb-2">Target Market*</Label>
                  <Input
                    id="targetMarket"
                    name="targetMarket"
                    value={template.targetMarket}
                    onChange={handleChange}
                    placeholder="e.g. United States, European Union"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="targetMarketCode" className="mb-2">Target Market Code*</Label>
                  <p className="text-sm text-gray-500 mb-1">in ISO-3166 format</p>
                  <Input
                    id="targetMarketCode"
                    name="targetMarketCode"
                    value={template.targetMarketCode}
                    onChange={handleChange}
                    placeholder="e.g. US, EU"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="mb-2">Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={template.imageUrl || ""}
                    onChange={handleChange}
                    placeholder="URL to template image"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/templates")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Template"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 