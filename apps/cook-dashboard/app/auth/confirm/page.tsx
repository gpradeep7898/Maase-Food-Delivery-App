'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase';

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) { router.replace('/login?error=missing_code'); return; }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        router.replace('/login?error=auth_failed');
      } else {
        router.replace('/dashboard');
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-spin">🍛</div>
        <p className="text-mocha font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
