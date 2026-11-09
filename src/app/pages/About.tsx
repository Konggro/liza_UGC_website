import { Link } from 'react-router';
import { ArrowRight, CheckCircle, Heart, Camera, Beaker } from 'lucide-react';
import portraitImage from '../../imports/IMG_3766.jpeg';

const PORTRAIT = portraitImage;
const BEHIND_SCENES = 'https://images.unsplash.com/photo-1646206346896-14367dee001b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';
const FLATLAY = 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800';

const timeline = [
  { year: '2019', event: 'Started my skincare journey after a terrible cystic acne breakout' },
  { year: '2020', event: 'Launched @lizaugc on Instagram with my first honest review' },
  { year: '2021', event: 'Hit 50K followers — first brand partnership with a Korean beauty brand' },
  { year: '2022', event: 'Expanded to TikTok; viral video reached 8M views overnight' },
  { year: '2023', event: 'Reached 500K+ followers; launched The Skincare Edit newsletter' },
  { year: '2024', event: 'Named "Top 10 Beauty Creators" by Glossy Magazine' },
  { year: '2025', event: 'Passed 686K combined followers; partnered with 80+ brands' },
];

const funFacts = [
  { icon: '☕', fact: 'I\'m obsessed with coffee shops—especially coffee and matcha' },
  { icon: '📱', fact: 'I\'m a social media marketer, but also an architecture student' },
  { icon: '📸', fact: 'I create all my content using just my phone' },
  { icon: '🍔', fact: 'I aim for a healthy lifestyle, but I love fast food' },
  { icon: '🎧', fact: 'I\'m into digital accessories—like phones, cameras, tripods, phone cases, and more' },
];

const testimonials = [
  {
    quote: "liza's honest reviews genuinely changed how I shop for skincare. I trust her opinions more than any brand marketing.",
    name: "Priya M.",
    handle: "@priyaskin.diary",
  },
  {
    quote: "I've been following for 3 years. Every single recommendation she's made that I've tried has worked exactly as she described.",
    name: "Jade T.",
    handle: "@jadeglows",
  },
  {
    quote: "She's the one creator who actually explains the science without making it overwhelming. I've learned so much.",
    name: "Rebecca L.",
    handle: "@rebeccabeauty_",
  },
];

const credentials = [
  { title: 'Skincare Formulation Certificate', org: 'Formula Botanica, 2022' },
  { title: 'Cosmetic Science Fundamentals', org: 'Society of Cosmetic Scientists, 2021' },
  { title: 'Sensitive Skin Specialist Training', org: 'International Dermal Institute, 2023' },
];

export function About() {
  return (
    <div className="bg-white">
      {/* ━━━━━ HERO ━━━━━ */}
      <section className="py-20 md:py-28 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                My Story
              </p>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1C1917] leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                About <em className="italic text-[#B8956A]">Liza</em>
              </h1>
              <p className="text-[#78716C] text-lg leading-relaxed mb-4">
                Skincare content creator, ingredient obsessive, and your honest guide 
                to navigating the overwhelming world of beauty.
              </p>
              <p className="text-[#78716C] leading-relaxed">
                Based in New York City · Available worldwide for collaborations
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={PORTRAIT} alt="Liza UGC" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#B8956A] flex items-center justify-center text-white text-center text-xs font-semibold leading-tight p-3">
                Est.<br />2019
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ MY STORY ━━━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
              How It Started
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              From breakouts to breakthroughs
            </h2>
            <div className="prose max-w-none text-[#78716C] leading-relaxed space-y-5">
              <p>
              I used to not care much about skincare—I would just wash my face with a 
                foaming cleanser and apply sunscreen. At the time, I didn’t fully understand 
                my skin or its needs.
              </p>
              <p>
               As I became more interested in skincare,
                I started experiencing sensitivity and reactions, 
                which pushed me to learn more deeply. That journey led me to understand my 
                skin better and inspired me to share my own minimal routine with others who have 
                sensitive skin like mine.
              </p>
              <p>
               I’ve come to realize that our skin is a reflection of our lifestyle.
                With that understanding, I decided to create content around skincare,
                beauty, and everyday living.
              </p>
              <p>
                Simple. Real. Minimal.
That’s the philosophy behind everything I share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ SKIN PROFILE ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                My Skin
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Know my baseline
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Skin Type', value: 'sensitive, combination skin' },
                  { label: 'Main Concerns', value: 'allergies and sebum control' },
                  { label: 'Tone', value: 'Medium, Warm Undertone' },
                  { label: 'Sensitivity', value: 'highly Sensitive' },
                  { label: 'Fave Ingredients', value: 'Cica, PDRN, Tea tree, hyaluronic' },
                  { label: 'Avoids', value: 'AHA, Glycolic acid' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl p-4 border border-[#EDE8E1]">
                    <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold mb-1">{label}</p>
                    <p className="text-[#1C1917] text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                My Review Criteria
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-8"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                How I test products
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Beaker, title: 'checks every product seperately ', desc: 'Every product gets a minimum of 2 weeks of consistent daily use before I publish a review.' },
                  { icon: Camera, title: 'Documented Progress', desc: 'I photograph my skin weekly under the same lighting conditions to track real changes.' },
                  { icon: CheckCircle, title: 'Ingredient Analysis', desc: 'I research the full ingredient list, concentrations, and peer-reviewed studies on key actives.' },
                  { icon: Heart, title: 'Genuine Experience', desc: 'I only review products I\'ve personally used. If I haven\'t tried it, I don\'t review it.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FAF0E4] flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-[#B8956A]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1C1917] mb-1">{title}</h4>
                      <p className="text-[#78716C] text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ BEHIND THE SCENES ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                Behind the Camera
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                How I create content
              </h2>
              <p className="text-[#78716C] leading-relaxed mb-6">
                I put a lot of effort into making my content high quality. 
                For my own social media, I try to keep things simple and minimal.
              </p>
              <p className="text-[#78716C] leading-relaxed mb-8">
                At the same time, I work as a freelance content creator and social media marketer,
                so I dedicate even more time and effort to creating content for my clients.
                I handle everything myself—from filming and developing ideas to editing—so the process
                takes much more work than it may appear.Because I genuinely enjoy what I do, I see learning new skills from different areas as one of the biggest advantages in my life.

I may not be at a fully professional level yet, but I’m committed to improving and continuing to grow.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { stat: '15–20h', label: 'Per Review' },
                  { stat: '100%', label: 'Self-Shot' },
                  { stat: '2–8wk', label: 'Test Period' },
                ].map(({ stat, label }) => (
                  <div key={label} className="text-center bg-white rounded-xl p-4 border border-[#EDE8E1]">
                    <p className="text-xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stat}</p>
                    <p className="text-[#78716C] text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden">
              <img src={BEHIND_SCENES} alt="Content creation setup" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      

      {/* ━━━━━ FUN FACTS ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
              Just For Fun
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1C1917]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Random facts about me
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {funFacts.map((fact) => (
              <div key={fact.fact} className="bg-white rounded-xl p-6 border border-[#EDE8E1] flex gap-4 items-start">
                <span className="text-2xl">{fact.icon}</span>
                <p className="text-[#78716C] text-sm leading-relaxed">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ TESTIMONIALS ━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
              What People Say
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#1C1917]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Community love
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FAF8F5] rounded-xl p-8 border border-[#EDE8E1]">
                <p className="text-4xl text-[#B8956A] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>"</p>
                <p className="text-[#1C1917] leading-relaxed italic mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {t.quote}
                </p>
                <div>
                  <p className="font-semibold text-[#1C1917] text-sm">{t.name}</p>
                  <p className="text-[#B8956A] text-xs">{t.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
