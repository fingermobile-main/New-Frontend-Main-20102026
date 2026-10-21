// Firebase configuration for push notifications
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if config is present and we're in the browser
let app;
let messaging: any = null;

if (typeof window !== 'undefined' && firebaseConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase config is missing or not running in browser environment. Push notifications will be disabled.');
}

export { messaging, getToken, onMessage };
export default messaging;
