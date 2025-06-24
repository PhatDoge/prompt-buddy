"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/utils/translates";
import React from "react";

const LanguageToggleButton = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === "en" ? "es" : "en";
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: "10px 15px",
        cursor: "pointer",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "#f0f0f0",
      }}
    >
      {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    </button>
  );
};

export default LanguageToggleButton;
