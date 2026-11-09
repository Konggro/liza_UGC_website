import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Star, Check, X, ArrowLeft, ArrowRight, ShoppingBag, Share2 } from 'lucide-react';

interface Review {
  id: string;
  productName: string;
  brand: string;
  productImage: string;
  review: string;
  excerpt: string;
  rating: number;
  category: string;
  skinType: string;
  concern: string;
  price: string;
  priceRange: string;
  wouldRepurchase: boolean;
  isHolyGrail: boolean;
  ratingEffectiveness?: number;
  ratingValue?: number;
  ratingTexture?: number;
  ratingScent?: number;
  ratingPackaging?: number;
  pros?: string[];
  cons?: string[];
  bestFor?: string[];
  createdAt: string;
}

interface AllReview {
  id: string;
  productName: string;
  brand: string;
  productImage: string;
  rating: number;
  category: string;
  createdAt: string;
  excerpt?: string;
}

function StarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[#78716C] text-sm w-36">{label}</span>
      <div className="flex items-center gap-1 flex-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < value ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
        ))}
      </div>
      <span className="text-[#1C1917] font-medium text-sm">{value}/5</span>
    </div>
  );
}

const PLACEHOLDER: Review = {
  id: 'sample-1',
  productName: 'BHA Blackhead Power Liquid',
  brand: 'COSRX',
  productImage: 'https://images.unsplash.com/photo-1688413550763-f6edddd246a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
  review: `**First Impressions**

When the COSRX BHA Blackhead Power Liquid arrived, I was immediately impressed by its minimalist packaging. The bottle is simple — a clear plastic bottle with a pump dispenser — which perfectly reflects The Ordinary's ethos of letting the formula do the talking.

The liquid itself is water-thin and completely clear. No scent, no color. When I pressed it to my skin for the first time, I expected the telltale sting of acids, but there was almost nothing. Just a very mild, brief tingle that faded within seconds.

**Key Ingredients**

The star ingredient is Betaine Salicylate at 4% — a gentler derivative of salicylic acid that exfoliates inside the pore without the harshness of traditional BHA formulas. It's paired with Salix Alba (Willow Bark) Water, which provides additional anti-inflammatory benefits. The base is simple niacinamide-free (good news for those who have experienced "niacinamide + vitamin C" flushing).

**How I Used It**

I applied this every other evening after cleansing, before my toner and serums. Per COSRX's instructions, I used just 2-3 drops and pressed it gently into my skin rather than rubbing. I waited 30 seconds before applying anything else.

**My Experience**

Week 1–2: Very subtle change. My skin felt softer, but I couldn't say my pores had changed. A few small blackheads on my nose seemed to become more defined — which I later learned can happen as dead skin is loosened before being expelled.

Week 3–4: This is where things started clicking. I noticed significantly fewer new blackheads. My T-zone looked smoother. A persistent clogged pore on my chin that had been there for months started to shrink.

Week 6–8: The transformation was real. My pore congestion was noticeably reduced. My skin had a natural luminosity I hadn't seen in years. A close friend asked if I'd gotten a facial.

**Results**

What it did well: dramatically reduced blackheads and whiteheads, smoothed skin texture, improved overall radiance without irritation.

What it didn't do: It didn't completely eliminate my acne (I still use a benzoyl peroxide spot treatment for active breakouts), and it didn't address post-inflammatory hyperpigmentation.`,
  excerpt: 'The holy grail BHA exfoliant that transformed my congested pores in just 4 weeks.',
  rating: 5,
  category: 'Serums & Treatments',
  skinType: 'Oily',
  concern: 'Acne',
  price: '$24',
  priceRange: 'Mid-Range ($20–$50)',
  wouldRepurchase: true,
  isHolyGrail: true,
  ratingEffectiveness: 5,
  ratingValue: 5,
  ratingTexture: 4,
  ratingScent: 5,
  ratingPackaging: 4,
  pros: [
    'Dramatically reduces blackheads and clogged pores',
    'Gentle enough for daily use on most skin types',
    'No irritation, dryness, or flaking',
    'Affordable price point for a BHA exfoliant',
    'Fragrance-free and dye-free',
    'Results visible within 4–6 weeks',
  ],
  cons: [
    'Pump can be finicky (sometimes dispenses too much)',
    'Does not address active inflammatory acne',
    'May not be strong enough for very severe congestion',
    'Packaging is functional but not luxurious',
  ],
  bestFor: ['Oily and combination skin types', 'Anyone with blackheads or clogged pores', 'People who find traditional salicylic acid too harsh'],
  createdAt: '2025-01-15T00:00:00.000Z',
};

export function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<AllReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const [reviewRes, allRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-675548e5/reviews/${id}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-675548e5/reviews`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` }
        })
      ]);
      if (reviewRes.ok) {
        const data = await reviewRes.json();
        setReview(data.review || PLACEHOLDER);
      } else {
        setReview(PLACEHOLDER);
      }
      const allData = await allRes.json();
      setAllReviews(allData.reviews || []);
    } catch {
      setReview(PLACEHOLDER);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#B8956A] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-[#78716C]">Review not found.</p>
        <Link to="/reviews" className="text-[#B8956A] font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to reviews
        </Link>
      </div>
    );
  }

  const relatedReviews = allReviews.filter(r => r.id !== id && (r.category === review.category || r.brand === review.brand)).slice(0, 3);

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#FAF8F5] border-b border-[#EDE8E1]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-[#78716C]">
            <Link to="/" className="hover:text-[#B8956A] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/reviews" className="hover:text-[#B8956A] transition-colors">Reviews</Link>
            <span>/</span>
            <span className="text-[#1C1917] font-medium">{review.productName}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* ━━━ LEFT: Product Info ━━━ */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              {/* Product Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-6">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Brand & Name */}
              {review.brand && (
                <p className="text-[11px] tracking-[0.25em] uppercase text-[#B8956A] font-semibold mb-1">{review.brand}</p>
              )}
              <h1
                className="text-2xl md:text-3xl font-bold text-[#1C1917] mb-2 leading-snug"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {review.productName}
              </h1>

              {/* Price */}
              {review.price && (
                <p className="text-lg text-[#78716C] mb-4">{review.price}</p>
              )}

              {/* Star rating */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                ))}
                <span className="text-[#1C1917] font-semibold">{review.rating}/5</span>
              </div>

              {/* Quick info */}
              <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#EDE8E1] mb-6 space-y-3">
                {[
                  { label: 'Best For', value: review.skinType },
                  { label: 'Main Concern', value: review.concern },
                  { label: 'Price Range', value: review.priceRange },
                  { label: 'Category', value: review.category },
                ].map(({ label, value }) => value && (
                  <div key={label} className="flex justify-between items-center text-sm">
                    <span className="text-[#78716C]">{label}</span>
                    <span className="text-[#1C1917] font-medium">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-sm pt-2 border-t border-[#EDE8E1]">
                  <span className="text-[#78716C]">Would Repurchase</span>
                  <span className={`font-semibold flex items-center gap-1 ${review.wouldRepurchase ? 'text-emerald-600' : 'text-red-500'}`}>
                    {review.wouldRepurchase ? <><Check className="w-4 h-4" /> Yes</> : <><X className="w-4 h-4" /> No</>}
                  </span>
                </div>
                {review.isHolyGrail && (
                  <div className="text-center pt-2 border-t border-[#EDE8E1]">
                    <span className="text-[#B8956A] text-sm font-semibold">✨ Holy Grail Pick</span>
                  </div>
                )}
              </div>

              {/* CTA */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors mb-3"
              >
                <ShoppingBag className="w-4 h-4" />
                Shop This Product
              </a>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full py-3.5 border border-[#EDE8E1] text-[#78716C] text-sm font-medium rounded-lg hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Link Copied!' : 'Share Review'}
              </button>
            </div>
          </div>

          {/* ━━━ RIGHT: Review Content ━━━ */}
          <div className="lg:col-span-2">
            {/* Excerpt */}
            <div className="bg-[#FAF0E4] border-l-4 border-[#B8956A] rounded-r-xl p-6 mb-10">
              <p
                className="text-[#1C1917] text-lg leading-relaxed italic"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                "{review.excerpt || review.review.substring(0, 150)}..."
              </p>
            </div>

            {/* Rating Breakdown */}
            {review.ratingEffectiveness && (
              <div className="mb-10">
                <h2
                  className="text-xl font-bold text-[#1C1917] mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Detailed Rating Breakdown
                </h2>
                <div className="space-y-3 bg-[#FAF8F5] rounded-xl p-6 border border-[#EDE8E1]">
                  <StarRow label="Effectiveness" value={review.ratingEffectiveness || 0} />
                  <StarRow label="Value for Money" value={review.ratingValue || 0} />
                  <StarRow label="Texture/Feel" value={review.ratingTexture || 0} />
                  <StarRow label="Scent" value={review.ratingScent || 0} />
                  <StarRow label="Packaging" value={review.ratingPackaging || 0} />
                </div>
              </div>
            )}

            {/* Full Review */}
            <div className="mb-10">
              <h2
                className="text-xl font-bold text-[#1C1917] mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Full Review
              </h2>
              <div className="prose prose-sm max-w-none text-[#78716C] leading-relaxed space-y-4">
                {review.review.split('\n\n').map((para, i) => (
                  <p key={i} className={para.startsWith('**') ? 'font-semibold text-[#1C1917] text-base mt-6 first:mt-0' : ''}>
                    {para.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            {(review.pros || review.cons) && (
              <div className="mb-10">
                <h2
                  className="text-xl font-bold text-[#1C1917] mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Pros & Cons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {review.pros && (
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                      <h3 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Pros
                      </h3>
                      <ul className="space-y-2">
                        {review.pros.map((pro) => (
                          <li key={pro} className="text-[#78716C] text-sm flex gap-2 items-start">
                            <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                      <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <X className="w-4 h-4" /> Cons
                      </h3>
                      <ul className="space-y-2">
                        {review.cons.map((con) => (
                          <li key={con} className="text-[#78716C] text-sm flex gap-2 items-start">
                            <X className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Best For */}
            {review.bestFor && (
              <div className="mb-10">
                <h2
                  className="text-xl font-bold text-[#1C1917] mb-5"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Best For
                </h2>
                <div className="flex flex-wrap gap-3">
                  {review.bestFor.map((item) => (
                    <span key={item} className="bg-[#FAF0E4] text-[#B8956A] text-sm font-medium px-4 py-2 rounded-full border border-[#EDE0CC]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to Reviews */}
            <div className="pt-8 border-t border-[#EDE8E1]">
              <Link
                to="/reviews"
                className="inline-flex items-center gap-2 text-[#B8956A] font-medium text-sm hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all reviews
              </Link>
            </div>
          </div>
        </div>

        {/* ━━━ RELATED REVIEWS ━━━ */}
        {relatedReviews.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#EDE8E1]">
            <div className="flex items-end justify-between mb-8">
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                More Reviews to Explore
              </h2>
              <Link to="/reviews" className="text-sm text-[#B8956A] font-medium flex items-center gap-1 hover:gap-2 transition-all">
                All reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedReviews.map((r) => (
                <Link
                  key={r.id}
                  to={`/reviews/${r.id}`}
                  className="group flex gap-4 bg-[#FAF8F5] rounded-xl p-4 border border-[#EDE8E1] hover:border-[#B8956A]/40 hover:shadow-sm transition-all"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={r.productImage} alt={r.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div>
                    {r.brand && <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{r.brand}</p>}
                    <h3 className="font-medium text-[#1C1917] text-sm group-hover:text-[#B8956A] transition-colors">{r.productName}</h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
