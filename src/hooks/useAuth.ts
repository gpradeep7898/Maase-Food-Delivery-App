import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Profile, UserRole } from '../types';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data ?? null);
    } catch (e) {
      console.error('fetchProfile error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function sendOTP(phone: string) {
    const formatted = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) throw error;
  }

  async function verifyOTP(phone: string, token: string) {
    const formatted = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;
    const { error } = await supabase.auth.verifyOtp({
      phone: formatted,
      token,
      type: 'sms',
    });
    if (error) throw error;
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!session) return;
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);
    if (error) throw error;
    await fetchProfile(session.user.id);
  }

  async function setRole(role: UserRole) {
    await updateProfile({ role });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return {
    session,
    profile,
    loading,
    sendOTP,
    verifyOTP,
    updateProfile,
    setRole,
    signOut,
    refetchProfile: () => session ? fetchProfile(session.user.id) : Promise.resolve(),
  };
}
