import { useState } from 'react';
import { Link } from 'react-router';
import { Instagram, Youtube, ArrowUp, Mail } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Product Reviews', href: '/reviews' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Videos', href: '/videos' },
];

const categories = [
  { label: 'Cleansers', href: '/reviews' },
  { label: 'Serums', href: '/reviews' },
  { label: 'Moisturizers', href: '/reviews' },
  { label: 'Sunscreens', href: '/reviews' },
  { label: 'Face Masks', href: '/reviews' },
  { label: 'Eye Care', href: '/reviews' },
  { label: 'Tools & Devices', href: '/reviews' },
  { label: 'All Reviews', href: '/reviews' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div>
            <div className="mb-6">
              <span
                className="text-2xl tracking-[0.12em] font-semibold text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                LIZA UGC
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#B8956A] font-medium mt-0.5">
                Skin & Beauty
              </span>
            </div>
            <p className="text-[#A8A29E] text-sm leading-relaxed">
              Honest, in-depth skincare reviews and brand collaborations. 
              Helping you navigate the beauty world with transparency and expertise.
            </p>
            <p className="text-[#A8A29E] text-sm mt-3 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              "Honest skincare reviews for real skin."
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8956A] mb-6">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-[#A8A29E] hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8956A] mb-6">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    to={cat.href}
                    className="text-[#A8A29E] hover:text-white text-sm transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-[#B8956A] mb-6">
              Stay Connected
            </h4>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-[#A8A29E] text-sm mb-3">
                Join 12,000+ subscribers for exclusive skincare tips & first looks.
              </p>
              {subscribed ? (
                <p className="text-[#B8956A] text-sm font-medium">
                  ✓ You're subscribed! Welcome to the community.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder:text-[#78716C] focus:outline-none focus:border-[#B8956A] transition-colors min-w-0"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#B8956A] text-white text-xs font-semibold rounded hover:bg-[#9E7A56] transition-colors whitespace-nowrap"
                  >
                    Join
                  </button>
                </form>
              )}
              <p className="text-[#78716C] text-xs mt-2">No spam, ever. Unsubscribe anytime.</p>
            </div>

            {/* Social */}
            <div>
              <p className="text-[#A8A29E] text-sm mb-3">Follow along:</p>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A8A29E] hover:text-[#B8956A] transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A8A29E] hover:text-[#B8956A] transition-colors"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A8A29E] hover:text-[#B8956A] transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="mailto:hello@lizaugc.com"
                  className="text-[#A8A29E] hover:text-[#B8956A] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#78716C] text-xs text-center md:text-left">
            © 2026 Liza UGC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-[#78716C] hover:text-[#B8956A] text-xs transition-colors"
            >
              <ArrowUp className="w-3 h-3" />
              Back to top
            </button>
            <Link
              to="/login"
              className="text-[#4A4A4A]/30 hover:text-[#78716C] text-xs transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}