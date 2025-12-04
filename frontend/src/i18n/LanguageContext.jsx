import { createContext, useContext, useState, useEffect } from 'react';
import { translations, supportedLanguages } from './translations';

const LanguageContext = createContext();

// Détecte la langue du navigateur
const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // 'fr-FR' -> 'fr'
  
  // Vérifie si la langue est supportée
  if (supportedLanguages.some(lang => lang.code === langCode)) {
    return langCode;
  }
  
  return 'fr'; // Langue par défaut
};

// Récupère la langue sauvegardée ou détecte automatiquement
const getInitialLanguage = () => {
  const savedLang = localStorage.getItem('epitrello-language');
  if (savedLang && supportedLanguages.some(lang => lang.code === savedLang)) {
    return savedLang;
  }
  return detectBrowserLanguage();
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage);

  // Sauvegarder la langue quand elle change
  useEffect(() => {
    localStorage.setItem('epitrello-language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Fonction de traduction
  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || translations['fr']?.[key] || key;
    
    // Remplacer les paramètres {n}, {name}, etc.
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  // Changer la langue
  const changeLanguage = (langCode) => {
    if (supportedLanguages.some(lang => lang.code === langCode)) {
      setLanguage(langCode);
    }
  };

  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    supportedLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
