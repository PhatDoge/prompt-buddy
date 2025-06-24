"use client";
import { SignInForm } from "@/components/SignInForm";
import { useUser } from "@clerk/nextjs";
import {
  BotMessageSquare,
  Brain,
  Rocket,
  Sparkles,
  Stars,
  User,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  APP_CONFIG,
  UI_TEXT,
  FEATURES,
  STYLES,
  LAYOUT,
  ROUTES,
} from "../constants"; // Adjust path as needed

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Zap,
  Brain,
  Rocket,
};

// Landing page component for signed-out users
function LandingPage() {
  return (
    <div
      className={`min-h-screen flex flex-col ${STYLES.gradients.background}`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <header
        className={`sticky top-0 z-20 ${STYLES.backdrop.header} border-b border-gray-200/50 ${STYLES.shadows.sm}`}
      >
        <div
          className={`${LAYOUT.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${LAYOUT.headerHeight} flex justify-between items-center`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`relative ${LAYOUT.logoSize} ${STYLES.gradients.logoBackground} rounded-xl flex items-center justify-center ${STYLES.shadows.lg}`}
            >
              <BotMessageSquare
                className={`${LAYOUT.iconSizes.medium} text-white`}
              />
            </div>
            <div>
              <h2
                className={`text-xl font-bold ${STYLES.gradients.titleGradient}`}
              >
                {APP_CONFIG.name}
              </h2>
              <p className="text-xs text-gray-500 -mt-1">
                {APP_CONFIG.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/80 px-4 py-2 rounded-lg shadow-inner">
            <User className={`${LAYOUT.iconSizes.small} text-gray-500`} />
            {UI_TEXT.header.signInPrompt}
          </div>
        </div>
      </header>

      <main className="relative flex-1 flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div
                className={`${LAYOUT.heroIconSize} ${STYLES.gradients.iconBackground} rounded-3xl flex items-center justify-center ${STYLES.shadows["2xl"]} transform rotate-12 transition-all hover:rotate-0 hover:scale-105 duration-300`}
              >
                <Sparkles className={`${LAYOUT.iconSizes.hero} text-white`} />
              </div>
              <div
                className={`absolute -top-3 -right-3 ${LAYOUT.badgeSize} bg-yellow-400 rounded-full flex items-center justify-center ${STYLES.shadows.lg} ${STYLES.animations.bounce}`}
              >
                <Stars
                  className={`${LAYOUT.iconSizes.small} text-yellow-900`}
                />
              </div>
            </div>
          </div>

          <h1
            className={`text-5xl md:text-6xl font-extrabold ${STYLES.gradients.heroTitleGradient} mb-8 leading-tight`}
          >
            {UI_TEXT.hero.title}
            <span className="block text-3xl md:text-4xl text-gray-600 mt-2">
              {UI_TEXT.hero.subtitle}
            </span>
          </h1>

          <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
            {UI_TEXT.hero.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            {FEATURES.map((feature) => {
              const IconComponent = ICON_MAP[feature.icon];
              return (
                <div
                  key={feature.title}
                  className={`${STYLES.backdrop.card} rounded-xl p-6 ${STYLES.shadows.lg} border border-gray-200/60 hover:${STYLES.shadows.xl} transition-shadow duration-300 hover:border-${feature.color}-300`}
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-lg flex items-center justify-center mb-4 shadow-inner`}
                  >
                    <IconComponent
                      className={`${LAYOUT.iconSizes.large} text-${feature.color}-600`}
                    />
                  </div>
                  <h3
                    className={`font-semibold text-gray-900 mb-2 text-lg text-${feature.color}-700`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          <div
            className={`${STYLES.backdrop.signInCard} rounded-2xl ${STYLES.shadows["2xl"]} border border-gray-200/50 p-8 md:p-10 max-w-md mx-auto`}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {UI_TEXT.signIn.title}
            </h3>
            <SignInForm />
          </div>

          <p className="mt-12 text-sm text-gray-500">{UI_TEXT.signIn.footer}</p>
        </div>
      </main>
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-600">{UI_TEXT.footer.copyright}</p>
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
      router.replace(ROUTES.dashboard);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${STYLES.gradients.background}`}
      >
        <div className="relative">
          <div
            className={`${STYLES.animations.spin} rounded-full ${LAYOUT.spinnerSize} border-4 border-blue-200 border-t-blue-600`}
          ></div>
          <BotMessageSquare
            className={`absolute inset-0 m-auto ${LAYOUT.iconSizes.xlarge} text-blue-600 ${STYLES.animations.pulse}`}
          />
        </div>
        <p className={`text-gray-700 mt-4 text-lg ${STYLES.animations.pulse}`}>
          {UI_TEXT.loading.experience}
        </p>
      </div>
    );
  }

  // If signed in, router.replace will handle redirection.
  // We can show a minimal loading state or null while redirecting.
  if (isSignedIn) {
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center ${STYLES.gradients.background}`}
      >
        <div className="relative">
          <div
            className={`${STYLES.animations.spin} rounded-full ${LAYOUT.spinnerSize} border-4 border-blue-200 border-t-blue-600`}
          ></div>
          <BotMessageSquare
            className={`absolute inset-0 m-auto ${LAYOUT.iconSizes.xlarge} text-blue-600 ${STYLES.animations.pulse}`}
          />
        </div>
        <p className="text-gray-700 mt-4 text-lg">
          {UI_TEXT.loading.redirecting}
        </p>
      </div>
    );
  }

  // If not signed in and loaded, show the landing page.
  return <LandingPage />;
}
