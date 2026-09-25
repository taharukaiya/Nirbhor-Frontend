/**
 * Internationalization Configuration
 * 
 * Architectural Intent:
 * Sets up `react-i18next` for managing localization across the application.
 * Persists user language preference in `localStorage` to ensure a consistent experience across sessions.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/translation.json';
import bnTranslations from './locales/bn/translation.json';

const savedLanguage = localStorage.getItem('appLanguage') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      bn: { translation: bnTranslations }
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
