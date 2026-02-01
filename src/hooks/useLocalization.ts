/**
 * useLocalization Hook
 * Provides easy access to localization functionality in React components
 */

import { useState, useEffect } from 'react';
import { localizationService } from '../services/LocalizationService';
import { LanguageCode } from '../services/TranslationService';

export const useLocalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(
    localizationService.getCurrentLanguage()
  );

  // Function to get translated text
  const t = (key: string, fallback?: string): string => {
    return localizationService.getText(key, fallback);
  };

  // Function to change language
  const changeLanguage = (language: LanguageCode) => {
    localizationService.setLanguage(language);
    setCurrentLanguage(language);
  };

  // Get available languages
  const availableLanguages = localizationService.getAvailableLanguages();

  // Get language name
  const getLanguageName = (code: LanguageCode): string => {
    return localizationService.getLanguageName(code);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    availableLanguages,
    getLanguageName,
  };
};

export default useLocalization;
