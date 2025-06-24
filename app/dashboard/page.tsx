"use client";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import {
  BarChart3,
  Brain,
  CheckCircle,
  MessageSquare,
  PlusCircle,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const { translate } = useLanguage(); // Added

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

  const stats = [
    {
      nameKey: "statTotalPrompts" as const, // Use key for translation
      value: totalPrompts === undefined ? "..." : totalPrompts,
      icon: MessageSquare,
      color: "blue",
    },
    {
      nameKey: "statSuccessRate" as const, // Use key for translation
      value: successRate === undefined ? "..." : `${successRate}%`,
      icon: CheckCircle,
      color: "green",
    },
    {
      nameKey: "statPromptsThisMonth" as const, // Use key for translation
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
              {translate("dashboardWelcome")}{" "}
              <span className="text-blue-600">
                {user?.firstName ||
                  user?.emailAddresses[0]?.emailAddress?.split("@")[0]}
              </span>
              {translate("dashboardWelcomeExclamation")}
              <span className="text-indigo-600"> 👋</span>
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {translate("dashboardOverview")}
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
            key={stat.nameKey} // Use nameKey as key
            className={`bg-white shadow-lg rounded-xl p-6 border border-gray-200/80 hover:shadow-xl transition-shadow duration-300 flex items-start justify-between`}
          >
            <div>
              <p className={`text-sm font-medium text-gray-500 mb-1`}>
                {translate(stat.nameKey)}
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

      {/* Quick Actions or Tips (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {translate("quickActionsTitle")}
          </h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/create-prompt"
              className="flex items-center gap-2 w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors font-medium"
            >
              <PlusCircle className="w-5 h-5" />
              {translate("quickActionCreatePrompt")}
            </Link>
            <Link
              href="/dashboard/community"
              className="flex items-center gap-2 w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-medium"
            >
              <Users className="w-5 h-5" />
              {translate("quickActionExploreCommunity")}
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200/80">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {translate("proTipTitle")}
          </h3>
          <p className="text-gray-600">{translate("proTipDescription")}</p>
        </div>
      </div>
    </div>
  );
}
