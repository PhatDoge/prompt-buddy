import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function PromptHistory() {
  const prompts = useQuery(api.prompts.getUserPrompts) || [];
  const deletePrompt = useMutation(api.prompts.deletePrompt);
  const ratePrompt = useMutation(api.prompts.ratePrompt);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const handleDelete = async (promptId: Id<"prompts">) => {
    if (confirm("Are you sure you want to delete this prompt?")) {
      try {
        await deletePrompt({ promptId });
        toast.success("Prompt deleted successfully");
      } catch (error) {
        toast.error("Failed to delete prompt");
      }
    }
  };

  const handleRate = async (promptId: Id<"prompts">, rating: number) => {
    try {
      await ratePrompt({ promptId, rating });
      toast.success("Rating saved");
    } catch (error) {
      toast.error("Failed to save rating");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Prompt copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No prompts yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first AI prompt to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Prompts</h2>
        <span className="text-sm text-gray-500">
          {prompts.length} prompt{prompts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-6">
        {prompts.map((prompt) => (
          <div
            key={prompt._id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {prompt.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatDate(prompt._creationTime)}</span>
                    {prompt.category && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {prompt.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(prompt.generatedPrompt)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Copy prompt"
                  >
                    <svg
                      className="w-5 h-5"
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
                  </button>
                  <button
                    onClick={() => handleDelete(prompt._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete prompt"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Goal Preview */}
              <div className="mb-4">
                <p className="text-gray-700 line-clamp-2">
                  {prompt.userInput.goal}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Rate this prompt:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(prompt._id, star)}
                      className={`w-5 h-5 ${
                        (prompt.rating || 0) >= star ?
                          "text-yellow-400"
                        : "text-gray-300"
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Details */}
              <button
                onClick={() =>
                  setExpandedPrompt(
                    expandedPrompt === prompt._id ? null : prompt._id
                  )
                }
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                {expandedPrompt === prompt._id ?
                  "Hide Details"
                : "Show Details"}
                <svg
                  className={`w-4 h-4 transition-transform ${expandedPrompt === prompt._id ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Expanded Details */}
            {expandedPrompt === prompt._id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-6">
                  {/* User Input Summary */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Input Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {prompt.userInput.context && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Context:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {prompt.userInput.context}
                          </p>
                        </div>
                      )}
                      {prompt.userInput.audience && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Audience:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {prompt.userInput.audience}
                          </p>
                        </div>
                      )}
                      {prompt.userInput.tone && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Tone:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {prompt.userInput.tone}
                          </p>
                        </div>
                      )}
                      {prompt.userInput.format && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Format:
                          </span>
                          <p className="text-gray-600 mt-1">
                            {prompt.userInput.format}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Prompt */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Generated Prompt
                    </h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                        {prompt.generatedPrompt}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
