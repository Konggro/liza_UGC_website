import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Star, Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';

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
  createdAt: string;
}

const categories = ['All', 'Cleansers', 'Serums & Treatments', 'Moisturizers', 'Sunscreens', 'Masks', 'Eye Care', 'Tools & Devices', 'Makeup'];
const skinTypes = ['All Skin Types', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Mature'];
const priceRanges = ['All Prices', 'Drugstore ($0–$20)', 'Mid-Range ($20–$50)', 'Luxury ($50–$100)', 'Premium ($100+)'];
const sortOptions = ['Newest First', 'Highest Rated', 'Most Popular'];

const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: 'sample-1',
    productName: 'BHA Blackhead Power Liquid',
    brand: 'COSRX',
    productImage: 'https://images.unsplash.com/photo-1688413550763-f6edddd246a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'This is genuinely one of the best BHA exfoliants on the market at any price point.',
    excerpt: 'The holy grail BHA exfoliant that transformed my congested pores in just 4 weeks.',
    rating: 5,
    category: 'Serums & Treatments',
    skinType: 'Oily',
    concern: 'Acne',
    price: '$24',
    priceRange: 'Mid-Range ($20–$50)',
    wouldRepurchase: true,
    isHolyGrail: true,
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'sample-2',
    productName: 'Moisturizing Soft Cream',
    brand: 'La Mer',
    productImage: 'https://images.unsplash.com/photo-1629051192969-c1502f46135e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'Undeniably luxurious, but the results need to be weighed against the steep price tag.',
    excerpt: 'Is the iconic La Mer cream actually worth $200? I tested it for 8 weeks to find out.',
    rating: 4,
    category: 'Moisturizers',
    skinType: 'Dry',
    concern: 'Texture',
    price: '$200',
    priceRange: 'Premium ($100+)',
    wouldRepurchase: false,
    isHolyGrail: false,
    createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'sample-3',
    productName: 'Invisible Shield SPF 50',
    brand: 'Ultrasun',
    productImage: 'https://images.unsplash.com/photo-1596980846062-81a524d170ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'A truly invisible, non-greasy sunscreen that works beautifully under makeup.',
    excerpt: 'Finally, an SPF 50 that doesn\'t leave a white cast and sits beautifully under foundation.',
    rating: 5,
    category: 'Sunscreens',
    skinType: 'Combination',
    concern: 'Dullness',
    price: '$38',
    priceRange: 'Mid-Range ($20–$50)',
    wouldRepurchase: true,
    isHolyGrail: true,
    createdAt: '2025-02-20T00:00:00.000Z',
  },
  {
    id: 'sample-4',
    productName: 'Gentle Foaming Cleanser',
    brand: 'CeraVe',
    productImage: 'https://images.unsplash.com/photo-1745141063798-7fa04698ea80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'The ideal cleanser for acne-prone skin. Dermatologist-developed and it shows.',
    excerpt: 'The gold standard drugstore cleanser that I recommend to literally everyone.',
    rating: 5,
    category: 'Cleansers',
    skinType: 'Oily',
    concern: 'Acne',
    price: '$14',
    priceRange: 'Drugstore ($0–$20)',
    wouldRepurchase: true,
    isHolyGrail: true,
    createdAt: '2025-03-05T00:00:00.000Z',
  },
  {
    id: 'sample-5',
    productName: 'Overnight Recovery Eye Cream',
    brand: 'Sunday Riley',
    productImage: 'https://images.unsplash.com/photo-1738594399272-f05ad0a5ba8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'Noticeably plumped and de-puffed my undereye area within two weeks.',
    excerpt: 'The eye cream that made my dark circles and fine lines visibly diminish overnight.',
    rating: 4,
    category: 'Eye Care',
    skinType: 'Mature',
    concern: 'Anti-Aging',
    price: '$65',
    priceRange: 'Luxury ($50–$100)',
    wouldRepurchase: true,
    isHolyGrail: false,
    createdAt: '2025-03-15T00:00:00.000Z',
  },
  {
    id: 'sample-6',
    productName: 'Glow Recipe Watermelon Mask',
    brand: 'Glow Recipe',
    productImage: 'https://images.unsplash.com/photo-1670201202784-ec638a82bca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    review: 'A gentle, effective sleeping mask that leaves skin dewy and glowing by morning.',
    excerpt: 'The overnight mask that has me waking up to genuinely glowing, plump skin.',
    rating: 4,
    category: 'Masks',
    skinType: 'Sensitive',
    concern: 'Dullness',
    price: '$49',
    priceRange: 'Mid-Range ($20–$50)',
    wouldRepurchase: true,
    isHolyGrail: false,
    createdAt: '2025-03-22T00:00:00.000Z',
  },
];

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkinType, setSelectedSkinType] = useState('All Skin Types');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [sortBy, setSortBy] = useState('Newest First');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-675548e5/reviews`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      const data = await res.json();
      const fetched = data.reviews || [];
      setReviews(fetched.length > 0 ? fetched : PLACEHOLDER_REVIEWS);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews(PLACEHOLDER_REVIEWS);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    if (q && !r.productName?.toLowerCase().includes(q) && !r.brand?.toLowerCase().includes(q)) return false;
    if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
    if (selectedSkinType !== 'All Skin Types' && r.skinType !== selectedSkinType) return false;
    if (selectedPriceRange !== 'All Prices' && r.priceRange !== selectedPriceRange) return false;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const holyGrails = sortedReviews.filter((r) => r.isHolyGrail);
  const hasActiveFilters = selectedCategory !== 'All' || selectedSkinType !== 'All Skin Types' || selectedPriceRange !== 'All Prices';

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSkinType('All Skin Types');
    setSelectedPriceRange('All Prices');
    setSearchQuery('');
  };

  return (
    <div className="bg-white">
      {/* ━━━━━ HEADER ━━━━━ */}
      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">
              Product Reviews
            </p>
            <h1
              className="text-5xl md:text-6xl font-bold text-[#1C1917] leading-[1.05] mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Honest Reviews
            </h1>
            <p className="text-[#78716C] text-lg leading-relaxed mb-4">
              Detailed, science-backed product reviews to help you make informed choices. 
              Every review represents 6–8 weeks of real-world testing.
            </p>
            <p className="text-sm text-[#B8956A] font-medium">{sortedReviews.length} reviews published</p>
          </div>
        </div>
      </section>

      {/* ━━━━━ HOLY GRAILS ━━━━━ */}
      {holyGrails.length > 0 && !hasActiveFilters && !searchQuery && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">
                  Top Rated
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#1C1917]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  My Holy Grails ✨
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {holyGrails.slice(0, 3).map((review) => (
                <Link
                  key={review.id}
                  to={`/reviews/${review.id}`}
                  className="group flex gap-4 bg-[#FAF8F5] rounded-xl p-4 border border-[#EDE8E1] hover:border-[#B8956A]/40 hover:shadow-sm transition-all"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={review.productImage} alt={review.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{review.brand}</p>
                    <h3 className="font-semibold text-[#1C1917] text-sm mt-0.5 group-hover:text-[#B8956A] transition-colors line-clamp-2">
                      {review.productName}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                      ))}
                    </div>
                    {review.price && <p className="text-[#78716C] text-xs mt-1">{review.price}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━ FILTERS ━━━━━ */}
      <section className="sticky top-16 md:top-20 z-30 bg-white border-b border-[#EDE8E1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#78716C]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or brands..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Skin type filter */}
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A] cursor-pointer"
            >
              {skinTypes.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Price range */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A] cursor-pointer"
            >
              {priceRanges.map((pr) => (
                <option key={pr} value={pr}>{pr}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A] cursor-pointer"
            >
              {sortOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-[#78716C] border border-[#EDE8E1] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ━━━━━ REVIEWS GRID ━━━━━ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-[#F5F0EB] rounded-xl mb-4" />
                  <div className="h-3 bg-[#F5F0EB] rounded w-1/3 mb-2" />
                  <div className="h-5 bg-[#F5F0EB] rounded w-3/4 mb-3" />
                  <div className="h-3 bg-[#F5F0EB] rounded w-full" />
                </div>
              ))}
            </div>
          ) : sortedReviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#78716C] text-lg mb-4">No reviews match your filters.</p>
              <button
                onClick={clearFilters}
                className="text-[#B8956A] font-medium text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#78716C] text-sm mb-8">
                Showing {sortedReviews.length} review{sortedReviews.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedReviews.map((review) => (
                  <Link
                    key={review.id}
                    to={`/reviews/${review.id}`}
                    className="group bg-white rounded-xl overflow-hidden border border-[#EDE8E1] hover:shadow-md hover:border-[#B8956A]/30 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-[#FAF8F5] overflow-hidden relative">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {review.isHolyGrail && (
                        <div className="absolute top-3 left-3 bg-[#B8956A] text-white text-[10px] tracking-widest uppercase font-semibold px-3 py-1 rounded-full">
                          Holy Grail ✨
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      {review.brand && (
                        <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold mb-1">{review.brand}</p>
                      )}
                      <h3
                        className="font-semibold text-[#1C1917] mb-2 group-hover:text-[#B8956A] transition-colors text-base leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {review.productName}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                        ))}
                        <span className="text-xs text-[#78716C] ml-1">{review.rating}.0</span>
                      </div>
                      <p className="text-[#78716C] text-sm leading-relaxed line-clamp-2 mb-4">
                        {review.excerpt || review.review}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {review.category && (
                          <span className="text-[10px] tracking-wider uppercase font-medium bg-[#FAF0E4] text-[#B8956A] px-2.5 py-1 rounded-full">
                            {review.category}
                          </span>
                        )}
                        {review.price && (
                          <span className="text-[#78716C] text-xs">{review.price}</span>
                        )}
                        {review.wouldRepurchase && (
                          <span className="text-[10px] text-emerald-600 font-medium">✓ Would repurchase</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EDE8E1]">
                        <p className="text-[#A8A29E] text-xs">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <span className="text-[#B8956A] text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read review <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
