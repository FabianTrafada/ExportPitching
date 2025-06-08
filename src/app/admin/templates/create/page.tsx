"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { createTemplate } from "@/actions/admin.actions";
import ImageUploader from "@/components/ImageUploader";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Template form state
  const [template, setTemplate] = useState({
    title: "",
    description: "",
    questions: "",
    difficulty: "",
    duration: "",
    industry: "",
    targetMarket: "",
    targetMarketCode: "",
    imageUrl: "",
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setTemplate(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((url: string) => {
    setTemplate(prev => ({
      ...prev,
      imageUrl: url,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Smart question parsing - supports both formats
      let formattedQuestions: string[] = [];
      
      const questionsText = template.questions.trim();
      
      // Check if it looks like comma-separated quoted format
      if (questionsText.includes('",') && (questionsText.startsWith('"') || questionsText.startsWith('['))) {
        try {
          // Try to parse as JSON array first
          if (questionsText.startsWith('[')) {
            formattedQuestions = JSON.parse(questionsText);
          } else {
            // Handle comma-separated quoted strings
            const cleanedText = questionsText
              .replace(/^["'\s]+|["'\s]+$/g, '') // Remove leading/trailing quotes and spaces
              .replace(/",\s*"/g, '"|"') // Replace "," with "|"
              .replace(/'\s*,\s*'/g, "|") // Handle single quotes too
              .replace(/,\s*"/g, '|"') // Handle cases without leading quote
              .replace(/"\s*,/g, '"|'); // Handle cases without trailing quote
            
            formattedQuestions = cleanedText
              .split('|')
              .map(q => q.replace(/^["'\s]+|["'\s]+$/g, '').trim())
              .filter(q => q.length > 0);
          }
        } catch (parseError) {
          console.warn('Failed to parse as comma-separated format, falling back to line-separated:', parseError);
          // Fallback to line-separated parsing
          formattedQuestions = questionsText
            .split("\n")
            .filter(q => q.trim() !== "")
            .map(q => q.trim());
        }
      } else {
        // Standard line-separated format
        formattedQuestions = questionsText
          .split("\n")
          .filter(q => q.trim() !== "")
          .map(q => q.trim());
      }

      // Validate we have questions
      if (formattedQuestions.length === 0) {
        setError("Please enter at least one question");
        return;
      }

      const response = await createTemplate({
        ...template,
        questions: JSON.stringify(formattedQuestions),
        duration: parseInt(template.duration),
      });

      if (response.success) {
        router.push("/admin/templates");
      } else {
        setError(response.error || "Failed to create template");
      }
    } catch (err) {
      setError("An error occurred while creating the template");
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
        <h1 className="text-3xl font-bold">Create New Template</h1>
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
                  <Label htmlFor="questions" className="mb-2">Questions*</Label>
                  <p className="text-xs text-gray-500 mb-2">
                    Supports multiple formats:
                    <br />• One question per line
                    <br />• Comma-separated quoted strings: &quot;Question 1&quot;, &quot;Question 2&quot;
                    <br />• JSON array: [&quot;Question 1&quot;, &quot;Question 2&quot;]
                  </p>
                  <Textarea
                    id="questions"
                    name="questions"
                    value={template.questions}
                    onChange={handleChange}
                    placeholder={`Enter questions in any of these formats:

Line format:
What makes your product unique?
How do you ensure quality?

Comma format:
"What makes your product unique?", "How do you ensure quality?"

JSON format:
["What makes your product unique?", "How do you ensure quality?"]`}
                    rows={8}
                    required
                  />
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
                  <ImageUploader 
                    value={template.imageUrl}
                    onChange={handleImageChange}
                  />
                  {!template.imageUrl && (
                    <p className="text-xs text-amber-600 mt-1">
                      Please upload an image for the template
                    </p>
                  )}
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
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
} 