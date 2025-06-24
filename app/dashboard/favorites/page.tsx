"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Star } from "lucide-react";
import { CommunityPromptCard } from "@/components/CommunityPromptCard";
import { useLanguage } from "@/context/LanguageContext";

// Skeleton Card for loading state (can be shared or defined locally if not already)
const SkeletonCard = () => (
  <div className="flex flex-col space-y-3 p-4 bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse h-[300px]">
    {" "}
    {/* Approximate height */}
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    <div className="flex-grow space-y-2 mt-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-auto"></div>
  </div>
);

export default function FavoritesPage() {
  const { translate } = useLanguage(); // Added
  const favoritePrompts = useQuery(api.favorites.getFavoritePrompts);

  if (favoritePrompts === undefined) {
    // Loading state using SkeletonCards
    return (
      <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 md:p-10 border border-gray-200/90 dark:border-gray-700/90">
        <div className="flex items-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full shadow-lg mr-6">
            <Star className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {translate("favoritesPageTitle")}
            </h1>
            <p className="text-md text-gray-600 dark:text-gray-400">
              {translate("favoritesPageSubtitle")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 md:p-10 border border-gray-200/90 dark:border-gray-700/90">
      <div className="flex items-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full shadow-lg mr-6">
          <Star className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {translate("favoritesPageTitle")}
          </h1>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {translate("favoritesPageSubtitle")}
          </p>
        </div>
      </div>

      {favoritePrompts.length === 0 ?
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            {translate("noFavoritesYetTitle")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {translate("noFavoritesYetSubtitle")}
          </p>
        </div>
      : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePrompts.map((prompt) => (
            <CommunityPromptCard key={prompt._id} prompt={prompt} />
          ))}
        </div>
      }
    </div>
  );
}
