"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Copy, Eye, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have a toast notification library

// Modal Component (Simplified)
const PromptDetailModal = ({
  prompt,
  onClose,
}: {
  prompt: any;
  onClose: () => void;
}) => {
  if (!prompt) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.generatedPrompt);
    toast.success("Prompt copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {prompt.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="space-y-3 mb-4">
          <p className="text-sm text-gray-500">Category: {prompt.category}</p>
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-gray-700 mb-1">User Input:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {Object.entries(prompt.userInput).map(([key, value]) => (
                <li key={key}>
                  <span className="font-semibold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>{" "}
                  {String(value)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="font-medium text-gray-700 mb-1">
              Generated Prompt:
            </h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {prompt.generatedPrompt}
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
          >
            <Copy size={16} className="mr-1" /> Copy Prompt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FavoritesPage() {
  const favoritePrompts = useQuery(api.favorites.getFavoritePrompts);
  const removeFavorite = useMutation(api.favorites.removeFavoritePrompt);
  const [selectedPrompt, setSelectedPrompt] = useState<any | null>(null);

  const handleRemoveFavorite = async (promptId: Id<"prompts">) => {
    try {
      await removeFavorite({ promptId });
      toast.success("Prompt removed from favorites!");
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      toast.error("Failed to remove favorite.");
    }
  };

  if (favoritePrompts === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-6 md:p-10 border border-gray-200/90">
      <div className="flex items-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full shadow-lg mr-6">
          <Star className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Favorite Prompts</h1>
          <p className="text-md text-gray-600">
            Your curated collection of most valuable prompts.
          </p>
        </div>
      </div>

      {favoritePrompts.length === 0 ?
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Favorites Yet
          </h2>
          <p className="text-gray-500">
            Start adding prompts to your favorites to see them here!
          </p>
        </div>
      : <div className="space-y-4">
          {favoritePrompts.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 mb-1">
                    {prompt.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Category: {prompt.category}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {prompt.generatedPrompt}
                  </p>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => setSelectedPrompt(prompt)}
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() =>
                      handleRemoveFavorite(prompt._id as Id<"prompts">)
                    }
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title="Remove from Favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {selectedPrompt && (
        <PromptDetailModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}
    </div>
  );
}
