// @ts-ignore
import i18n from 'i18next';
// @ts-ignore
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
