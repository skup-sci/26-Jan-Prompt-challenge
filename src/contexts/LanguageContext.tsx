/**
 * Language Context - Manages language selection across all pages
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') as LanguageCode;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Try to get from user profile
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        if (profile.language) {
          setCurrentLanguage(profile.language as LanguageCode);
        }
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    
    // Also update user profile if it exists
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const profile = JSON.parse(userProfile);
      profile.language = lang;
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
