import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b" style={{ background: 'rgba(248,243,232,0.95)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍛</span>
            <span className="font-display text-xl" style={{ color: 'var(--mocha)' }}>Maase</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            <a href="#how" className="hover:text-amber-800 transition">How It Works</a>
            <a href="#cooks" className="hover:text-amber-800 transition">For Cooks</a>
            <Link href="/cook-onboarding" className="hover:text-amber-800 transition">Become a Cook</Link>
          </div>
          <a href="#waitlist"
            className="px-5 py-2 rounded-full text-sm font-semibold transition"
            style={{ background: 'var(--turmeric)', color: 'var(--mocha)' }}>
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{ background: 'var(--turmeric-light)', color: 'var(--mocha)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background: '#4CAF50' }} />
          Launching in Hyderabad · Bangalore · Mumbai
        </div>
        <h1 className="font-display text-5xl md:text-7xl mb-6 leading-tight" style={{ color: 'var(--mocha)' }}>
          Maa ki rasoi,<br />
          <span style={{ color: 'var(--turmeric)' }}>at your doorstep</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Order authentic home-cooked meals from verified local home cooks.
          Fresh, affordable, made with love — just like Maa makes it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#waitlist"
            className="px-8 py-4 rounded-2xl text-base font-bold transition hover:opacity-90"
            style={{ background: 'var(--mocha)', color: 'var(--ivory)' }}>
            Get Early Access →
          </a>
          <Link href="/cook-onboarding"
            className="px-8 py-4 rounded-2xl text-base font-semibold border-2 transition hover:bg-amber-50"
            style={{ borderColor: 'var(--mocha)', color: 'var(--mocha)' }}>
            Cook with us 🍳
          </Link>
        </div>
        {/* Mini stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
          {[['500+', 'Waitlist signups'], ['50+', 'Verified cooks'], ['₹80–150', 'Avg meal price'], ['30 min', 'Avg delivery']].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold font-display" style={{ color: 'var(--mocha)' }}>{val}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-4xl text-center mb-4" style={{ color: 'var(--mocha)' }}>
            Tired of the same old options?
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>Restaurant food is expensive. Tiffins are boring. Cooking takes time.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: '💸', title: 'Restaurant food costs ₹300+', body: 'For a simple dal-chawal that Maa makes for ₹50. You pay for ambience, not taste.' },
              { emoji: '🥱', title: 'Tiffins lack variety', body: 'Same sabji, same dal, every day. No story, no soul, no connection to real home cooking.' },
              { emoji: '⏰', title: 'No time to cook', body: 'Students, working professionals, bachelors — everyone craves a home meal but has no time.' },
            ].map(({ emoji, title, body }) => (
              <div key={title} className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)' }}>
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--mocha)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="font-display text-4xl text-center mb-4" style={{ color: 'var(--mocha)' }}>How Maase works</h2>
        <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>Simple, transparent, and built around real people.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: '01', emoji: '📱', title: 'Open the app', body: 'Browse home cooks near you. See their story, menu, and batch availability.' },
            { step: '02', emoji: '🍳', title: 'Pick a meal', body: 'Choose from today\'s fresh batches. Add to cart. Pay securely via UPI or card.' },
            { step: '03', emoji: '🛵', title: 'We pick & deliver', body: 'Our delivery partner picks up from the cook\'s home and brings it hot to yours.' },
            { step: '04', emoji: '❤️', title: 'Eat, rate & repeat', body: 'Leave a review. Support a local family. Make it part of your daily routine.' },
          ].map(({ step, emoji, title, body }) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: 'var(--turmeric-light)' }}>
                {emoji}
              </div>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--turmeric)', letterSpacing: 2 }}>STEP {step}</p>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--mocha)' }}>{title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For Cooks */}
      <section id="cooks" className="py-20" style={{ background: 'var(--mocha)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-bold mb-3" style={{ color: 'var(--turmeric)', letterSpacing: 2 }}>FOR HOME COOKS</p>
              <h2 className="font-display text-4xl mb-4 text-white">Turn your kitchen into a business</h2>
              <p className="mb-6" style={{ color: '#D4A978', lineHeight: 1.8 }}>
                If you love cooking and have a talent for it, Maase gives you a platform to earn.
                No restaurant required. No investment needed. Just your passion and your recipes.
              </p>
              <ul className="space-y-3 mb-8">
                {['Earn ₹8,000–₹25,000/month from home', 'Set your own menu, batch size, and schedule', 'We handle payments, delivery & customer support', 'Join a community of 50+ verified home cooks'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#D4A978' }}>
                    <span style={{ color: 'var(--turmeric)' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cook-onboarding"
                className="inline-block px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
                style={{ background: 'var(--turmeric)', color: 'var(--mocha)' }}>
                Apply to Cook →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '👩‍🍳', name: 'Sunita Aunty', cuisine: 'North Indian', earnings: '₹18,000/mo' },
                { emoji: '🧓', name: 'Lakshmi Amma', cuisine: 'South Indian', earnings: '₹22,000/mo' },
                { emoji: '👩', name: 'Heena Ben', cuisine: 'Gujarati', earnings: '₹15,000/mo' },
                { emoji: '👵', name: 'Mary Chechi', cuisine: 'Kerala', earnings: '₹19,000/mo' },
              ].map(({ emoji, name, cuisine, earnings }) => (
                <div key={name} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div className="text-3xl mb-3">{emoji}</div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs mb-2" style={{ color: '#D4A978' }}>{cuisine}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--turmeric)' }}>{earnings}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist / CTA */}
      <section id="waitlist" className="py-20 max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl mb-4" style={{ color: 'var(--mocha)' }}>Be the first to know</h2>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          We're launching soon. Drop your number and we'll notify you the moment Maase is live in your city.
        </p>
        <WaitlistForm />
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🍛</span>
            <span className="font-display" style={{ color: 'var(--mocha)' }}>Maase</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>— Made with ❤️ in India</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 Maase India. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function WaitlistForm() {
  // Server component — use a form action or client component for real submissions
  return (
    <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="tel"
        name="phone"
        placeholder="Your mobile number"
        required
        className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none"
        style={{ borderColor: 'var(--border)', color: 'var(--mocha)' }}
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl font-semibold text-sm transition hover:opacity-90"
        style={{ background: 'var(--turmeric)', color: 'var(--mocha)' }}>
        Notify Me →
      </button>
    </form>
  );
}
