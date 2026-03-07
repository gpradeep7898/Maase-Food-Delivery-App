export default function CookOnboardingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
      <nav className="border-b px-6 py-4 flex items-center gap-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <a href="/" className="text-2xl">🍛</a>
        <span className="font-display text-xl" style={{ color: 'var(--mocha)' }}>Maase</span>
        <span className="text-sm ml-2" style={{ color: 'var(--text-muted)' }}>/ Cook Onboarding</span>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">👩‍🍳</div>
          <h1 className="font-display text-4xl mb-3" style={{ color: 'var(--mocha)' }}>Apply to be a Maase Cook</h1>
          <p style={{ color: 'var(--text-secondary)' }}>We'll review your application within 48 hours and get you onboarded.</p>
        </div>

        <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST"
          className="bg-white rounded-2xl border p-8 space-y-5" style={{ borderColor: 'var(--border)' }}>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Sunita Sharma' },
            { name: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '9876543210' },
            { name: 'city', label: 'City', type: 'text', placeholder: 'Hyderabad' },
            { name: 'locality', label: 'Locality / Area', type: 'text', placeholder: 'Banjara Hills' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--mocha)' }}>{label}</label>
              <input name={name} type={type} placeholder={placeholder} required
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--mocha)' }}>Cuisine Specialty</label>
            <select name="cuisine" className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
              {['North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 'Punjabi', 'Rajasthani', 'Kerala', 'Other'].map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--mocha)' }}>Tell us about your cooking</label>
            <textarea name="bio" rows={3} required
              placeholder="What dishes are you known for? How long have you been cooking?"
              className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>

          <button type="submit"
            className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-90"
            style={{ background: 'var(--turmeric)', color: 'var(--mocha)' }}>
            Submit Application →
          </button>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            We'll verify your application and call you within 48 hours.
          </p>
        </form>
      </div>
    </div>
  );
}
