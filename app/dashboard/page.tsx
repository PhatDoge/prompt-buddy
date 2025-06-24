"use client";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
// import { PromptHistory } from "@/components/PromptHistory"; // No longer directly used here
import {
  BarChart3,
  Brain,
  CheckCircle,
  MessageSquare,
  PlusCircle,
  Users,
} from "lucide-react"; // Added PlusCircle, Users
import Link from "next/link"; // Added Link for Quick Actions

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();

  const totalPrompts = useQuery(
    api.prompts.getTotalPromptsCreated,
    {},
    { enabled: !!isSignedIn }
  );
  const successRate = useQuery(
    api.prompts.getPromptSuccessRate,
    {},
    { enabled: !!isSignedIn }
  );

  // A mock stat, replace with real data if available
  // const averageRating = useQuery(
  //   api.prompts.getAveragePromptRating, // Assuming this query exists or will be created
  //   {},
  //   { enabled: !!isSignedIn }
  // ) ?? 0;

  const stats = [
    {
      name: "Total Prompts Created",
      value: totalPrompts === undefined ? "..." : totalPrompts,
      icon: MessageSquare,
      color: "blue",
    },
    {
      name: "Success Rate",
      value: successRate === undefined ? "..." : `${successRate}%`,
      icon: CheckCircle,
      color: "green",
    },
    // {
    //   name: "Average Rating",
    //   value: averageRating === undefined ? "..." : `${averageRating.toFixed(1)}/5`,
    //   icon: Percent, // Using Percent as a placeholder, consider a Star icon
    //   color: "yellow",
    // },
    {
      name: "Prompts This Month",
      value: "...", // Placeholder
      icon: BarChart3,
      color: "indigo",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome back,{" "}
              <span className="text-blue-600">
                {user?.firstName ||
                  user?.emailAddresses[0]?.emailAddress?.split("@")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Heres an overview of your AI Prompt Studio activity.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`bg-white shadow-lg rounded-xl p-6 border border-gray-200/80 hover:shadow-xl transition-shadow duration-300 flex items-start justify-between`}
          >
            <div>
              <p className={`text-sm font-medium text-gray-500 mb-1`}>
                {stat.name}
              </p>
              <p className={`text-3xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </p>
            </div>
            <div
              className={`p-3 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-lg shadow-inner`}
            >
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        ))}
      </div>

      {/* Prompt History Section - REMOVED */}
      {/* <div className="bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-200/80">
        <PromptHistory />
      </div> */}

      {/* Quick Actions or Tips (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/create-prompt"
              className="flex items-center gap-2 w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              Create a New Prompt
            </Link>
            <Link
              href="/dashboard/community"
              className="flex items-center gap-2 w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              Explore Community Prompts
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            💡 Pro Tip
          </h3>
          <p className="text-gray-600">
            Use detailed context and clear examples in your prompts for the best
            AI responses. Experiment with different tones and formats! Remember
            to check your prompt history for inspiration.
          </p>
        </div>
      </div>
    </div>
  );
}
