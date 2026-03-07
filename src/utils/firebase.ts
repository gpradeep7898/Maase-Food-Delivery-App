import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ─── PASTE YOUR FIREBASE CONFIG HERE ─────────────────────────────────────────
// Go to console.firebase.google.com → your project → Project Settings → Your apps
// Click "Add app" → Web → copy the firebaseConfig object below
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};
// ─────────────────────────────────────────────────────────────────────────────

// Prevent duplicate initialization in hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export default app;
