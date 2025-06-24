"use client";

import { Users, MessageSquareText, AlertTriangle } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="bg-white shadow-xl rounded-xl p-8 md:p-12 border border-gray-200/90">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-gradient-to-tr from-teal-400 to-cyan-500 rounded-full shadow-lg">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Community Prompts
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          Discover and share amazing AI prompts with the community. This
          exciting feature is currently under development.
        </p>

        <div className="bg-sky-50 border-l-4 border-sky-400 p-6 rounded-md shadow-sm max-w-lg mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle
                className="h-6 w-6 text-sky-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4 text-left">
              <h3 className="text-lg font-semibold text-sky-800">
                Exciting Features on the Horizon!
              </h3>
              <p className="text-sm text-sky-700 mt-1">
                We're building a vibrant space for prompt engineers to connect,
                learn, and share. Get ready to explore a world of creativity!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center text-teal-600 mb-3">
              <MessageSquareText className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Share Your Genius</h2>
            </div>
            <p className="text-gray-600">
              Soon, you'll be able to publish your own successful prompts,
              contribute to the collective intelligence, and get recognized for
              your creativity.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center text-cyan-600 mb-3">
              <Users className="w-6 h-6 mr-2" />
              <h2 className="text-xl font-semibold">Discover & Learn</h2>
            </div>
            <p className="text-gray-600">
              Explore prompts shared by others, discover new techniques, and
              learn how to craft even more effective AI interactions. Filter by
              category, popularity, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
