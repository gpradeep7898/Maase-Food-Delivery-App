'use client';
import { useState } from 'react';
import { createClient } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function sendOtp() {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
    if (error) setError(error.message);
    else setStep('otp');
    setLoading(false);
  }

  async function verifyOtp() {
    setLoading(true); setError('');
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`, token: otp, type: 'sms',
    });
    if (error) setError(error.message);
    else router.replace('/dashboard');
    setLoading(false);
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
          {step === 'phone' ? (
            <>
              <label className="block text-sm font-medium text-mocha mb-2">Mobile number</label>
              <div className="flex items-center border border-amber-200 rounded-xl overflow-hidden mb-4">
                <span className="px-4 py-3 bg-amber-50 text-mocha font-medium border-r border-amber-200">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="flex-1 px-4 py-3 outline-none text-mocha"
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                onClick={sendOtp}
                disabled={phone.length !== 10 || loading}
                className="w-full py-3 bg-turmeric text-mocha font-semibold rounded-xl disabled:opacity-50 hover:bg-amber-400 transition"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-amber-700 mb-4">Enter the OTP sent to +91 {phone}</p>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit OTP"
                className="w-full border border-amber-200 rounded-xl px-4 py-3 text-mocha text-center text-xl tracking-widest outline-none mb-4"
              />
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                onClick={verifyOtp}
                disabled={otp.length !== 6 || loading}
                className="w-full py-3 bg-turmeric text-mocha font-semibold rounded-xl disabled:opacity-50 hover:bg-amber-400 transition"
              >
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
              <button onClick={() => setStep('phone')} className="w-full mt-2 py-2 text-sm text-amber-700">
                ← Change number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
