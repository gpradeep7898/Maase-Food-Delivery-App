'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function sendMagicLink() {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="font-display text-2xl text-mocha mb-2">Check your email</h1>
          <p className="text-amber-700 text-sm">We sent a magic link to <strong>{email}</strong>.<br />Click it to sign in to your cook portal.</p>
          <button onClick={() => setSent(false)} className="mt-6 text-sm text-amber-600 underline">
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍛</div>
          <h1 className="font-display text-3xl text-mocha">Maase Cook Portal</h1>
          <p className="text-sm text-amber-700 mt-1">Manage your home kitchen</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
          <label className="block text-sm font-medium text-mocha mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && email && sendMagicLink()}
            placeholder="you@example.com"
            className="w-full border border-amber-200 rounded-xl px-4 py-3 outline-none text-mocha mb-4"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            onClick={sendMagicLink}
            disabled={!email || loading}
            className="w-full py-3 bg-turmeric text-mocha font-semibold rounded-xl disabled:opacity-50 hover:bg-amber-400 transition"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
          <p className="text-center text-xs text-amber-600 mt-4">
            We'll email you a sign-in link — no password needed.
          </p>
        </div>
      </div>
    </div>
  );
}
