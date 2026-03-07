import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ─── PASTE YOUR FIREBASE CONFIG HERE ─────────────────────────────────────────
// Go to console.firebase.google.com → your project → Project Settings → Your apps
// Click "Add app" → Web → copy the firebaseConfig object below
const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY            || 'AIzaSyB1O8hEoieaCcDgxbo3VJnYhHw2g59NZeU',
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN        || 'maase-41d82.firebaseapp.com',
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID         || 'maase-41d82',
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET     || 'maase-41d82.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '524815534595',
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID             || '1:524815534595:ios:bacc7e001a8f047fb8dc36',
};
// ─────────────────────────────────────────────────────────────────────────────

// Prevent duplicate initialization in hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
