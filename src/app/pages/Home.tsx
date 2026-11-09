import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Star, ArrowRight, Instagram, Youtube, ChevronDown } from 'lucide-react';
import heroImage from '../../imports/copy_CDDD99DF-04CC-4272-A615-74B7DA098F4F.JPEG';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

// Animated counter hook
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  return count;
}

interface Collaboration {
  id: string;
  brandName: string;
  brandLogo: string;
  thumbnail: string;
  campaignName: string;
  description: string;
  type: string;
  createdAt: string;
}

interface Review {
  id: string;
  productName: string;
  brand: string;
  productImage: string;
  review: string;
  excerpt: string;
  rating: number;
  category: string;
  createdAt: string;
}

const HERO_IMAGE = heroImage;
const FEATURED_IMG_1 = 'https://images.unsplash.com/photo-1666025062728-c33a25e8ee3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600';
const FEATURED_IMG_2 = 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600';
const FEATURED_IMG_3 = 'https://images.unsplash.com/photo-1731515052732-9b1bea2efcf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600';

const brandLogos = [
  'The Ordinary', 'CeraVe', 'Paula\'s Choice', 'Drunk Elephant', 'La Mer', 'Sunday Riley'
];

export function Home() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const followers = useCounter(686000, 2000, statsVisible);
  const brands = useCounter(80, 2000, statsVisible);
  const years = useCounter(5, 1500, statsVisible);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      const [collabRes, reviewRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-675548e5/collaborations`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-675548e5/reviews`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        }),
      ]);
      const collabData = await collabRes.json();
      const reviewData = await reviewRes.json();
      setCollaborations(collabData.collaborations || []);
      setReviews(reviewData.reviews || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const formatFollowers = (n: number) => {
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n.toString();
  };

  return (
    <div className="bg-white">
      {/* ━━━━━ HERO ━━━━━ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-[#FAF8F5]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Liza UGC"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 via-[#FAF8F5]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-6">
              Skincare Influencer & Content Creator
            </p>

            {/* Name */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#1C1917] leading-[1.05] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Liza
              <br />
              <span className="italic text-[#B8956A]">UGC</span>
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl text-[#78716C] leading-relaxed mb-8 max-w-lg">
              Honest skincare reviews for real skin and lifestyle — helping you cut through the noise 
              and find what truly works.
            </p>

            {/* Social stats */}
            <div className="flex gap-6 mb-10">
              {[
                { icon: Instagram, label: '3000', sub: 'Instagram' },
                { icon: TikTokIcon, label: '318', sub: 'TikTok' },
                { icon: Youtube, label: '128', sub: 'YouTube' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={sub} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#B8956A]/10 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#B8956A]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1C1917] leading-tight">{label}</div>
                    <div className="text-[10px] text-[#78716C]">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1C1917] text-white text-[13px] tracking-wide font-medium rounded hover:bg-[#B8956A] transition-colors duration-300"
              >
                Explore Reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/collaborations"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#1C1917] text-[#1C1917] text-[13px] tracking-wide font-medium rounded hover:bg-[#1C1917] hover:text-white transition-colors duration-300"
              >
                View Collaborations
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-[#B8956A]">
          <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* ━━━━━ INTRO ━━━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
                About Me
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#1C1917] leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your guide to <em>radiant, healthy</em> skin
              </h2>
              <p className="text-[#78716C] text-base leading-relaxed mb-4">
                I'm Liza UGC — a skincare educator, content creator, and recovering product junkie.
                After struggling with sensitive, dry skin for years, I turned my obsession
                with skincare into a mission: to share unbiased, science-backed reviews that actually help.
              </p>
              <p className="text-[#78716C] text-base leading-relaxed mb-8">
                No paid-for opinions. No unrealistic expectations. Just honest insights from someone 
                who has tried everything — and knows what works.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[#B8956A] font-medium text-sm hover:gap-3 transition-all"
              >
                Learn more about me
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src={FEATURED_IMG_3}
                  alt="Liza UGC skincare routine"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-5 border border-[#EDE8E1]">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#B8956A] text-[#B8956A]" />
                  ))}
                </div>
                <p className="text-[#1C1917] font-semibold text-sm">250+ Products Reviewed</p>
                <p className="text-[#78716C] text-xs">Since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      {/* ━━━━━ FEATURED CONTENT ━━━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
                Featured Content
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Latest & Greatest
              </h2>
            </div>
            <Link to="/reviews" className="text-sm text-[#B8956A] font-medium flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
              View all reviews <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Link to="/reviews" className="group block">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#FAF8F5]">
                <img
                  src={FEATURED_IMG_1}
                  alt="Latest serum review"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold bg-[#FAF0E4] px-3 py-1 rounded-full mb-3">
                Serums & Treatments
              </span>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2 group-hover:text-[#B8956A] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                The Viral Vitamin C Serum — Worth the Hype?
              </h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                I tested this sold-out formula for 8 weeks straight. Here's my completely unfiltered verdict.
              </p>
              <div className="flex items-center gap-1 mt-3">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B8956A] text-[#B8956A]" />
                ))}
                <span className="text-xs text-[#78716C] ml-1">5.0</span>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link to="/collaborations" className="group block">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#FAF8F5]">
                <img
                  src={FEATURED_IMG_2}
                  alt="Recent collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold bg-[#FAF0E4] px-3 py-1 rounded-full mb-3">
                Brand Collaboration
              </span>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2 group-hover:text-[#B8956A] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                My Paula's Choice Campaign — Full Case Study
              </h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                Reach of 1.2M+, 9.4% engagement rate. Here's how we made this campaign magic happen.
              </p>
            </Link>

            {/* Feature 3 */}
            <Link to="/videos" className="group block">
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-[#FAF8F5] relative">
                <img
                  src={FEATURED_IMG_3}
                  alt="Popular reel"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-[#B8956A] border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold bg-[#FAF0E4] px-3 py-1 rounded-full mb-3">
                Video · 2.4M Views
              </span>
              <h3 className="text-lg font-semibold text-[#1C1917] mb-2 group-hover:text-[#B8956A] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                My 5-Step Evening Routine for Glowing Skin
              </h3>
              <p className="text-[#78716C] text-sm leading-relaxed">
                The night routine that completely transformed my skin in 30 days. My most-requested video.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━ LIVE COLLABORATIONS (from backend) ━━━━━ */}
      {!loading && collaborations.length > 0 && (
        <section className="py-16 md:py-24 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
                  Recent Work
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#1C1917]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Brand Collaborations
                </h2>
              </div>
              <Link to="/collaborations" className="text-sm text-[#B8956A] font-medium flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                See all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collaborations.slice(0, 3).map((collab) => (
                <Link
                  key={collab.id}
                  to={`/collaborations/${collab.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE8E1] hover:shadow-md hover:border-[#B8956A]/30 transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-[#FAF8F5] overflow-hidden">
                    {collab.thumbnail ? (
                      <img src={collab.thumbnail} alt={collab.brandName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          {collab.brandName}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold mb-2">
                      {collab.type || 'Collaboration'}
                    </p>
                    <h3 className="font-semibold text-[#1C1917] mb-2 group-hover:text-[#B8956A] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {collab.campaignName || collab.brandName}
                    </h3>
                    <p className="text-[#78716C] text-sm line-clamp-2">{collab.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━ LIVE REVIEWS (from backend) ━━━━━ */}
      {!loading && reviews.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
                  My Reviews
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#1C1917]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Latest Product Reviews
                </h2>
              </div>
              <Link to="/reviews" className="text-sm text-[#B8956A] font-medium flex items-center gap-1 hover:gap-2 transition-all whitespace-nowrap">
                All reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review) => (
                <Link
                  key={review.id}
                  to={`/reviews/${review.id}`}
                  className="group bg-white rounded-xl overflow-hidden border border-[#EDE8E1] hover:shadow-md hover:border-[#B8956A]/30 transition-all duration-300"
                >
                  <div className="aspect-[4/3] bg-[#FAF8F5] overflow-hidden">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {review.category && (
                      <span className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">
                        {review.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-[#1C1917] mt-2 mb-1 group-hover:text-[#B8956A] transition-colors" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                      {review.productName}
                    </h3>
                    {review.brand && <p className="text-[#78716C] text-xs mb-2">{review.brand}</p>}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                      ))}
                    </div>
                    <p className="text-[#78716C] text-sm line-clamp-2 leading-relaxed">
                      {review.excerpt || review.review}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}