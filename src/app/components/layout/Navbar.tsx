import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X, Instagram, Youtube, Search } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Videos', href: '/videos' },
  { label: 'Contact', href: '/contact' },
];

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-[#EDE8E1]'
            : 'bg-white border-b border-[#EDE8E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0"
            >
              <span
                className="text-xl md:text-2xl tracking-[0.12em] font-semibold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                LIZA UGC
              </span>
              <span className="block text-[9px] tracking-[0.25em] uppercase text-[#B8956A] font-medium -mt-1">
                Skin & Beauty
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-[13px] tracking-wide font-medium transition-colors duration-200 whitespace-nowrap ${
                    isActive(link.href)
                      ? 'text-[#B8956A]'
                      : 'text-[#1C1917] hover:text-[#B8956A]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#78716C] hover:text-[#1C1917] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#78716C] hover:text-[#B8956A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#78716C] hover:text-[#B8956A] transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#78716C] hover:text-[#B8956A] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <LanguageSwitcher />
              <Link
                to="/login"
                className="ml-1 text-[11px] tracking-widest uppercase font-semibold text-[#78716C]/40 hover:text-[#B8956A] transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Mobile right */}
            <div className="flex lg:hidden items-center gap-3">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#78716C] hover:text-[#1C1917]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="text-[#1C1917]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-[#EDE8E1] bg-white px-4 md:px-8 py-3">
            <div className="max-w-7xl mx-auto">
              <input
                autoFocus
                type="text"
                placeholder="Search reviews, products, brands..."
                className="w-full text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-full px-5 py-2.5 text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#EDE8E1]">
              <span
                className="text-xl tracking-[0.12em] font-semibold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                LIZA UGC
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-8 px-6">
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  className={`py-3 text-base font-medium border-b border-[#EDE8E1] transition-colors ${
                    isActive('/') ? 'text-[#B8956A]' : 'text-[#1C1917] hover:text-[#B8956A]'
                  }`}
                >
                  Home
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`py-3 text-base font-medium border-b border-[#EDE8E1] transition-colors ${
                      isActive(link.href) ? 'text-[#B8956A]' : 'text-[#1C1917] hover:text-[#B8956A]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6">
                <LanguageSwitcher />
              </div>
              <div className="mt-4">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 text-[12px] tracking-widest uppercase font-semibold border border-[#EDE8E1] text-[#78716C] rounded hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            <div className="p-6 border-t border-[#EDE8E1]">
              <div className="flex gap-6 justify-center">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="text-[#78716C] hover:text-[#B8956A] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                  className="text-[#78716C] hover:text-[#B8956A] transition-colors">
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                  className="text-[#78716C] hover:text-[#B8956A] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}