"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { translations, Language, TranslationKey } from "../utils/translates";

interface LanguageContextType {
  language: Language;
  translate: (key: TranslationKey) => string;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setCurrentLanguage] = useState<Language>("en");

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const translate = (key: TranslationKey): string => {
    return translations[language][key] || key.toString();
  };

  return (
    <LanguageContext.Provider value={{ language, translate, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
