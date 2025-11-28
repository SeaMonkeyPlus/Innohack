import { DEFAULT_LANGUAGE } from '@constants/languages';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Language } from '../types/language';

interface LanguageContextType {
  selectedLanguage: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  const setLanguage = (language: Language) => {
    setSelectedLanguage(language);
    console.log('Language changed to:', language);
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
