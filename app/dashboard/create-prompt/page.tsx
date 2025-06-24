"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner"; // Assuming sonner is installed and configured
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs"; // Keep if you want a specific sign-in button here for some edge case
import { api } from "@/convex/_generated/api";
import { Wand2 } from "lucide-react";

interface FormData {
  title: string;
  goal: string;
  context: string;
  audience: string;
  tone: string;
  format: string;
  constraints: string;
  examples: string;
  additionalInfo: string;
  complexity: string;
  industry: string;
  category: string;
}

const initialFormData: FormData = {
  title: "",
  goal: "",
  context: "",
  audience: "",
  tone: "",
  format: "",
  constraints: "",
  examples: "",
  additionalInfo: "",
  complexity: "",
  industry: "",
  category: "",
};

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Authoritative",
  "Creative",
  "Technical",
  "Conversational",
  "Formal",
  "Enthusiastic",
  "Neutral",
];

const complexityOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

const categoryOptions = [
  "Content Creation",
  "Code Generation",
  "Analysis",
  "Creative Writing",
  "Business",
  "Education",
  "Marketing",
  "Research",
  "Problem Solving",
  "Other",
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "E-commerce",
  "Entertainment",
  "Legal",
  "Real Estate",
  "General",
];

export default function CreatePromptPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const { isSignedIn, isLoaded } = useAuth();
  const generatePromptAction = useAction(api.prompts.generatePrompt);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to generate prompts.");
      // Optionally, trigger a sign-in flow or redirect
      return;
    }

    if (!formData.title.trim() || !formData.goal.trim()) {
      toast.error("Please fill in at least the Title and Primary Goal fields.");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = await generatePromptAction(formData);
      setGeneratedPrompt(prompt);
      toast.success("Prompt generated successfully!");
      // Consider if navigation or other state change should occur here
    } catch (error) {
      toast.error("Failed to generate prompt. Please try again.");
      console.error("Prompt generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setGeneratedPrompt("");
  };

  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard.");
      console.error("Clipboard copy error:", error);
    }
  };

  const totalSteps = 3; // Define the number of steps in your form

  // Handle loading state for authentication
  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4 p-6 bg-white rounded-lg shadow-xl">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <Wand2 className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600 animate-pulse">Loading Creator Studio...</p>
      </div>
    );
  }

  // Handle not signed in state (though ideally middleware redirects, this is a fallback)
  if (!isSignedIn) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be signed in to create new prompts.
        </p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg">
            Sign In
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!generatedPrompt ?
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200/80">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Create a New AI Prompt
            </h1>
            <p className="text-lg text-gray-500">
              Follow the steps below to craft your perfect prompt.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-blue-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          {currentStep === 1 && (
            <section className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-6">
                1. Basic Information
              </h2>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prompt Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="e.g., Creative Story Idea Generator"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="goal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Primary Goal/Objective <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="goal"
                  value={formData.goal}
                  onChange={(e) => updateFormData("goal", e.target.value)}
                  placeholder="Describe the main task or outcome for the AI."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="context"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Context & Background
                </label>
                <textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => updateFormData("context", e.target.value)}
                  placeholder="Provide relevant background or situational details."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Industry/Domain
                  </label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => updateFormData("industry", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-6">
                2. Output Specifications
              </h2>
              <div>
                <label
                  htmlFor="audience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Audience
                </label>
                <input
                  id="audience"
                  type="text"
                  value={formData.audience}
                  onChange={(e) => updateFormData("audience", e.target.value)}
                  placeholder="e.g., Developers, Marketers, Students"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="tone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Desired Tone
                  </label>
                  <select
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => updateFormData("tone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select Tone</option>
                    {toneOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="complexity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Complexity Level
                  </label>
                  <select
                    id="complexity"
                    value={formData.complexity}
                    onChange={(e) =>
                      updateFormData("complexity", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value="">Select Complexity</option>
                    {complexityOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="format"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Required Output Format
                </label>
                <textarea
                  id="format"
                  value={formData.format}
                  onChange={(e) => updateFormData("format", e.target.value)}
                  placeholder="e.g., JSON, Markdown, Bullet points"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="constraints"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Constraints & Limitations
                </label>
                <textarea
                  id="constraints"
                  value={formData.constraints}
                  onChange={(e) =>
                    updateFormData("constraints", e.target.value)
                  }
                  placeholder="e.g., Max 500 words, Avoid technical jargon"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-semibold text-gray-700 border-b pb-3 mb-6">
                3. Examples & Additional Details
              </h2>
              <div>
                <label
                  htmlFor="examples"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reference Examples
                </label>
                <textarea
                  id="examples"
                  value={formData.examples}
                  onChange={(e) => updateFormData("examples", e.target.value)}
                  placeholder="Provide good examples or sample inputs/outputs."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Information
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    updateFormData("additionalInfo", e.target.value)
                  }
                  placeholder="Any other important details or special instructions."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                />
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Previous
            </button>
            <div className="flex items-center gap-4">
              {currentStep < totalSteps ?
                <button
                  onClick={() =>
                    setCurrentStep(Math.min(totalSteps, currentStep + 1))
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Next Step
                </button>
              : <button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    !formData.title.trim() ||
                    !formData.goal.trim()
                  }
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {isGenerating ?
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Generating...
                    </>
                  : "✨ Generate Prompt"}
                </button>
              }
            </div>
          </div>
        </div>
      : /* Generated Prompt Display */
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200/80 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-1">
                Your Prompt is Ready!
              </h2>
              <p className="text-gray-600">
                Review your generated AI prompt below.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                Copy
              </button>
              <button
                onClick={resetForm}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg font-medium"
              >
                Create New
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 shadow-inner">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed selection:bg-blue-100">
              {generatedPrompt}
            </pre>
          </div>

          <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">
              💡 Usage Tips & Next Steps:
            </h3>
            <ul className="text-sm text-indigo-700 space-y-2 list-disc list-inside">
              <li>
                Paste this prompt into your preferred AI tool (e.g., ChatGPT,
                Claude).
              </li>
              <li>
                Experiment with the prompt and iterate if needed for optimal
                results.
              </li>
              <li>
                Consider saving this prompt to your favorites if you plan to
                reuse it.
              </li>
              <li>
                Share your successful prompts with the community (once
                available!).
              </li>
            </ul>
          </div>
        </div>
      }
    </div>
  );
}
