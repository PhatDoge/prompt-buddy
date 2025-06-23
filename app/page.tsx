"use client";
import { SignInForm } from "@/components/SignInForm";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import {
  Brain,
  History,
  LogOut,
  Rocket,
  Sparkles,
  Stars,
  User,
  Wand2,
  Zap,
} from "lucide-react";
import { useState } from "react";
// Import the PromptGenerator and PromptHistory components
import { PromptGenerator } from "@/components/PromptGenerator";
import { PromptHistory } from "@/components/PromptHistory";
// import { PromptHistory } from "@/components/PromptHistory";

export default function App() {
  const [activeTab, setActiveTab] = useState<"generator" | "history">(
    "generator"
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="relative top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Prompt Studio
              </h2>
              <p className="text-xs text-gray-500 -mt-1">
                Powered by Intelligence
              </p>
            </div>
          </div>

          <SignedIn>
            <div className="flex items-center gap-4">
              <nav className="flex gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setActiveTab("generator")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "generator" ?
                      "bg-white text-blue-700 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Wand2 className="w-4 h-4" />
                  Generator
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === "history" ?
                      "bg-white text-blue-700 shadow-md transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </div>
                <SignOutButton>
                  <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
              <User className="w-4 h-4" />
              Sign in to get started
            </div>
          </SignedOut>
        </div>
      </header>

      <main className="relative flex-1">
        <Content activeTab={activeTab} />
      </main>
    </div>
  );
}

function Content({ activeTab }: { activeTab: "generator" | "history" }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <Brain className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600 animate-pulse">Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SignedOut>
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Stars className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Create Perfect
              <span className="block">AI Prompts</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Generate precise, robust prompts for your AI agents and
              applications.
              <br />
              <span className="text-blue-600 font-medium">
                Turn ideas into intelligent conversations.
              </span>
            </p>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Lightning Fast
                </h3>
                <p className="text-sm text-gray-600">
                  Generate optimized prompts in seconds
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-sm text-gray-600">
                  Smart suggestions and improvements
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Rocket className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Production Ready
                </h3>
                <p className="text-sm text-gray-600">
                  Built for scale and reliability
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-8">
            <SignInForm />
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Welcome back,{" "}
                <span className="text-blue-600">
                  {user?.firstName ||
                    user?.emailAddresses[0]?.emailAddress?.split("@")[0]}
                </span>
                ! 👋
              </h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                {activeTab === "generator" ?
                  <>
                    <Wand2 className="w-5 h-5 text-blue-500" />
                    Create a new AI prompt by filling out the form below
                  </>
                : <>
                    <History className="w-5 h-5 text-indigo-500" />
                    View and manage your previously generated prompts
                  </>
                }
              </p>
            </div>

            {/* Quick stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-200/50">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-500">Prompts Created</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-md border border-gray-200/50">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - UPDATED SECTION */}
        {activeTab === "generator" ?
          <PromptGenerator />
        : <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8">
            <PromptHistory />
          </div>
        }
      </SignedIn>
    </div>
  );
}
