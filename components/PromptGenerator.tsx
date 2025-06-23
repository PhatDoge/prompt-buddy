"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

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

export function PromptGenerator() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  const { isSignedIn, isLoaded } = useAuth();
  const generatePrompt = useAction(api.prompts.generatePrompt);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to generate prompts");
      return;
    }

    if (!formData.title.trim() || !formData.goal.trim()) {
      toast.error("Please fill in at least the title and goal fields");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = await generatePrompt(formData);
      setGeneratedPrompt(prompt);
      toast.success("Prompt generated successfully!");
    } catch (error) {
      toast.error("Failed to generate prompt. Please try again.");
      console.error(error);
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
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const totalSteps = 3;

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In Required
            </h2>
            <p className="text-gray-600">
              Please sign in to use the AI Prompt Generator
            </p>
          </div>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!generatedPrompt ?
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="e.g., Blog Post Writer, Code Reviewer, Marketing Copy Generator"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal/Objective *
                </label>
                <textarea
                  value={formData.goal}
                  onChange={(e) => updateFormData("goal", e.target.value)}
                  placeholder="Describe what you want the AI to accomplish. Be specific about the main task or outcome you're looking for."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context & Background
                </label>
                <textarea
                  value={formData.context}
                  onChange={(e) => updateFormData("context", e.target.value)}
                  placeholder="Provide relevant background information, situation details, or context that will help the AI understand the scenario better."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry/Domain
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateFormData("industry", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select an industry</option>
                    {industryOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Output Specifications */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Output Specifications
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.audience}
                  onChange={(e) => updateFormData("audience", e.target.value)}
                  placeholder="e.g., Software developers, Marketing professionals, General public, Students"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => updateFormData("tone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a tone</option>
                    {toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity Level
                  </label>
                  <select
                    value={formData.complexity}
                    onChange={(e) =>
                      updateFormData("complexity", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select complexity</option>
                    {complexityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Output Format
                </label>
                <textarea
                  value={formData.format}
                  onChange={(e) => updateFormData("format", e.target.value)}
                  placeholder="Specify the exact format you want (e.g., JSON structure, markdown, bullet points, step-by-step guide, code with comments, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Constraints & Limitations
                </label>
                <textarea
                  value={formData.constraints}
                  onChange={(e) =>
                    updateFormData("constraints", e.target.value)
                  }
                  placeholder="Any specific limitations, word count, style guidelines, things to avoid, or requirements to follow."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 3: Examples & Additional Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Examples & Additional Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Examples
                </label>
                <textarea
                  value={formData.examples}
                  onChange={(e) => updateFormData("examples", e.target.value)}
                  placeholder="Provide examples of good outputs, sample inputs/outputs, or reference materials that illustrate what you're looking for."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    updateFormData("additionalInfo", e.target.value)
                  }
                  placeholder="Any other important details, special requirements, edge cases to consider, or specific instructions that haven't been covered above."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < totalSteps ?
                <button
                  onClick={() =>
                    setCurrentStep(Math.min(totalSteps, currentStep + 1))
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              : <button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    !formData.title.trim() ||
                    !formData.goal.trim()
                  }
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isGenerating ?
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  : "Generate Prompt"}
                </button>
              }
            </div>
          </div>
        </div>
      : /* Generated Prompt Display */
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Generated Prompt
              </h2>
              <p className="text-gray-600">
                Your optimized AI prompt is ready to use!
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Create New
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Usage Tips:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Copy this prompt and paste it into your AI tool (ChatGPT,
                Claude, etc.)
              </li>
              <li>
                • Test the prompt with different inputs to ensure it works as
                expected
              </li>
              <li>
                • You can modify the prompt further based on your specific needs
              </li>
              <li>• Save this prompt to your history for future reference</li>
            </ul>
          </div>
        </div>
      }
    </div>
  );
}
