// This file will contain the translation logic.
// We will define dictionaries for Spanish and English text
// and functions to switch between languages.

export const translations = {
  en: {
    // App Config
    appConfigName: "AI Prompt Studio",
    appConfigTagline: "Powered by Intelligence",
    // Header
    headerSignInPrompt: "Sign in to access your dashboard",
    // Hero Section
    heroTitle: "Craft Perfect AI Prompts",
    heroSubtitle: "Effortlessly.",
    heroDescription:
      "Unlock the full potential of AI with our intuitive Prompt Studio. Generate precise, effective prompts for any application and turn your ideas into intelligent conversations.",
    // Features - Titles
    feature0Title: "Lightning Fast",
    feature1Title: "AI-Powered",
    feature2Title: "Production Ready",
    // Features - Descriptions
    feature0Desc: "Generate optimized prompts in seconds.",
    feature1Desc: "Smart suggestions and improvements.",
    feature2Desc: "Built for scale and reliability.",
    // Sign In Section
    signInTitle: "Get Started Now",
    signInFooter:
      "Already have an account? Signing in will redirect you to your dashboard.",
    // Loading Messages
    loadingExperience: "Loading Your Experience...",
    loadingRedirecting: "Redirecting to your dashboard...",
    // Footer
    footerCopyright: `© ${new Date().getFullYear()} AI Prompt Studio. All rights reserved.`,
    // Dashboard Page
    dashboardWelcome: "Welcome back,",
    dashboardWelcomeExclamation: "!",
    dashboardOverview: "Here's an overview of your AI Prompt Studio activity.",
    statTotalPrompts: "Total Prompts Created",
    statSuccessRate: "Success Rate",
    statPromptsThisMonth: "Prompts This Month",
    quickActionsTitle: "Quick Actions",
    quickActionCreatePrompt: "Create a New Prompt",
    quickActionExploreCommunity: "Explore Community Prompts",
    proTipTitle: "💡 Pro Tip",
    proTipDescription:
      "Use detailed context and clear examples in your prompts for the best AI responses. Experiment with different tones and formats! Remember to check your prompt history for inspiration.",
    // Community Page
    communityPromptsTitle: "Community Prompts",
    communityPromptsSubtitle:
      "Discover, share, and learn from a growing library of AI prompts crafted by the community.",
    filterByCategoryLabel: "Filter by Category",
    categoryAll: "All",
    categoryTechnology: "Technology",
    categoryMarketing: "Marketing",
    categoryCreativeWriting: "Creative Writing",
    categoryEducation: "Education",
    categoryBusiness: "Business",
    categoryLifestyle: "Lifestyle",
    categoryOther: "Other",
    sortByLabel: "Sort By",
    sortOptLatest: "Latest",
    sortOptPopularity: "Popularity",
    sortOptRating: "Rating",
    noPromptsFoundTitle: "No Prompts Found",
    noPromptsFoundSubtitle:
      "Try adjusting your filters or check back later as the community grows!",
    loadMoreButtonText: "Load More Prompts",
    loadingButtonText: "Loading...",
    ctaShareTitle: "Share Your Genius",
    ctaShareSubtitle:
      "Have a great prompt? Publish it from your dashboard to contribute to the community and help others learn.",
    ctaShareFootnote:
      "(Publishing functionality is typically managed from your list of created prompts)",
    // Create Prompt Page
    loadingCreatorStudio: "Loading Creator Studio...",
    accessDeniedTitle: "Access Denied",
    accessDeniedSubtitle: "You need to be signed in to create new prompts.",
    signInButtonText: "Sign In",
    createPromptPageTitle: "Create a New AI Prompt",
    createPromptPageSubtitle:
      "Follow the steps below to craft your perfect prompt.",
    progressBarStep: "Step {currentStep} of {totalSteps}",
    progressBarPercent: "{percent}% Complete",
    formStep1Title: "1. Basic Information",
    formStep2Title: "2. Output Specifications",
    formStep3Title: "3. Examples & Additional Details",
    labelPromptTitle: "Prompt Title",
    placeholderPromptTitle: "e.g., Creative Story Idea Generator",
    labelPrimaryGoal: "Primary Goal/Objective",
    placeholderPrimaryGoal: "Describe the main task or outcome for the AI.",
    labelContextBackground: "Context & Background",
    placeholderContextBackground:
      "Provide relevant background or situational details.",
    labelCategory: "Category",
    selectDefaultCategory: "Select Category",
    labelIndustryDomain: "Industry/Domain",
    selectDefaultIndustry: "Select Industry",
    labelTargetAudience: "Target Audience",
    placeholderTargetAudience: "e.g., Developers, Marketers, Students",
    labelDesiredTone: "Desired Tone",
    selectDefaultTone: "Select Tone",
    labelComplexityLevel: "Complexity Level",
    selectDefaultComplexity: "Select Complexity",
    labelOutputFormat: "Required Output Format",
    placeholderOutputFormat: "e.g., JSON, Markdown, Bullet points",
    labelConstraintsLimitations: "Constraints & Limitations",
    placeholderConstraintsLimitations:
      "e.g., Max 500 words, Avoid technical jargon",
    labelReferenceExamples: "Reference Examples",
    placeholderReferenceExamples:
      "Provide good examples or sample inputs/outputs.",
    labelAdditionalInfo: "Additional Information",
    placeholderAdditionalInfo:
      "Any other important details or special instructions.",
    buttonPrevious: "Previous",
    buttonNextStep: "Next Step",
    buttonGeneratePrompt: "✨ Generate Prompt",
    buttonGenerating: "Generating...",
    generatedPromptTitle: "Your Prompt is Ready!",
    generatedPromptSubtitle: "Review your generated AI prompt below.",
    buttonCopy: "Copy",
    buttonCreateNew: "Create New",
    usageTipsTitle: "💡 Usage Tips & Next Steps:",
    usageTip1:
      "Paste this prompt into your preferred AI tool (e.g., ChatGPT, Claude).",
    usageTip2:
      "Experiment with the prompt and iterate if needed for optimal results.",
    usageTip3:
      "Consider saving this prompt to your favorites if you plan to reuse it.",
    usageTip4:
      "Share your successful prompts with the community (once available!).",
    toastSignInToGenerate: "Please sign in to generate prompts.",
    toastFillRequiredFields:
      "Please fill in at least the Title and Primary Goal fields.",
    toastPromptGeneratedSuccess: "Prompt generated successfully!",
    toastPromptGeneratedError: "Failed to generate prompt. Please try again.",
    toastCopiedSuccess: "Prompt copied to clipboard!",
    toastCopiedError: "Failed to copy to clipboard.",
    // Tone Options
    toneOptProfessional: "Professional",
    toneOptCasual: "Casual",
    toneOptFriendly: "Friendly",
    toneOptAuthoritative: "Authoritative",
    toneOptCreative: "Creative",
    toneOptTechnical: "Technical",
    toneOptConversational: "Conversational",
    toneOptFormal: "Formal",
    toneOptEnthusiastic: "Enthusiastic",
    toneOptNeutral: "Neutral",
    // Complexity Options
    complexityOptBeginner: "Beginner",
    complexityOptIntermediate: "Intermediate",
    complexityOptAdvanced: "Advanced",
    complexityOptExpert: "Expert",
    // Category Options (for create prompt form)
    categoryOptContentCreation: "Content Creation",
    categoryOptCodeGeneration: "Code Generation",
    categoryOptAnalysis: "Analysis",
    categoryOptCreativeWriting: "Creative Writing", // Note: also in community, ensure consistency or differentiate if needed
    categoryOptBusiness: "Business", // Note: also in community
    categoryOptEducation: "Education", // Note: also in community
    categoryOptMarketing: "Marketing", // Note: also in community
    categoryOptResearch: "Research",
    categoryOptProblemSolving: "Problem Solving",
    categoryOptOther: "Other", // Note: also in community
    // Industry Options
    industryOptTechnology: "Technology",
    industryOptHealthcare: "Healthcare",
    industryOptFinance: "Finance",
    // industryOptEducation: "Education", // Already covered by categoryOptEducation if used generally
    // industryOptMarketing: "Marketing", // Already covered by categoryOptMarketing
    industryOptEcommerce: "E-commerce",
    industryOptEntertainment: "Entertainment",
    industryOptLegal: "Legal",
    industryOptRealEstate: "Real Estate",
    industryOptGeneral: "General",
    // Favorites Page
    favoritesPageTitle: "Favorite Prompts",
    favoritesPageSubtitle: "Your curated collection of most valuable prompts.",
    noFavoritesYetTitle: "No Favorites Yet",
    noFavoritesYetSubtitle:
      "Start adding prompts to your favorites to see them here!",
    // History Page
    promptHistoryTitle: "Prompt History",
    // Sidebar & General Dashboard
    dashboardHome: "Dashboard Home",
    community: "Community",
    createPrompt: "Create Prompt",
    favorites: "Favorites",
    history: "History", // Already present, good.
    // Generic
    greeting: "Hello",
  },
  es: {
    // App Config
    appConfigName: "Estudio de Prompts IA",
    appConfigTagline: "Potenciado por Inteligencia",
    // Header
    headerSignInPrompt: "Inicia sesión para acceder a tu panel",
    // Hero Section
    heroTitle: "Crea Prompts de IA Perfectos",
    heroSubtitle: "Sin Esfuerzo.",
    heroDescription:
      "Desbloquea todo el potencial de la IA con nuestro intuitivo Estudio de Prompts. Genera prompts precisos y efectivos para cualquier aplicación y convierte tus ideas en conversaciones inteligentes.",
    // Features - Titles
    feature0Title: "Ultra Rápido",
    feature1Title: "Potenciado por IA",
    feature2Title: "Listo para Producción",
    // Features - Descriptions
    feature0Desc: "Genera prompts optimizados en segundos.",
    feature1Desc: "Sugerencias y mejoras inteligentes.",
    feature2Desc: "Construido para escalar y ser confiable.",
    // Sign In Section
    signInTitle: "Comienza Ahora",
    signInFooter:
      "¿Ya tienes una cuenta? Iniciar sesión te redirigirá a tu panel.",
    // Loading Messages
    loadingExperience: "Cargando Tu Experiencia...",
    loadingRedirecting: "Redirigiendo a tu panel...",
    // Footer
    footerCopyright: `© ${new Date().getFullYear()} Estudio de Prompts IA. Todos los derechos reservados.`,
    // Dashboard Page
    dashboardWelcome: "Bienvenido de vuelta,",
    dashboardWelcomeExclamation: "!",
    dashboardOverview:
      "Aquí tienes un resumen de tu actividad en AI Prompt Studio.",
    statTotalPrompts: "Total de Prompts Creados",
    statSuccessRate: "Tasa de Éxito",
    statPromptsThisMonth: "Prompts Este Mes",
    quickActionsTitle: "Acciones Rápidas",
    quickActionCreatePrompt: "Crear Nuevo Prompt",
    quickActionExploreCommunity: "Explorar Prompts de la Comunidad",
    proTipTitle: "💡 Consejo Pro",
    proTipDescription:
      "Usa contexto detallado y ejemplos claros en tus prompts para obtener las mejores respuestas de IA. ¡Experimenta con diferentes tonos y formatos! Recuerda revisar tu historial de prompts para inspirarte.",
    // Community Page
    communityPromptsTitle: "Prompts de la Comunidad",
    communityPromptsSubtitle:
      "Descubre, comparte y aprende de una creciente biblioteca de prompts de IA creados por la comunidad.",
    filterByCategoryLabel: "Filtrar por Categoría",
    categoryAll: "Todos",
    categoryTechnology: "Tecnología",
    categoryMarketing: "Marketing",
    categoryCreativeWriting: "Escritura Creativa",
    categoryEducation: "Educación",
    categoryBusiness: "Negocios",
    categoryLifestyle: "Estilo de Vida",
    categoryOther: "Otro",
    sortByLabel: "Ordenar Por",
    sortOptLatest: "Más Recientes",
    sortOptPopularity: "Popularidad",
    sortOptRating: "Valoración",
    noPromptsFoundTitle: "No se Encontraron Prompts",
    noPromptsFoundSubtitle:
      "¡Intenta ajustar tus filtros o vuelve más tarde a medida que la comunidad crece!",
    loadMoreButtonText: "Cargar Más Prompts",
    loadingButtonText: "Cargando...",
    ctaShareTitle: "Comparte Tu Genialidad",
    ctaShareSubtitle:
      "¿Tienes un gran prompt? Publícalo desde tu panel para contribuir a la comunidad y ayudar a otros a aprender.",
    ctaShareFootnote:
      "(La funcionalidad de publicación generalmente se gestiona desde tu lista de prompts creados)",
    // Create Prompt Page
    loadingCreatorStudio: "Cargando Estudio de Creación...",
    accessDeniedTitle: "Acceso Denegado",
    accessDeniedSubtitle: "Necesitas iniciar sesión para crear nuevos prompts.",
    signInButtonText: "Iniciar Sesión",
    createPromptPageTitle: "Crear Nuevo Prompt de IA",
    createPromptPageSubtitle:
      "Sigue los pasos a continuación para crear tu prompt perfecto.",
    progressBarStep: "Paso {currentStep} de {totalSteps}",
    progressBarPercent: "{percent}% Completado",
    formStep1Title: "1. Información Básica",
    formStep2Title: "2. Especificaciones de Salida",
    formStep3Title: "3. Ejemplos y Detalles Adicionales",
    labelPromptTitle: "Título del Prompt",
    placeholderPromptTitle: "Ej: Generador de Ideas para Historias Creativas",
    labelPrimaryGoal: "Objetivo Principal",
    placeholderPrimaryGoal:
      "Describe la tarea principal o el resultado para la IA.",
    labelContextBackground: "Contexto y Antecedentes",
    placeholderContextBackground:
      "Proporciona antecedentes relevantes o detalles situacionales.",
    labelCategory: "Categoría",
    selectDefaultCategory: "Seleccionar Categoría",
    labelIndustryDomain: "Industria/Dominio",
    selectDefaultIndustry: "Seleccionar Industria",
    labelTargetAudience: "Público Objetivo",
    placeholderTargetAudience: "Ej: Desarrolladores, Marketers, Estudiantes",
    labelDesiredTone: "Tono Deseado",
    selectDefaultTone: "Seleccionar Tono",
    labelComplexityLevel: "Nivel de Complejidad",
    selectDefaultComplexity: "Seleccionar Complejidad",
    labelOutputFormat: "Formato de Salida Requerido",
    placeholderOutputFormat: "Ej: JSON, Markdown, Viñetas",
    labelConstraintsLimitations: "Restricciones y Limitaciones",
    placeholderConstraintsLimitations:
      "Ej: Máx 500 palabras, Evitar jerga técnica",
    labelReferenceExamples: "Ejemplos de Referencia",
    placeholderReferenceExamples:
      "Proporciona buenos ejemplos o entradas/salidas de muestra.",
    labelAdditionalInfo: "Información Adicional",
    placeholderAdditionalInfo:
      "Cualquier otro detalle importante o instrucciones especiales.",
    buttonPrevious: "Anterior",
    buttonNextStep: "Siguiente Paso",
    buttonGeneratePrompt: "✨ Generar Prompt",
    buttonGenerating: "Generando...",
    generatedPromptTitle: "¡Tu Prompt está Listo!",
    generatedPromptSubtitle: "Revisa tu prompt de IA generado a continuación.",
    buttonCopy: "Copiar",
    buttonCreateNew: "Crear Nuevo",
    usageTipsTitle: "💡 Consejos de Uso y Próximos Pasos:",
    usageTip1:
      "Pega este prompt en tu herramienta de IA preferida (ej: ChatGPT, Claude).",
    usageTip2:
      "Experimenta con el prompt e itera si es necesario para resultados óptimos.",
    usageTip3:
      "Considera guardar este prompt en tus favoritos si planeas reutilizarlo.",
    usageTip4:
      "¡Comparte tus prompts exitosos con la comunidad (cuando esté disponible!).",
    toastSignInToGenerate: "Por favor, inicia sesión para generar prompts.",
    toastFillRequiredFields:
      "Por favor, completa al menos los campos de Título y Objetivo Principal.",
    toastPromptGeneratedSuccess: "¡Prompt generado exitosamente!",
    toastPromptGeneratedError:
      "Error al generar el prompt. Por favor, inténtalo de nuevo.",
    toastCopiedSuccess: "¡Prompt copiado al portapapeles!",
    toastCopiedError: "Error al copiar al portapapeles.",
    // Tone Options
    toneOptProfessional: "Profesional",
    toneOptCasual: "Casual",
    toneOptFriendly: "Amigable",
    toneOptAuthoritative: "Autoritario",
    toneOptCreative: "Creativo",
    toneOptTechnical: "Técnico",
    toneOptConversational: "Conversacional",
    toneOptFormal: "Formal",
    toneOptEnthusiastic: "Entusiasta",
    toneOptNeutral: "Neutral",
    // Complexity Options
    complexityOptBeginner: "Principiante",
    complexityOptIntermediate: "Intermedio",
    complexityOptAdvanced: "Avanzado",
    complexityOptExpert: "Experto",
    // Category Options
    categoryOptContentCreation: "Creación de Contenido",
    categoryOptCodeGeneration: "Generación de Código",
    categoryOptAnalysis: "Análisis",
    categoryOptResearch: "Investigación",
    categoryOptProblemSolving: "Resolución de Problemas",
    // Industry Options
    industryOptHealthcare: "Salud",
    industryOptFinance: "Finanzas",
    industryOptEcommerce: "Comercio Electrónico",
    industryOptEntertainment: "Entretenimiento",
    industryOptLegal: "Legal",
    industryOptRealEstate: "Bienes Raíces",
    industryOptGeneral: "General",
    // Favorites Page
    favoritesPageTitle: "Prompts Favoritos",
    favoritesPageSubtitle: "Tu colección curada de los prompts más valiosos.",
    noFavoritesYetTitle: "Aún no hay Favoritos",
    noFavoritesYetSubtitle:
      "¡Empieza a añadir prompts a tus favoritos para verlos aquí!",
    // History Page
    promptHistoryTitle: "Historial de Prompts",
    // Sidebar & General Dashboard
    dashboardHome: "Inicio del Panel",
    community: "Comunidad",
    createPrompt: "Crear Prompt",
    favorites: "Favoritos",
    history: "Historial", // Already present
    // Generic
    greeting: "Hola",
  },
};

export type Language = keyof typeof translations;
// Ensure TranslationKey covers all keys from both 'en' and 'es' or a base set.
// For simplicity, assuming 'en' contains all keys. If not, this needs adjustment.
export type TranslationKey = keyof typeof translations.en;

// Note: The global 'currentLanguage', 'setLanguage', 'getLanguage', and 'translate' functions
// were part of an earlier implementation. With LanguageContext, these are managed within the context.
// If you intend to use a global store alongside context or as a fallback, they can be kept.
// Otherwise, they might be redundant if all language logic is handled via useLanguage hook.
// For this implementation, we assume they are not strictly needed due to LanguageContext.
// However, removing them might be a breaking change if any part of the app still relies on them directly.
// Let's keep them for now but acknowledge that LanguageContext is the primary way to interact with translations.

let currentLanguage: Language = "en"; // Default language, potentially overridden by context

export const setLanguageGlobal = (language: Language) => {
  currentLanguage = language;
  // Potentially dispatch an event or update subscribers if used outside React context
};

export const getLanguageGlobal = (): Language => {
  return currentLanguage;
};

export const translateGlobal = (key: TranslationKey): string => {
  // This global translate function will use the 'currentLanguage' variable.
  // It's a fallback or alternative to the context-based translate.
  return translations[currentLanguage][key] || key.toString();
};
