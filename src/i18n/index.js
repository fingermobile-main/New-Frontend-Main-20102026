// Internationalization (i18n) Implementation
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import zhTranslations from './locales/zh/translation.json';

// Create locales directory structure if it doesn't exist
// This would normally be done separately, but documenting here for completeness
// locales/
//   en/
//     translation.json
//   es/
//     translation.json
//   fr/
//     translation.json
//   zh/
//     translation.json

// Translation resources
const resources = {en: {
  translation: enTranslations
  },
es: {translation: esTranslations
  },
fr: {translation: frTranslations
  },
zh: {translation: zhTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
fallbackLng: 'en', // Default language,
debug: process.env.NODE_ENV === 'development',
interpolation: {escapeValue: false, // React already escapes by default
    },
detection: {order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage']
    },
    
    // Special options for right-to-left languages (if applicable),
rtl: false, // Will be set dynamically based on language
    
    // Key separator for nested translations,
keySeparator: '.',
    
    // Namespace options (if using namespaces),
ns: ['translation'],
defaultNS: 'translation'
  });

// Function to change language and update document direction
i18n.on('languageChanged', (lng) => {
  // Set the language attribute on the HTML element
  document.documentElement.lang = lng;
  
  // Determine if the language is RTL
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Example RTL languages
  const isRtl = rtlLanguages.includes(lng.split('-')[0]); // Get base language code
  
  // Update document direction
  document.dir = isRtl ? 'rtl' : 'ltr';
  
  // Update CSS classes for RTL support
  if (isRtl) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
});

export default i18n;