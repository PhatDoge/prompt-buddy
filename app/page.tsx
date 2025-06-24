"use client";
import { SignInForm } from "@/components/SignInForm";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Brain,
  Rocket,
  Sparkles,
  Stars,
  User,
  Zap,
  BotMessageSquare,
} from "lucide-react";

// Landing page component for signed-out users
function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BotMessageSquare className="w-5 h-5 text-white" />
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
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/80 px-4 py-2 rounded-lg shadow-inner">
            <User className="w-4 h-4 text-gray-500" />
            Sign in to access your dashboard
          </div>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 transition-all hover:rotate-0 hover:scale-105 duration-300">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Stars className="w-4 h-4 text-yellow-900" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent mb-8 leading-tight">
            Craft Perfect AI Prompts
            <span className="block text-3xl md:text-4xl text-gray-600 mt-2">
              Effortlessly.
            </span>
          </h1>

          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            Unlock the full potential of AI with our intuitive Prompt Studio.
            Generate precise, effective prompts for any application and turn
            your ideas into intelligent conversations.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate optimized prompts in seconds.",
                color: "blue",
              },
              {
                icon: Brain,
                title: "AI-Powered",
                desc: "Smart suggestions and improvements.",
                color: "indigo",
              },
              {
                icon: Rocket,
                title: "Production Ready",
                desc: "Built for scale and reliability.",
                color: "purple",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`bg-white/70 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-200/60 hover:shadow-xl transition-shadow duration-300 hover:border-${feature.color}-300`}
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-lg flex items-center justify-center mb-4 shadow-inner`}
                >
                  <feature.icon
                    className={`w-6 h-6 text-${feature.color}-600`}
                  />
                </div>
                <h3
                  className={`font-semibold text-gray-900 mb-2 text-lg text-${feature.color}-700`}
                >
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 p-8 md:p-10 max-w-md mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Get Started Now
            </h3>
            <SignInForm />
          </div>

          <p className="mt-12 text-sm text-gray-500">
            Already have an account? Signing in will redirect you to your
            dashboard.
          </p>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} AI Prompt Studio. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

// Main App component to handle routing logic
export default function App() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <BotMessageSquare className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-700 mt-4 text-lg animate-pulse">
          Loading Your Experience...
        </p>
      </div>
    );
  }

  // If signed in, router.replace will handle redirection.
  // We can show a minimal loading state or null while redirecting.
  if (isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <BotMessageSquare className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-700 mt-4 text-lg">
          Redirecting to your dashboard...
        </p>
      </div>
    );
  }

  // If not signed in and loaded, show the landing page.
  return <LandingPage />;
}
