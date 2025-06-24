// App Constants
export const APP_CONFIG = {
  name: "AI Prompt Studio",
  tagline: "Powered by Intelligence",
  currentYear: new Date().getFullYear(),
};

// UI Text Constants
export const UI_TEXT = {
  header: {
    signInPrompt: "Sign in to access your dashboard",
  },
  hero: {
    title: "Craft Perfect AI Prompts",
    subtitle: "Effortlessly.",
    description:
      "Unlock the full potential of AI with our intuitive Prompt Studio. Generate precise, effective prompts for any application and turn your ideas into intelligent conversations.",
  },
  signIn: {
    title: "Get Started Now",
    footer:
      "Already have an account? Signing in will redirect you to your dashboard.",
  },
  loading: {
    experience: "Loading Your Experience...",
    redirecting: "Redirecting to your dashboard...",
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} AI Prompt Studio. All rights reserved.`,
  },
};

// Feature Cards Data
export const FEATURES = [
  {
    icon: "Zap",
    title: "Lightning Fast",
    desc: "Generate optimized prompts in seconds.",
    color: "blue",
  },
  {
    icon: "Brain",
    title: "AI-Powered",
    desc: "Smart suggestions and improvements.",
    color: "indigo",
  },
  {
    icon: "Rocket",
    title: "Production Ready",
    desc: "Built for scale and reliability.",
    color: "purple",
  },
];

// CSS Classes Constants
export const STYLES = {
  gradients: {
    background: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    logoBackground: "bg-gradient-to-r from-blue-600 to-indigo-600",
    titleGradient:
      "bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent",
    heroTitleGradient:
      "bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent",
    iconBackground:
      "bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600",
  },
  backdrop: {
    header: "bg-white/80 backdrop-blur-md",
    card: "bg-white/70 backdrop-blur-md",
    signInCard: "bg-white/80 backdrop-blur-md",
  },
  animations: {
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    spin: "animate-spin",
  },
  shadows: {
    sm: "shadow-sm",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  },
};

// Layout Constants
export const LAYOUT = {
  maxWidth: "max-w-7xl",
  headerHeight: "h-16",
  iconSizes: {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
    xlarge: "w-8 h-8",
    hero: "w-12 h-12",
  },
  logoSize: "w-10 h-10",
  heroIconSize: "w-24 h-24",
  badgeSize: "w-8 h-8",
  spinnerSize: "h-16 w-16",
};

// Routes
export const ROUTES = {
  dashboard: "/dashboard",
};
