import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Works with both `expo start` (.env.local) and EAS builds (app.config.js extra)
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  'https://aaixsytygsjilgvebnfv.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhaXhzeXR5Z3NqaWxndmVibmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0OTg0ODQsImV4cCI6MjA4ODA3NDQ4NH0.eN96IMG4nzxTlh1QjVCMD_ZP8VRAbD8ea3AFeQPnb7A';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
