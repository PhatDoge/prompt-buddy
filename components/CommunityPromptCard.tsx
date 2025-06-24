// components/CommunityPromptCard.tsx
"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs"; // For getting current user details
import { useMutation, useQuery } from "convex/react";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  MessageCircle,
  SendHorizonal,
  Star,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

// Basic Button component (can be replaced with a UI library button if available)
const Button = ({
  onClick,
  children,
  variant = "default",
  size = "default",
  className = "",
  "aria-label": ariaLabel,
  disabled,
  type = "button",
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "icon" | "lg";
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  const baseStyle =
    "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center";
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-300",
    outline:
      "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

// Define a more specific type for the prompt object
// This should match the structure returned by getCommunityPrompts and getFavoritePrompts
type CommunityPrompt = {
  _id: Id<"prompts">;
  _creationTime: number;
  title: string;
  category: string;
  userInput: {
    // Define specific fields if known, e.g., goal
    goal: string;
    [key: string]: any; // Allow other fields
  };
  generatedPrompt: string;
  author?: {
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
  } | null;
  isFavorite?: boolean;
  favoriteId?: Id<"favoritePrompts"> | null;
  // New fields for community features
  averageRating?: number | null;
  totalRatings?: number | null;
  currentUserRating?: number | null; // The logged-in user's own rating for this prompt
  commentsCount?: number | null;
  isPublic?: boolean; // To ensure we only show public prompts
  // any other fields like popularity, userId (author's convex ID)
  userId: Id<"users">;
  popularity?: number | null;
};

interface CommunityPromptCardProps {
  prompt: CommunityPrompt;
  // We might need a way to trigger refetch for parent list after certain actions,
  // e.g. after adding a comment/rating if the list needs to re-sort.
  // For now, Convex queries should update automatically.
}

export function CommunityPromptCard({ prompt }: CommunityPromptCardProps) {
  const { user: clerkUser } = useUser(); // Get current Clerk user

  const addFavorite = useMutation(api.favorites.addFavoritePrompt);
  const removeFavorite = useMutation(api.favorites.removeFavoritePrompt);
  const addOrUpdateRating = useMutation(api.prompts.addOrUpdateRating);
  const addCommentMutation = useMutation(api.prompts.addComment);
  const deleteCommentMutation = useMutation(api.prompts.deleteComment);

  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch comments when showComments is true and prompt ID is available
  const comments = useQuery(
    api.prompts.getComments,
    showComments ? { promptId: prompt._id } : "skip"
  );

  const handleFavoriteToggle = async () => {
    if (!clerkUser) {
      toast.error("Please sign in to favorite prompts.");
      return;
    }
    try {
      if (prompt.isFavorite && prompt.favoriteId) {
        // removeFavorite in convex/favorites.ts expects promptId, not favoriteId directly
        // It finds the favorite entry using (userId, promptId)
        await removeFavorite({ promptId: prompt._id });
        toast.success("Removed from favorites");
      } else {
        const result = await addFavorite({ promptId: prompt._id });
        if (result.status === "added") {
          toast.success("Added to favorites!");
        } else if (result.status === "already_favorited") {
          toast.info("Already in favorites.");
        }
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update favorites");
      console.error("Favorite toggle error:", error);
    }
  };

  const handleRatePrompt = async (rating: number) => {
    if (!clerkUser) {
      toast.error("Please sign in to rate prompts.");
      return;
    }
    try {
      await addOrUpdateRating({ promptId: prompt._id, rating });
      toast.success(`Rated ${rating} stars!`);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to submit rating.");
      console.error("Rating error:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) {
      toast.error("Please sign in to comment.");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    setIsSubmittingComment(true);
    try {
      await addCommentMutation({ promptId: prompt._id, text: newComment });
      toast.success("Comment added!");
      setNewComment("");
      // Comments list will refetch due to Convex's reactivity
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add comment.");
      console.error("Add comment error:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: Id<"comments">) => {
    if (!clerkUser) {
      toast.error("Authentication error.");
      return;
    }
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteCommentMutation({ commentId });
      toast.success("Comment deleted.");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete comment.");
      console.error("Delete comment error:", error);
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

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-full">
      {/* Card Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-start">
          <h3
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate"
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
            disabled={!clerkUser} // Disable if not logged in
          >
            <Heart
              className={`w-5 h-5 ${prompt.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors"}`}
            />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Category:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {prompt.category}
          </span>
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
            : <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                {prompt.author.firstName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            }
            <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {prompt.author.firstName || "Community"}{" "}
              {prompt.author.lastName || "User"}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-2">
          <span className="font-semibold">Goal:</span>{" "}
          {prompt.userInput?.goal || "Not specified"}
        </p>
        <button
          onClick={() => setShowFullPrompt(!showFullPrompt)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {showFullPrompt ? "Hide Full Prompt" : "View Full Prompt"}
          {showFullPrompt ?
            <ChevronUp className="w-4 h-4" />
          : <ChevronDown className="w-4 h-4" />}
        </button>
        {showFullPrompt && (
          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-300">
              {prompt.generatedPrompt}
            </pre>
          </div>
        )}
      </div>

      {/* Engagement Section: Ratings & Comments Toggle */}
      <div className="px-4 pt-2 pb-2 border-t dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          {/* Average Rating Display */}
          <div
            className="flex items-center gap-1"
            title={`Average rating: ${prompt.averageRating || 0} out of 5`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${(prompt.averageRating || 0) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
              />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({prompt.totalRatings || 0} rating
              {prompt.totalRatings !== 1 ? "s" : ""})
            </span>
          </div>
          {/* Comments Count & Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            aria-label={
              showComments ? "Hide comments" : (
                `Show ${prompt.commentsCount || 0} comments`
              )
            }
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {prompt.commentsCount || 0} comment
              {prompt.commentsCount !== 1 ? "s" : ""}
            </span>
            {showComments ?
              <ChevronUp className="w-3 h-3" />
            : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* User's Own Rating Input */}
        <div className="flex items-center gap-2 mb-3 pt-1 border-t dark:border-gray-700/50 mt-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Your rating:
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatePrompt(star)}
                disabled={!clerkUser}
                title={`Rate ${star} stars`}
              >
                <Star
                  className={`w-5 h-5 cursor-pointer ${
                    (prompt.currentUserRating || 0) >= star ?
                      "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-500 hover:text-yellow-300"
                  } ${!clerkUser ? "cursor-not-allowed" : ""}`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comments Section (Collapsible) */}
      {showComments && (
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Comments
          </h4>
          {/* Add Comment Form */}
          {clerkUser && (
            <form
              onSubmit={handleAddComment}
              className="mb-4 flex items-start gap-2"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                rows={2}
                disabled={isSubmittingComment}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ?
                  "..."
                : <SendHorizonal className="w-4 h-4" />}
              </Button>
            </form>
          )}
          {!clerkUser && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Sign in to add a comment.
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments === undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading comments...
              </p>
            )}
            {comments && comments.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No comments yet.
              </p>
            )}
            {comments?.map((comment) => (
              <div
                key={comment._id}
                className="text-xs p-2 bg-white dark:bg-gray-700 rounded shadow-sm border dark:border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 mb-1">
                    {comment.author?.imageUrl ?
                      <Image
                        src={comment.author.imageUrl}
                        alt=""
                        width={16}
                        height={16}
                        className="rounded-full"
                      />
                    : <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center text-xxs">
                        {comment.author?.firstName?.charAt(0)?.toUpperCase() ||
                          "?"}
                      </div>
                    }
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {comment.author?.firstName || "User"}{" "}
                      {comment.author?.lastName || ""}
                    </span>
                  </div>
                  {clerkUser?.id === comment.author?.clerkId && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      title="Delete comment"
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {comment.text}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xxs mt-1">
                  {formatDate(comment._creationTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span title={`Popularity: ${prompt.popularity || 0}`}>
          Pop: {prompt.popularity || 0}
        </span>
        <span title={new Date(prompt._creationTime).toLocaleString()}>
          {new Date(prompt._creationTime).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
