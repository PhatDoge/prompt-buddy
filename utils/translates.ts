// This file will contain the translation logic.
// We will define dictionaries for Spanish and English text
// and functions to switch between languages.

export const translations = {
  en: {
    // Add English translations here
    greeting: "Hello",
    // Example dashboard translations
    dashboardHome: "Dashboard Home",
    community: "Community",
    createPrompt: "Create Prompt",
    favorites: "Favorites",
    history: "History",
    // Example main page translations
    mainPageTitle: "Welcome to the Main Page",
  },
  es: {
    // Add Spanish translations here
    greeting: "Hola",
    // Example dashboard translations
    dashboardHome: "Inicio del Panel",
    community: "Comunidad",
    createPrompt: "Crear Prompt",
    favorites: "Favoritos",
    history: "Historial",
    // Example main page translations
    mainPageTitle: "Bienvenido a la Página Principal",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en; // Assuming 'en' has all keys

let currentLanguage: Language = "en"; // Default language

export const setLanguage = (language: Language) => {
  currentLanguage = language;
};

export const getLanguage = (): Language => {
  return currentLanguage;
};

export const translate = (key: TranslationKey): string => {
  return translations[currentLanguage][key] || key.toString(); // Fallback to key if translation not found
};
