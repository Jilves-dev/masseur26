import { createContext, useContext } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage('fi');

  const t = (key) => {
    const dict = translations[language] ?? translations.fi;
    const val = dict[key] ?? translations.fi[key];
    return val ?? key;
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used inside LanguageProvider');
  return ctx;
};
