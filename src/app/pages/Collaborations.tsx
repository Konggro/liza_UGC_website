import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { ArrowRight, Instagram, Youtube } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  Instagram: ({ className }) => <Instagram className={className} />,
  TikTok: TikTokIcon,
  YouTube: ({ className }) => <Youtube className={className} />,
};

interface Collaboration {
  id: string;
  brandName: string;
  brandLogo: string;
  thumbnail: string;
  campaignName: string;
  description: string;
  type: string;
  platforms: string[];
  year: string;
  metrics: { reach?: string; engagement?: string; impressions?: string };
  testimonial: { quote: string; author: string; title: string };
  featured: boolean;
  createdAt: string;
}

const PLACEHOLDER_COLLABS: Collaboration[] = [
  {
    id: 'collab-1',
    brandName: "Paula's Choice",
    brandLogo: '',
    thumbnail: 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    campaignName: "BHA Campaign — The Science of Clear Skin",
    description: "A multi-platform campaign highlighting the science behind BHA exfoliation. Created 3 in-depth educational posts, an Instagram Reel, and 2 TikTok videos explaining how BHA works at the molecular level.",
    type: "Sponsored Campaign",
    platforms: ["Instagram", "TikTok"],
    year: "2025",
    metrics: { reach: "1.2M", engagement: "9.4%", impressions: "3.8M" },
    testimonial: { quote: "Sofia delivered content that genuinely educated our audience. The engagement was 3x our average.", author: "Sarah Kim", title: "Head of Influencer Marketing" },
    featured: true,
    createdAt: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'collab-2',
    brandName: "CeraVe",
    brandLogo: '',
    thumbnail: 'https://images.unsplash.com/photo-1758613653947-cfce6ae77b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    campaignName: "Sensitive Skin Awareness Month",
    description: "A month-long ambassador partnership celebrating sensitive skin. Featured CeraVe's dermatologist-developed formulas across my AM and PM routine content with authentic integration.",
    type: "Brand Ambassador",
    platforms: ["Instagram", "YouTube", "TikTok"],
    year: "2025",
    metrics: { reach: "890K", engagement: "8.1%", impressions: "2.4M" },
    testimonial: { quote: "One of our most authentic and effective partnerships of the year.", author: "Marcus J.", title: "Brand Manager" },
    featured: true,
    createdAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: 'collab-3',
    brandName: "Drunk Elephant",
    brandLogo: '',
    thumbnail: 'https://images.unsplash.com/photo-1666025062728-c33a25e8ee3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    campaignName: "T.L.C. Framboos Glycolic Night Serum Launch",
    description: "Exclusive product launch content for the reformulated T.L.C. Framboos. First-to-market review with a dedicated 20-minute YouTube deep-dive and supporting social content.",
    type: "Product Launch",
    platforms: ["YouTube", "Instagram"],
    year: "2024",
    metrics: { reach: "650K", engagement: "7.8%", impressions: "1.9M" },
    testimonial: { quote: "The YouTube video became our top-performing piece of influencer content this quarter.", author: "Emma R.", title: "Digital Marketing Lead" },
    featured: true,
    createdAt: '2024-11-10T00:00:00.000Z',
  },
  {
    id: 'collab-4',
    brandName: "Sunday Riley",
    brandLogo: '',
    thumbnail: 'https://images.unsplash.com/photo-1731515052732-9b1bea2efcf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    campaignName: "Good Genes Lactic Acid Glow Series",
    description: "A 3-part Instagram series documenting my 30-day journey with Good Genes Lactic Acid Treatment. Transparent, documented results with weekly check-ins.",
    type: "Sponsored Posts",
    platforms: ["Instagram"],
    year: "2024",
    metrics: { reach: "420K", engagement: "8.9%", impressions: "1.1M" },
    testimonial: { quote: "Sofia's authenticity shines through every post.", author: "Alex W.", title: "PR Manager" },
    featured: false,
    createdAt: '2024-09-05T00:00:00.000Z',
  },
];

const testimonials = [
  {
    quote: "Working with Sofia was effortless. She understood our brand values immediately and created content that felt completely authentic. The results exceeded every KPI we set.",
    author: "Sarah Kim",
    title: "Head of Influencer Marketing",
    brand: "Paula's Choice",
  },
  {
    quote: "Sofia is our go-to for sensitive skincare content. She genuinely uses and loves our products, and that authenticity translates into exceptional engagement.",
    author: "Dr. Rachel T.",
    title: "Brand Strategy Director",
    brand: "CeraVe",
  },
  {
    quote: "The YouTube review Sofia created for our serum launch became our most-viewed piece of influencer content ever. We can't recommend working with her highly enough.",
    author: "Emma R.",
    title: "Digital Marketing Lead",
    brand: "Drunk Elephant",
  },
];

const filterTypes = ['All', 'Sponsored Campaign', 'Brand Ambassador', 'Product Launch', 'Sponsored Posts'];

export function Collaborations() {
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    fetchCollabs();
    const interval = setInterval(() => {
      setTestimonialIndex(i => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchCollabs = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-675548e5/collaborations`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      const fetched = data.collaborations || [];
      setCollabs(fetched.length > 0 ? fetched : PLACEHOLDER_COLLABS);
    } catch {
      setCollabs(PLACEHOLDER_COLLABS);
    } finally {
      setLoading(false);
    }
  };

  const years = ['All', ...Array.from(new Set(collabs.map(c => c.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a))];

  const filtered = collabs.filter(c => {
    if (filterType !== 'All' && c.type !== filterType) return false;
    if (filterYear !== 'All' && c.year !== filterYear) return false;
    return true;
  });

  const featured = collabs.filter(c => c.featured);

  return (
    <div className="bg-white">
      {/* ━━━━━ HEADER ━━━━━ */}
      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                Brand Partnerships
              </p>
              <h1
                className="text-5xl md:text-6xl font-bold text-[#1C1917] leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Brand <em className="italic text-[#B8956A]">Collaborations</em>
              </h1>
              <p className="text-[#78716C] text-lg leading-relaxed mb-6">
                Trusted by leading skincare brands to create authentic, high-converting 
                content that educates, inspires, and converts.
              </p>
              <p className="text-sm text-[#B8956A] font-medium">{collabs.length}+ brands and counting</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ FEATURED PARTNERSHIPS ━━━━━ */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-12">
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
                Spotlight
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Featured Partnerships
              </h2>
            </div>

            <div className="space-y-8">
              {featured.slice(0, 3).map((collab, i) => (
                <Link
                  key={collab.id}
                  to={`/collaborations/${collab.id}`}
                  className={`group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-[#EDE8E1] hover:shadow-lg hover:border-[#B8956A]/30 transition-all duration-300 ${i % 2 === 1 ? 'lg:grid-cols-[1fr_1fr] direction-rtl' : ''}`}
                >
                  <div className={`aspect-[16/9] lg:aspect-auto overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={collab.thumbnail}
                      alt={collab.campaignName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className={`p-8 md:p-10 bg-white flex flex-col justify-center ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-white bg-[#B8956A] px-3 py-1 rounded-full">
                        {collab.type}
                      </span>
                      {collab.year && <span className="text-[#78716C] text-sm">{collab.year}</span>}
                    </div>
                    <p className="text-[13px] tracking-wide text-[#B8956A] font-semibold mb-2">{collab.brandName}</p>
                    <h3
                      className="text-xl md:text-2xl font-bold text-[#1C1917] mb-4 group-hover:text-[#B8956A] transition-colors"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {collab.campaignName}
                    </h3>
                    <p className="text-[#78716C] text-sm leading-relaxed mb-6">{collab.description}</p>
                    {collab.metrics && (
                      <div className="flex gap-6 mb-6">
                        {collab.metrics.reach && (
                          <div>
                            <p className="text-lg font-bold text-[#1C1917]">{collab.metrics.reach}</p>
                            <p className="text-xs text-[#78716C]">Total Reach</p>
                          </div>
                        )}
                        {collab.metrics.engagement && (
                          <div>
                            <p className="text-lg font-bold text-[#1C1917]">{collab.metrics.engagement}</p>
                            <p className="text-xs text-[#78716C]">Engagement Rate</p>
                          </div>
                        )}
                        {collab.metrics.impressions && (
                          <div>
                            <p className="text-lg font-bold text-[#1C1917]">{collab.metrics.impressions}</p>
                            <p className="text-xs text-[#78716C]">Impressions</p>
                          </div>
                        )}
                      </div>
                    )}
                    {collab.platforms && collab.platforms.length > 0 && (
                      <div className="flex gap-3 mb-6">
                        {collab.platforms.map(p => {
                          const Icon = platformIcons[p];
                          return Icon ? (
                            <div key={p} className="flex items-center gap-1.5 text-[#78716C] text-xs">
                              <Icon className="w-4 h-4" />
                              {p}
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                    <span className="inline-flex items-center gap-2 text-[#B8956A] font-medium text-sm group-hover:gap-3 transition-all">
                      View Case Study <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━ ALL COLLABORATIONS ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">All Work</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Collaboration Archive
              </h2>
            </div>
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-4 py-2 text-sm bg-white border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A]"
              >
                {filterTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                className="px-4 py-2 text-sm bg-white border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A]"
              >
                {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] bg-[#EDE8E1] rounded-xl mb-4" />
                  <div className="h-4 bg-[#EDE8E1] rounded w-1/2 mb-2" />
                  <div className="h-5 bg-[#EDE8E1] rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((collab) => (
                <Link
                  key={collab.id}
                  to={`/collaborations/${collab.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE8E1] hover:shadow-md hover:border-[#B8956A]/30 transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-[#FAF8F5] overflow-hidden">
                    {collab.thumbnail ? (
                      <img src={collab.thumbnail} alt={collab.campaignName || collab.brandName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          {collab.brandName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {collab.type && (
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8956A] bg-[#FAF0E4] px-2.5 py-1 rounded-full">
                          {collab.type}
                        </span>
                      )}
                      {collab.year && <span className="text-[#A8A29E] text-xs">{collab.year}</span>}
                    </div>
                    <p className="text-xs font-semibold text-[#1C1917] mb-1">{collab.brandName}</p>
                    <h3
                      className="font-semibold text-[#1C1917] group-hover:text-[#B8956A] transition-colors text-base leading-snug mb-3"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {collab.campaignName || collab.brandName}
                    </h3>
                    <p className="text-[#78716C] text-sm line-clamp-2 mb-4">{collab.description}</p>
                    {collab.platforms && collab.platforms.length > 0 && (
                      <div className="flex gap-3">
                        {collab.platforms.map(p => {
                          const Icon = platformIcons[p];
                          return Icon ? <Icon key={p} className="w-4 h-4 text-[#A8A29E]" /> : null;
                        })}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━ TESTIMONIALS ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#1C1917]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
            Brand Testimonials
          </p>
          <h2
            className="text-3xl font-bold text-white mb-12"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            What brands say
          </h2>

          <div className="relative overflow-hidden min-h-[160px] flex items-center">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700 ${
                  i === testimonialIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p
                  className="text-white text-lg md:text-xl leading-relaxed italic mb-6"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-[#B8956A] font-semibold">{t.author}</p>
                  <p className="text-[#78716C] text-sm">{t.title} · {t.brand}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIndex ? 'bg-[#B8956A]' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ CTA ━━━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
            Be Next
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Want to be featured here?
          </h2>
          <p className="text-[#78716C] mb-8 leading-relaxed">
            I work with brands that prioritize efficacy, transparency, and authenticity. 
            If that sounds like you, I'd love to explore what we can create together.
          </p>
          <Link
            to="/work-with-me"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B8956A] text-white font-semibold rounded hover:bg-[#9E7A56] transition-colors"
          >
            Let's Collaborate <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
