// components/PromptCard.tsx
"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Heart } from "lucide-react";
import Image from "next/image";
// import { Button } from "./ui/button"; // Assuming you have a Button component
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"; // Assuming Card components from shadcn/ui
import { toast } from "sonner"; // Assuming you use sonner for toasts

// Basic Button component using HTML and Tailwind
const Button = ({
  onClick,
  children,
  variant = "default",
  size = "default",
  "aria-label": ariaLabel,
  disabled,
}: any) => {
  const baseStyle =
    "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    icon: "p-2",
  };
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "hover:bg-gray-100 focus:ring-gray-300",
    outline: "border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  };
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

interface PromptCardProps {
  prompt: {
    _id: Id<"prompts">;
    _creationTime: number;
    title: string;
    category: string;
    userInput: any; // Consider defining a more specific type for userInput
    generatedPrompt: string;
    author?: {
      firstName?: string | null;
      lastName?: string | null;
      imageUrl?: string | null;
    } | null;
    isFavorite?: boolean;
    favoriteId?: Id<"favoritePrompts"> | null;
    popularity?: number | null;
    // Add other fields from your prompt document as needed
  };
  showPublishButton?: boolean; // To show publish button for user's own prompts
  onPublish?: (promptId: Id<"prompts">) => void;
}

export function PromptCard({
  prompt,
  showPublishButton,
  onPublish,
}: PromptCardProps) {
  const addFavorite = useMutation(api.favorites.addFavoritePrompt);
  const removeFavorite = useMutation(api.favorites.removeFavoritePrompt);
  const publishPromptMutation = useMutation(api.prompts.publishPrompt);

  // const currentUserId = useQuery(api.users.getCurrentUserId);
  // currentUserId is not directly used for isAuthor check here,
  // showPublishButton prop should be determined by the parent component
  // based on whether the user is the author and if the prompt is not yet published.

  const handleFavoriteToggle = async () => {
    if (!prompt._id) return;
    try {
      if (prompt.isFavorite) {
        // To remove from favorites, we ideally need the favoriteEntryId if it's directly available
        // Or we can modify removeFavoritePrompt to take promptId and find the entry
        // For now, assuming removeFavoritePrompt can handle it with just promptId
        await removeFavorite({ promptId: prompt._id });
        toast.success("Removed from favorites");
      } else {
        await addFavorite({ promptId: prompt._id });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Favorite toggle error:", error);
    }
  };

  const handlePublish = async () => {
    if (onPublish) {
      onPublish(prompt._id);
    } else {
      try {
        await publishPromptMutation({ promptId: prompt._id });
        toast.success("Prompt published to community!");
        // Optionally, trigger a refetch or update UI state
      } catch (error) {
        toast.error("Failed to publish prompt.");
        console.error("Publish error:", error);
      }
    }
  };

  // A basic card structure using divs and Tailwind CSS
  return (
    <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 h-full">
      <div className="p-4">
        {" "}
        {/* Equivalent to CardHeader */}
        <div className="flex justify-between items-start">
          <h3
            className="text-lg font-semibold text-gray-800 truncate"
            title={prompt.title}
          >
            {prompt.title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteToggle}
            aria-label={
              prompt.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-5 h-5 ${prompt.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500 transition-colors"}`}
            />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Category: <span className="font-medium">{prompt.category}</span>
        </p>
        {prompt.author && (
          <div className="flex items-center space-x-2 mt-3">
            {prompt.author.imageUrl ?
              <Image
                src={prompt.author.imageUrl}
                alt={`${prompt.author.firstName || ""} ${prompt.author.lastName || ""}`}
                width={24}
                height={24}
                className="rounded-full"
              />
            : <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                {prompt.author.firstName?.charAt(0) || "?"}
              </div>
            }
            <span className="text-xs text-gray-600 truncate">
              {prompt.author.firstName || "Community"}{" "}
              {prompt.author.lastName || "User"}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        {" "}
        {/* Equivalent to CardContent */}
        <p className="text-sm text-gray-700 line-clamp-3 mb-2 flex-grow">
          <span className="font-semibold">Goal:</span>{" "}
          {prompt.userInput?.goal || "Not specified"}
        </p>
        <details className="text-sm mt-auto">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-700 hover:underline">
            View Full Prompt
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-xs text-gray-600">
              {prompt.generatedPrompt}
            </pre>
          </div>
        </details>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        {" "}
        {/* Equivalent to CardFooter */}
        <span title="Popularity score">
          Popularity: {prompt.popularity || 0}
        </span>
        <span title={new Date(prompt._creationTime).toLocaleString()}>
          {new Date(prompt._creationTime).toLocaleDateString()}
        </span>
        {showPublishButton && ( // Removed onPublish from condition, if showPublishButton is true, we assume it's for publishing
          <Button onClick={handlePublish} size="sm" variant="outline">
            Publish
          </Button>
        )}
      </div>
    </div>
  );
}
