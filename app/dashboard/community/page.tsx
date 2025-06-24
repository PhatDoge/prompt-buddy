"use client";

import { CommunityPromptCard } from "@/components/CommunityPromptCard"; // Updated import
import { useLanguage } from "@/context/LanguageContext";
// import { Button } from "@/components/ui/button"; // Replaced with basic HTML button below
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Replaced
// import { Skeleton } from "@/components/ui/skeleton"; // Replaced
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import {
  ArrowDownUp,
  ListFilter,
  MessageSquareText,
  Search,
  Users,
} from "lucide-react";
import { ChangeEvent, useState } from "react";

// Basic Button component (if not already in PromptCard or a shared util)
const Button = ({
  onClick,
  children,
  variant = "default",
  size = "default",
  "aria-label": ariaLabel,
  disabled,
}: any) => {
  const baseStyle =
    "font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150";
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  };
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    ghost: "hover:bg-gray-100 focus:ring-gray-300 text-gray-700",
    outline:
      "border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 text-gray-700",
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

// Basic Select component
const Select = ({
  value,
  onValueChange,
  children,
  id,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  id?: string;
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        onValueChange(e.target.value)
      }
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
    >
      {children}
    </select>
  );
};

// Fixed SelectItem - removed the span wrapper
const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return <option value={value}>{children}</option>;
};

// Basic Skeleton component
const SkeletonCard = () => (
  <div className="flex flex-col space-y-3 p-4 bg-white shadow rounded-lg border border-gray-200 animate-pulse">
    <div className="h-24 bg-gray-300 rounded w-full"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

// Define a set of categories - this could also come from backend or a config file
const PROMPT_CATEGORIES = [
  "all",
  "technology",
  "marketing",
  "creative writing",
  "education",
  "business",
  "lifestyle",
  "other",
];

export default function CommunityPage() {
  const { translate } = useLanguage(); // Added
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"popularity" | "latest" | "rating">(
    "latest"
  );

  const {
    results: prompts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.prompts.getCommunityPrompts,
    { category: selectedCategory, sortBy },
    { initialNumItems: 9 }
  );

  const isLoading = status === "loadingFirstPage";
  const isLoadingMore = status === "loadingMore";

  const categoryDisplay = (categoryValue: string) => {
    if (categoryValue === "all") return translate("categoryAll");
    if (categoryValue === "creative writing")
      return translate("categoryCreativeWriting");
    // Simple capitalize for others if no specific translation key exists, or map them all
    return (
      translate(
        `category${categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1).replace(/\s+/g, "")}` as any
      ) || categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1)
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-full shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          {translate("communityPromptsTitle")}
        </h1>
        <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
          {translate("communityPromptsSubtitle")}
        </p>
      </header>

      {/* Filters and Sorting */}
      <div className="mb-8 p-4 bg-white shadow rounded-lg border border-gray-200/90">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label
              htmlFor="category-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <ListFilter className="inline-block w-4 h-4 mr-1" />
              {translate("filterByCategoryLabel")}
            </label>
            <Select
              id="category-select"
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              {PROMPT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {categoryDisplay(category)}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label
              htmlFor="sort-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              <ArrowDownUp className="inline-block w-4 h-4 mr-1" />
              {translate("sortByLabel")}
            </label>
            <Select
              id="sort-select"
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as "popularity" | "latest" | "rating")
              }
            >
              <SelectItem value="latest">
                {translate("sortOptLatest")}
              </SelectItem>
              <SelectItem value="popularity">
                {translate("sortOptPopularity")}
              </SelectItem>
              <SelectItem value="rating">
                {translate("sortOptRating")}
              </SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {!isLoading && prompts.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            {translate("noPromptsFoundTitle")}
          </h3>
          <p className="text-gray-500 mt-1">
            {translate("noPromptsFoundSubtitle")}
          </p>
        </div>
      )}

      {!isLoading && prompts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <CommunityPromptCard key={prompt._id} prompt={prompt} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {status === "canLoadMore" && (
        <div className="mt-10 text-center">
          <Button onClick={() => loadMore(6)} disabled={isLoadingMore}>
            {isLoadingMore ?
              translate("loadingButtonText")
            : translate("loadMoreButtonText")}
          </Button>
        </div>
      )}

      {/* Call to Action for Sharing */}
      <div className="mt-16 py-10 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg text-center p-8 shadow">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white rounded-full shadow-md">
          <MessageSquareText className="w-6 h-6 text-teal-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {translate("ctaShareTitle")}
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {translate("ctaShareSubtitle")}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          {translate("ctaShareFootnote")}
        </p>
      </div>
    </div>
  );
}
