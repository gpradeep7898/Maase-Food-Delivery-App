import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function sendOtp(phone: string) {
    return supabase.auth.signInWithOtp({ phone: `+91${phone}` });
  }

  async function verifyOtp(phone: string, token: string) {
    return supabase.auth.verifyOtp({ phone: `+91${phone}`, token, type: 'sms' });
  }

  async function signOut() {
    return supabase.auth.signOut();
  }

  return { user, session, loading, sendOtp, verifyOtp, signOut };
}
