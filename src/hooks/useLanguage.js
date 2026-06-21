import { useState, useEffect } from 'react';

export const useLanguage = (initialLanguage = 'fi') => {
  const [language, setLanguage] = useState(initialLanguage);

 useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === 'fi') return 'sv';
      if (prev === 'sv') return 'en';
      if (prev === 'en') return 'ru';
      return 'fi';
    });
  };

  return { language, setLanguage, toggleLanguage };
};