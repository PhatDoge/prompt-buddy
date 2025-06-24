"use client";

import { Star, AlertTriangle } from "lucide-react";

export default function FavoritesPage() {
  return (
    <div className="bg-white shadow-xl rounded-xl p-8 md:p-12 border border-gray-200/90">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-full shadow-lg">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Favorite Prompts
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          This is where your saved favorite prompts will appear. This feature is
          currently under construction.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-md shadow-sm max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-6 w-6 text-yellow-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-yellow-800">
                Coming Soon!
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Were working hard to bring you a seamless way to manage and
                access your most used prompts. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            What to expect:
          </h2>
          <ul className="text-gray-600 space-y-2 list-disc list-inside inline-block text-left">
            <li>Easy access to your most valuable prompts.</li>
            <li>Ability to quickly reuse and adapt favorites.</li>
            <li>Organization and tagging features (planned).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
