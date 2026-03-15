(function () {
  'use strict';

  /* ── Inject Google Fonts if not already on page ── */
  if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@400;500;600;700&display=swap';
    document.head.appendChild(fl);
  }

  /* ── Styles ── */
  var css = `
    /* ─── TRUST STRIP ─── */
    .mf-trust {
      background: #FFF9EF;
      border-top: 1px solid rgba(92,58,33,0.10);
      border-bottom: 1px solid rgba(92,58,33,0.10);
      padding: 16px 0;
    }
    .mf-trust-inner {
      display: flex; justify-content: center; align-items: center;
      flex-wrap: wrap; gap: 10px 36px;
      max-width: 1180px; margin: 0 auto; padding: 0 20px;
    }
    .mf-trust-item {
      display: flex; align-items: center; gap: 9px;
      font-family: 'Poppins', sans-serif; font-size: 0.82rem; font-weight: 600;
      color: #5C3A21; white-space: nowrap;
    }
    .mf-trust-check {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, #F4A300, #D98D00);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800; flex-shrink: 0;
    }

    /* ─── CITY LAUNCH ─── */
    .mf-city {
      background: #5C3A21; padding: 60px 0; text-align: center;
    }
    .mf-city-inner { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    .mf-city-eyebrow {
      font-family: 'Poppins', sans-serif; font-size: 0.7rem; font-weight: 700;
      letter-spacing: 2.5px; text-transform: uppercase; color: #F4A300;
      margin-bottom: 14px; display: flex; align-items: center; justify-content: center; gap: 7px;
    }
    .mf-city-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2.6rem, 7vw, 4.5rem);
      color: #F8F3E8; line-height: 1; margin-bottom: 18px;
    }
    .mf-city-sub {
      font-family: 'Poppins', sans-serif; font-size: 0.95rem;
      color: rgba(248,243,232,0.60); line-height: 1.75;
    }
    .mf-city-chips {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 30px;
    }
    .mf-city-chip {
      padding: 8px 20px; border-radius: 999px;
      font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 600;
    }
    .mf-city-chip.live  { background: #F4A300; color: #5C3A21; }
    .mf-city-chip.soon  {
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.10);
      color: rgba(248,243,232,0.38);
    }

    /* ─── MAIN FOOTER ─── */
    .mf-footer { background: #3A2010; padding: 64px 0 0; font-family: 'Poppins', sans-serif; }
    .mf-footer-inner { max-width: 1180px; margin: 0 auto; padding: 0 28px; }
    .mf-top {
      display: grid;
      grid-template-columns: 1.5fr repeat(5, 1fr);
      gap: 32px;
      padding-bottom: 52px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    /* Brand col */
    .mf-brand-col { padding-right: 12px; }
    .mf-logo-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
    .mf-logo-img {
      width: 42px; height: 42px; border-radius: 11px; overflow: hidden;
      border: 1.5px solid rgba(244,163,0,0.3); flex-shrink: 0;
    }
    .mf-logo-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .mf-logo-name { font-family: 'Playfair Display', serif; font-size: 1.25rem; color: #F8F3E8; }
    .mf-brand-tag { font-size: 0.78rem; color: rgba(248,243,232,0.42); line-height: 1.65; margin-bottom: 20px; }

    /* Social icons */
    .mf-social-row { display: flex; gap: 8px; margin-bottom: 26px; }
    .mf-social-btn {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
      display: flex; align-items: center; justify-content: center;
      color: rgba(248,243,232,0.45); text-decoration: none;
      transition: all 0.2s; flex-shrink: 0;
    }
    .mf-social-btn:hover {
      background: rgba(244,163,0,0.14); border-color: rgba(244,163,0,0.28);
      color: #F4A300;
    }

    /* Newsletter */
    .mf-nl-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: rgba(248,243,232,0.35); margin-bottom: 7px; }
    .mf-nl-text  { font-size: 0.8rem; color: rgba(248,243,232,0.55); margin-bottom: 11px; line-height: 1.55; }
    .mf-nl-row   { display: flex; gap: 6px; }
    .mf-nl-input {
      flex: 1; min-width: 0; height: 38px;
      background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.11);
      border-radius: 8px; padding: 0 12px;
      font-family: 'Poppins', sans-serif; font-size: 0.82rem; color: #F8F3E8; outline: none;
    }
    .mf-nl-input::placeholder { color: rgba(248,243,232,0.25); }
    .mf-nl-input:focus { border-color: rgba(244,163,0,0.45); }
    .mf-nl-btn {
      height: 38px; padding: 0 14px; flex-shrink: 0;
      background: #F4A300; border: none; border-radius: 8px;
      font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 700;
      color: #5C3A21; cursor: pointer; transition: background 0.2s; white-space: nowrap;
    }
    .mf-nl-btn:hover { background: #D98D00; }
    .mf-nl-ok { display: none; font-size: 0.8rem; color: #4ade80; margin-top: 8px; font-weight: 600; }

    /* Nav columns */
    .mf-nav-col h4 {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 1.5px;
      text-transform: uppercase; color: rgba(248,243,232,0.35); margin-bottom: 16px;
    }
    .mf-nav-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 11px; }
    .mf-nav-col ul li a {
      font-size: 0.84rem; color: rgba(248,243,232,0.58);
      text-decoration: none; transition: color 0.18s; display: block; line-height: 1.4;
    }
    .mf-nav-col ul li a:hover { color: #F4A300; }

    /* Bottom bar */
    .mf-bottom { background: #251006; padding: 22px 0; }
    .mf-bottom-inner {
      max-width: 1180px; margin: 0 auto; padding: 0 28px;
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 10px;
    }
    .mf-bottom-left { display: flex; flex-direction: column; gap: 3px; }
    .mf-bottom-copy    { font-size: 0.78rem; color: rgba(248,243,232,0.30); }
    .mf-bottom-tagline { font-size: 0.73rem; color: rgba(244,163,0,0.38); font-style: italic; }
    .mf-bottom-links   { display: flex; flex-wrap: wrap; gap: 18px; }
    .mf-bottom-links a {
      font-size: 0.75rem; color: rgba(248,243,232,0.28); text-decoration: none; transition: color 0.18s;
    }
    .mf-bottom-links a:hover { color: rgba(248,243,232,0.60); }

    /* ─── MOBILE ACCORDION ─── */
    @media (max-width: 900px) {
      .mf-top { grid-template-columns: 1fr; gap: 0; }
      .mf-brand-col {
        padding-right: 0; padding-bottom: 28px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .mf-nav-col { border-bottom: 1px solid rgba(255,255,255,0.06); }
      .mf-nav-col h4 {
        cursor: pointer; padding: 16px 0; margin: 0;
        display: flex; justify-content: space-between; align-items: center;
        user-select: none;
      }
      .mf-nav-col h4::after {
        content: '+'; font-size: 1.1rem; color: rgba(248,243,232,0.35);
        transition: transform 0.2s; font-family: 'Poppins', sans-serif; font-weight: 400;
      }
      .mf-nav-col.mf-open h4::after { content: '−'; }
      .mf-nav-col ul {
        max-height: 0; overflow: hidden;
        transition: max-height 0.32s ease, padding 0.2s; padding: 0;
      }
      .mf-nav-col.mf-open ul { max-height: 320px; padding-bottom: 18px; }
    }
    @media (max-width: 560px) {
      .mf-city { padding: 40px 0; }
      .mf-footer { padding-top: 40px; }
      .mf-trust-inner { gap: 8px 16px; }
      .mf-trust-item { font-size: 0.76rem; }
      .mf-nl-row { flex-direction: column; }
      .mf-nl-btn { width: 100%; }
      .mf-bottom-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
      .mf-bottom-links { gap: 12px; }
    }
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ── */
  var html = `
  <!-- TRUST STRIP -->
  <div class="mf-trust">
    <div class="mf-trust-inner">
      <div class="mf-trust-item"><div class="mf-trust-check">✓</div>Fresh Home Cooked Meals</div>
      <div class="mf-trust-item"><div class="mf-trust-check">✓</div>Verified Home Kitchens</div>
      <div class="mf-trust-item"><div class="mf-trust-check">✓</div>Secure Payments</div>
      <div class="mf-trust-item"><div class="mf-trust-check">✓</div>Hyperlocal Delivery</div>
    </div>
  </div>

  <!-- CITY LAUNCH -->
  <div class="mf-city">
    <div class="mf-city-inner">
      <div class="mf-city-eyebrow">📍 Launching First In</div>
      <div class="mf-city-name">Bangalore</div>
      <div class="mf-city-sub">
        Maase is launching first in Bangalore with hyperlocal home kitchens.<br />
        More cities coming soon based on demand.
      </div>
      <div class="mf-city-chips">
        <span class="mf-city-chip live">📍 Bangalore</span>
        <span class="mf-city-chip soon">Mumbai — Soon</span>
        <span class="mf-city-chip soon">Chennai — Soon</span>
        <span class="mf-city-chip soon">Hyderabad — Soon</span>
        <span class="mf-city-chip soon">Pune — Soon</span>
      </div>
    </div>
  </div>

  <!-- MAIN FOOTER -->
  <footer class="mf-footer">
    <div class="mf-footer-inner">
      <div class="mf-top">

        <!-- Brand + Newsletter -->
        <div class="mf-brand-col">
          <div class="mf-logo-wrap">
            <div class="mf-logo-img"><img src="logo.jpg" alt="Maase" /></div>
            <span class="mf-logo-name">Maase</span>
          </div>
          <div class="mf-brand-tag">One Extra Meal, From Maa.<br />India's marketplace for authentic home-cooked food.</div>
          <div class="mf-social-row">
            <a class="mf-social-btn" href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a class="mf-social-btn" href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter / X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a class="mf-social-btn" href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a class="mf-social-btn" href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </a>
          </div>
          <div class="mf-nl-label">Stay Updated</div>
          <div class="mf-nl-text">Get updates when Maase launches in your city</div>
          <div class="mf-nl-row">
            <input class="mf-nl-input" id="mfNlEmail" type="email" placeholder="Your email address" />
            <button class="mf-nl-btn" onclick="mfNewsletterSubmit()">Join Waitlist</button>
          </div>
          <div class="mf-nl-ok" id="mfNlOk">✓ You're on the list!</div>
        </div>

        <!-- Company -->
        <div class="mf-nav-col">
          <h4>Company</h4>
          <ul>
            <li><a href="index.html#why">About Maase</a></li>
            <li><a href="index.html#how">How Maase Works</a></li>
            <li><a href="mailto:connect.maase@gmail.com">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="mailto:connect.maase@gmail.com">Press</a></li>
          </ul>
        </div>

        <!-- Platform -->
        <div class="mf-nav-col">
          <h4>Platform</h4>
          <ul>
            <li><a href="index.html#contact">Become a Home Chef</a></li>
            <li><a href="mailto:support@maaseindia.com">Delivery Partner</a></li>
            <li><a href="#">Kitchen Safety</a></li>
            <li><a href="#">FSSAI Registration</a></li>
          </ul>
        </div>

        <!-- Legal -->
        <div class="mf-nav-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="terms.html">Terms &amp; Conditions</a></li>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="refund-cancellation.html">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <!-- Community -->
        <div class="mf-nav-col">
          <h4>Community</h4>
          <ul>
            <li><a href="mother-survey.html">Mother Survey</a></li>
            <li><a href="index.html#contact">Join Waitlist</a></li>
            <li><a href="index.html#contact">Early Chef Signup</a></li>
            <li><a href="index.html#nominate">Nominate Your Maa</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="mf-nav-col">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:support@maaseindia.com">Help Center</a></li>
            <li><a href="mailto:support@maaseindia.com">Contact Us</a></li>
            <li><a href="mailto:support@maaseindia.com">Email Support</a></li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mf-bottom">
      <div class="mf-bottom-inner">
        <div class="mf-bottom-left">
          <span class="mf-bottom-copy">© 2026 Maase India. All rights reserved.</span>
          <span class="mf-bottom-tagline">Built for empowering home kitchens. One extra meal. One extra income.</span>
        </div>
        <div class="mf-bottom-links">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
          <a href="refund-cancellation.html">Refund &amp; Cancellation</a>
          <a href="mailto:support@maaseindia.com">support@maaseindia.com</a>
        </div>
      </div>
    </div>
  </footer>`;

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  /* ── Newsletter submit ── */
  window.mfNewsletterSubmit = function () {
    var emailEl = document.getElementById('mfNlEmail');
    var okEl    = document.getElementById('mfNlOk');
    if (!emailEl || !emailEl.value.includes('@')) return;
    emailEl.parentElement.style.display = 'none';
    okEl.style.display = 'block';
  };

  /* ── Mobile accordion ── */
  function initAccordion() {
    document.querySelectorAll('.mf-nav-col').forEach(function (col) {
      var h4 = col.querySelector('h4');
      if (!h4) return;
      h4.addEventListener('click', function () {
        if (window.innerWidth <= 900) col.classList.toggle('mf-open');
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();
