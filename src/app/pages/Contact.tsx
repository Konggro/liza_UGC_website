import { useState } from 'react';
import { Mail, Instagram, Youtube, Send, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-675548e5/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error('Failed to send');
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Something went wrong. Please try emailing me directly at hello@lizaugc.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-3">
            Get in Touch
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Say Hello
          </h1>
          <p className="text-[#78716C] max-w-md mx-auto leading-relaxed">
            Whether you're a brand, a fellow creator, or just a skincare lover — I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Email */}
            <div className="bg-white rounded-2xl border border-[#EDE8E1] p-7">
              <div className="w-10 h-10 rounded-full bg-[#B8956A]/10 flex items-center justify-center mb-4">
                <Mail className="w-4.5 h-4.5 text-[#B8956A]" />
              </div>
              <p className="text-[11px] tracking-widest uppercase text-[#B8956A] font-semibold mb-1">Email</p>
              <a
                href="mailto:hello@lizaugc.com"
                className="text-[#1C1917] font-medium hover:text-[#B8956A] transition-colors"
              >
                Lizaliz179@gmail.com
              </a>
              <p className="text-[#78716C] text-xs mt-1">Response within 24–48 hrs</p>
            </div>

            {/* Socials */}
            <div className="bg-white rounded-2xl border border-[#EDE8E1] p-7">
              <p className="text-[11px] tracking-widest uppercase text-[#B8956A] font-semibold mb-4">Follow Along</p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: Instagram, label: 'liza.ugcc', sub: '245K · Instagram', href: 'https://www.youtube.com/@lizafxy?si=C32T0xeVr7SYKfc1&fbclid=IwY2xjawRlIrBleHRuA2FlbQIxMQBicmlkETFoelFNVnhOdjZkSzg1bUFkc3J0YwZhcHBfaWQBMAABHr_PqXBK4yRNcly16lsmWvP5ElTm9eTCHgOMdzgEC66zDc-jp4zrslsIZ9nf_aem_IA2ZOBrGI3QqBzPxi0FgYg' },
                  { icon: TikTokIcon, label: 'liza.ugcc', sub: '389K · TikTok', href: 'https://www.tiktok.com/@liza.ugcc?_r=1&_t=ZS-964crVvWsoj&fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExT3FmOVh1bDlUbkE0RVY5NHNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4TNDY2NrRqR4o_W5EiZAsVb1QvZfzFdUY4SqMk__pgVlhW_kDgew0zLlkSGA_aem_LEgGp-OIuCiqKqUp2qoaIw' },
                  { icon: Youtube, label: 'Lizafxy', sub: '52K · YouTube', href: 'https://www.youtube.com/@lizafxy?si=C32T0xeVr7SYKfc1&fbclid=IwY2xjawRlIrBleHRuA2FlbQIxMQBicmlkETFoelFNVnhOdjZkSzg1bUFkc3J0YwZhcHBfaWQBMAABHr_PqXBK4yRNcly16lsmWvP5ElTm9eTCHgOMdzgEC66zDc-jp4zrslsIZ9nf_aem_IA2ZOBrGI3QqBzPxi0FgYg' },
                ].map(({ icon: Icon, label, sub, href }) => (
                  <a
                    key={sub}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#EDE8E1] flex items-center justify-center group-hover:border-[#B8956A]/40 transition-colors">
                      <Icon className="w-4 h-4 text-[#78716C] group-hover:text-[#B8956A] transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#B8956A] transition-colors leading-tight">{label}</p>
                      <p className="text-xs text-[#78716C]">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#EDE8E1] p-8 md:p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#B8956A]/10 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-[#B8956A]" />
                </div>
                <h3
                  className="text-2xl font-bold text-[#1C1917] mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Message sent!
                </h3>
                <p className="text-[#78716C]">I'll get back to you within 24–48 hours.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-sm text-[#B8956A] font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2
                  className="text-xl font-bold text-[#1C1917] mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Send a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] tracking-wide mb-2">
                      Your Name <span className="text-[#B8956A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Liza"
                      className="w-full px-4 py-3 border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B8956A] transition-colors bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] tracking-wide mb-2">
                      Email Address <span className="text-[#B8956A]">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B8956A] transition-colors bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] tracking-wide mb-2">
                    Subject <span className="text-[#B8956A]">*</span>
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#B8956A] transition-colors bg-[#FAF8F5] appearance-none"
                  >
                    <option value="">Select a topic...</option>
                    <option value="Brand Collaboration">Brand Collaboration</option>
                    <option value="Product Review">Product Review Request</option>
                    <option value="General Question">General Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] tracking-wide mb-2">
                    Message <span className="text-[#B8956A]">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me what's on your mind..."
                    className="w-full px-4 py-3 border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B8956A] transition-colors bg-[#FAF8F5] resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1C1917] text-white text-sm font-semibold rounded-lg hover:bg-[#B8956A] transition-colors disabled:opacity-60"
                >
                  {sending ? 'Sending...' : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
