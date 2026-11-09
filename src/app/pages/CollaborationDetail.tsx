import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { ArrowLeft, ArrowRight, Instagram, Youtube, BarChart2 } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

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

const PLACEHOLDER: Collaboration = {
  id: 'collab-1',
  brandName: "Paula's Choice",
  brandLogo: '',
  thumbnail: 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
  campaignName: "BHA Campaign — The Science of Clear Skin",
  description: "A multi-platform campaign highlighting the science behind BHA exfoliation. Created educational posts, an Instagram Reel, and 2 TikTok videos explaining how BHA works at the molecular level.",
  type: "Sponsored Campaign",
  platforms: ["Instagram", "TikTok"],
  year: "2025",
  metrics: { reach: "1.2M", engagement: "9.4%", impressions: "3.8M" },
  testimonial: { quote: "Sofia delivered content that genuinely educated our audience. The engagement was 3x our average.", author: "Sarah Kim", title: "Head of Influencer Marketing" },
  featured: true,
  createdAt: '2025-01-20T00:00:00.000Z',
};

const platformIcons: Record<string, React.FC<{ className?: string }>> = {
  Instagram: ({ className }) => <Instagram className={className} />,
  TikTok: TikTokIcon,
  YouTube: ({ className }) => <Youtube className={className} />,
};

export function CollaborationDetail() {
  const { id } = useParams<{ id: string }>();
  const [collab, setCollab] = useState<Collaboration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollab();
  }, [id]);

  const fetchCollab = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-675548e5/collaborations/${id}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setCollab(data.collaboration || PLACEHOLDER);
      } else {
        setCollab(PLACEHOLDER);
      }
    } catch {
      setCollab(PLACEHOLDER);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#B8956A] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const c = collab || PLACEHOLDER;

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FAF8F5] border-b border-[#EDE8E1]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[#78716C]">
            <Link to="/" className="hover:text-[#B8956A] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collaborations" className="hover:text-[#B8956A] transition-colors">Collaborations</Link>
            <span>/</span>
            <span className="text-[#1C1917] font-medium">{c.campaignName || c.brandName}</span>
          </nav>
        </div>
      </div>

      {/* Hero Image */}
      <div className="aspect-[21/9] overflow-hidden bg-[#FAF8F5]">
        {c.thumbnail ? (
          <img src={c.thumbnail} alt={c.campaignName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FAF0E4]">
            <span className="text-4xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {c.brandName}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {c.type && (
                <span className="text-[11px] tracking-[0.2em] uppercase font-semibold text-white bg-[#B8956A] px-3 py-1 rounded-full">
                  {c.type}
                </span>
              )}
              {c.year && <span className="text-[#78716C] text-sm">{c.year}</span>}
            </div>

            <p className="text-[13px] tracking-wide text-[#B8956A] font-semibold mb-2">{c.brandName}</p>
            <h1
              className="text-3xl md:text-4xl font-bold text-[#1C1917] mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {c.campaignName || c.brandName}
            </h1>

            <p className="text-[#78716C] leading-relaxed text-base mb-8">{c.description}</p>

            {/* Platforms */}
            {c.platforms && c.platforms.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#1C1917] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Platforms
                </h2>
                <div className="flex flex-wrap gap-3">
                  {c.platforms.map(p => {
                    const Icon = platformIcons[p];
                    return (
                      <div key={p} className="flex items-center gap-2 bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg px-4 py-2">
                        {Icon && <Icon className="w-4 h-4 text-[#B8956A]" />}
                        <span className="text-[#1C1917] text-sm font-medium">{p}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strategy */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#1C1917] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Strategy & Approach
              </h2>
              <p className="text-[#78716C] leading-relaxed">
                For this campaign, I focused on educational content that would genuinely help the audience 
                understand the product's mechanism rather than just promoting it. The strategy centered on 
                authenticity — I had already been using {c.brandName} products personally, so the content 
                felt natural and trustworthy.
              </p>
              <p className="text-[#78716C] leading-relaxed mt-4">
                Content was staggered across platforms to maximize reach: Instagram Reels for visual impact, 
                TikTok for raw, behind-the-scenes honesty, and longer YouTube content for deep-dives that 
                attract high-intent skincare enthusiasts.
              </p>
            </div>

            {/* Testimonial */}
            {c.testimonial?.quote && (
              <div className="bg-[#FAF0E4] border-l-4 border-[#B8956A] rounded-r-xl p-6 mb-8">
                <p
                  className="text-[#1C1917] text-lg leading-relaxed italic mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  "{c.testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-[#1C1917] text-sm">{c.testimonial.author}</p>
                  <p className="text-[#78716C] text-xs">{c.testimonial.title} · {c.brandName}</p>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-[#EDE8E1]">
              <Link to="/collaborations" className="inline-flex items-center gap-2 text-[#B8956A] font-medium text-sm hover:gap-3 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back to collaborations
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Performance Metrics */}
            {c.metrics && (
              <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#EDE8E1] mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 className="w-4 h-4 text-[#B8956A]" />
                  <h3 className="font-semibold text-[#1C1917] text-sm">Performance Highlights</h3>
                </div>
                <div className="space-y-4">
                  {c.metrics.reach && (
                    <div>
                      <p className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{c.metrics.reach}</p>
                      <p className="text-[#78716C] text-xs">Total Reach</p>
                    </div>
                  )}
                  {c.metrics.engagement && (
                    <div>
                      <p className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{c.metrics.engagement}</p>
                      <p className="text-[#78716C] text-xs">Engagement Rate</p>
                    </div>
                  )}
                  {c.metrics.impressions && (
                    <div>
                      <p className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{c.metrics.impressions}</p>
                      <p className="text-[#78716C] text-xs">Total Impressions</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Campaign Info */}
            <div className="bg-white rounded-xl p-6 border border-[#EDE8E1] mb-6">
              <h3 className="font-semibold text-[#1C1917] text-sm mb-4">Campaign Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Brand', value: c.brandName },
                  { label: 'Type', value: c.type },
                  { label: 'Year', value: c.year },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#78716C]">{label}</span>
                    <span className="text-[#1C1917] font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-[#1C1917] rounded-xl p-6 text-center">
              <p className="text-white font-semibold mb-2">Interested in a similar campaign?</p>
              <p className="text-[#A8A29E] text-sm mb-4">Let's discuss how we can achieve results like this for your brand.</p>
              <Link
                to="/work-with-me"
                className="block w-full py-3 bg-[#B8956A] text-white text-sm font-semibold rounded hover:bg-[#9E7A56] transition-colors text-center"
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
