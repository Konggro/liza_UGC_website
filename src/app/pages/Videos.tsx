import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Play, Eye, Heart, Instagram, Youtube } from 'lucide-react';

const API = `https://${projectId}.supabase.co/functions/v1/make-server-675548e5`;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  type: string;
  views: string;
  likes: string;
  duration: string;
  date: string;
  url: string;
  featured: boolean;
  createdAt: string;
}

const PLACEHOLDER_VIDEOS: Video[] = [
  {
    id: 'p1', title: 'My 5-Step Evening Routine for Glowing Skin',
    description: 'The night routine that completely transformed my skin in 30 days.',
    thumbnail: 'https://images.unsplash.com/photo-1731515052732-9b1bea2efcf5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'YouTube', type: 'Skincare Routines', views: '2.4M', likes: '142K', duration: '18:24', date: 'Mar 2025', url: '#', featured: true, createdAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'p2', title: 'Testing VIRAL TikTok Skincare Products — Honest Review',
    description: 'I tried every viral skincare product trending on TikTok. Completely honest thoughts.',
    thumbnail: 'https://images.unsplash.com/photo-1646206346896-14367dee001b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'TikTok', type: 'Product Reviews', views: '8.1M', likes: '912K', duration: '4:32', date: 'Feb 2025', url: '#', featured: true, createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'p3', title: 'My Complete AM Skincare Routine — Every Product Explained',
    description: 'Step-by-step walkthrough of my morning routine and what you could swap.',
    thumbnail: 'https://images.unsplash.com/photo-1701163802894-99fa45f1c83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'Instagram', type: 'Skincare Routines', views: '1.2M', likes: '98K', duration: '2:45', date: 'Jan 2025', url: '#', featured: false, createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'p4', title: 'Retinol 101: Everything You Need to Know Before Starting',
    description: 'A comprehensive guide to starting retinol — the right way.',
    thumbnail: 'https://images.unsplash.com/photo-1666025062728-c33a25e8ee3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'YouTube', type: 'Educational Content', views: '3.8M', likes: '287K', duration: '22:18', date: 'Jan 2025', url: '#', featured: false, createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'p5', title: 'The Ordinary vs. Paula\'s Choice — Which is Actually Better?',
    description: 'Head-to-head comparison of two of the most popular skincare brands.',
    thumbnail: 'https://images.unsplash.com/photo-1748543668676-ea8241cb3886?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'TikTok', type: 'Product Comparisons', views: '5.6M', likes: '620K', duration: '6:14', date: 'Dec 2024', url: '#', featured: false, createdAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'p6', title: 'Get Ready With Me — Dewy Skin for a Formal Event',
    description: 'Full GRWM for a gala: skincare prep, makeup application, and all-night glow tricks.',
    thumbnail: 'https://images.unsplash.com/photo-1758613653947-cfce6ae77b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'YouTube', type: 'Get Ready With Me', views: '1.8M', likes: '112K', duration: '31:05', date: 'Nov 2024', url: '#', featured: false, createdAt: '2024-11-01T00:00:00.000Z',
  },
  {
    id: 'p7', title: '10 Skincare Myths That Need to Die in 2025',
    description: 'Debunking the most persistent skincare myths I see online. Backed by science.',
    thumbnail: 'https://images.unsplash.com/photo-1688413550763-f6edddd246a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'TikTok', type: 'Educational Content', views: '4.2M', likes: '445K', duration: '5:48', date: 'Oct 2024', url: '#', featured: false, createdAt: '2024-10-15T00:00:00.000Z',
  },
  {
    id: 'p8', title: 'Skincare Haul — November Sephora Sale Finds',
    description: 'Everything I picked up at the Sephora Sale and why each product made the cut.',
    thumbnail: 'https://images.unsplash.com/photo-1629051192969-c1502f46135e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600',
    platform: 'Instagram', type: 'Hauls & Unboxings', views: '890K', likes: '76K', duration: '3:20', date: 'Oct 2024', url: '#', featured: false, createdAt: '2024-10-01T00:00:00.000Z',
  },
];

const filterPlatforms = ['All Videos', 'Instagram', 'TikTok', 'YouTube'];
const contentTypes = ['All Content', 'Skincare Routines', 'Product Reviews', 'Educational Content', 'Get Ready With Me', 'Product Comparisons', 'Hauls & Unboxings', 'Tutorials'];
const sortOptions = ['Most Recent', 'Most Popular'];

const platformIconMap: Record<string, React.FC<{ className?: string }>> = {
  Instagram: ({ className }) => <Instagram className={className} />,
  TikTok: TikTokIcon,
  YouTube: ({ className }) => <Youtube className={className} />,
};

const platformColors: Record<string, string> = {
  Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  TikTok: 'bg-black',
  YouTube: 'bg-red-600',
};

export function Videos() {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('All Videos');
  const [selectedType, setSelectedType] = useState('All Content');
  const [sortBy, setSortBy] = useState('Most Recent');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${API}/videos`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json();
        if (res.ok && data.videos && data.videos.length > 0) {
          setAllVideos(data.videos);
        } else {
          setAllVideos(PLACEHOLDER_VIDEOS);
        }
      } catch {
        setAllVideos(PLACEHOLDER_VIDEOS);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = allVideos.filter(v => {
    if (selectedPlatform !== 'All Videos' && v.platform !== selectedPlatform) return false;
    if (selectedType !== 'All Content' && v.type !== selectedType) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Most Popular') {
      const parseNum = (s: string) => parseFloat(s.replace(/[MKk]/g, m => m === 'M' ? '000000' : '000')) || 0;
      return parseNum(b.views) - parseNum(a.views);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredVideos = allVideos.filter(v => v.featured).slice(0, 2);
  const displayFeatured = featuredVideos.length > 0 ? featuredVideos : allVideos.slice(0, 2);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#B8956A] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ━━━━━ HEADER ━━━━━ */}
      <section className="py-16 md:py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-4">Content Hub</p>
              <h1
                className="text-5xl md:text-6xl font-bold text-[#1C1917] leading-[1.05] mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Videos &<br />
                <em className="italic text-[#B8956A]">Content</em>
              </h1>
              <p className="text-[#78716C] text-lg leading-relaxed mb-6">
                Tutorials, reviews, and skincare education — on Instagram, TikTok, and YouTube.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: Instagram, platform: 'Instagram', link: 'https://instagram.com' },
                  { icon: TikTokIcon, platform: 'TikTok', link: 'https://tiktok.com' },
                  { icon: Youtube, platform: 'YouTube', link: 'https://youtube.com' },
                ].map(({ icon: Icon, platform, link }) => (
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EDE8E1] rounded-lg text-[#1C1917] text-sm font-medium hover:border-[#B8956A] hover:text-[#B8956A] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    Follow on {platform}
                  </a>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { stat: `${allVideos.length}`, label: 'Videos Posted' },
                { stat: '686K+', label: 'Followers' },
                { stat: '8.2%', label: 'Avg. Engagement' },
              ].map(({ stat, label }) => (
                <div key={label} className="bg-white rounded-xl p-5 border border-[#EDE8E1] text-center">
                  <p className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stat}</p>
                  <p className="text-[#78716C] text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ FEATURED VIDEOS ━━━━━ */}
      {displayFeatured.length > 0 && (
        <section className="py-14 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-10">
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#B8956A] font-semibold mb-2">Trending</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#1C1917]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Most Popular Videos
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayFeatured.map(video => {
                const PlatIcon = platformIconMap[video.platform];
                return (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#FAF8F5] mb-4">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#EDE8E1] flex items-center justify-center">
                          <Play className="w-10 h-10 text-[#B8956A]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-[#B8956A] ml-0.5" />
                        </div>
                      </div>
                      <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold ${platformColors[video.platform] || 'bg-[#B8956A]'}`}>
                        {PlatIcon && <PlatIcon className="w-3 h-3" />}
                        {video.platform}
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#78716C] mb-2">
                      {video.views && <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {video.views}</span>}
                      {video.likes && <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {video.likes}</span>}
                      {video.date && <span>{video.date}</span>}
                    </div>
                    <span className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{video.type}</span>
                    <h3
                      className="font-semibold text-[#1C1917] group-hover:text-[#B8956A] transition-colors mt-1 leading-snug"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {video.title}
                    </h3>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ━━━━━ FILTERS ━━━━━ */}
      <div className="sticky top-16 md:top-20 z-30 bg-white border-b border-[#EDE8E1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="px-4 py-2 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A]"
            >
              {filterPlatforms.map(p => <option key={p}>{p}</option>)}
            </select>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-4 py-2 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A]"
            >
              {contentTypes.map(t => <option key={t}>{t}</option>)}
            </select>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 text-sm bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#B8956A]"
            >
              {sortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ━━━━━ VIDEO GRID ━━━━━ */}
      <section className="py-12 md:py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#78716C]">No videos match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredVideos.map(video => {
                const PlatIcon = platformIconMap[video.platform];
                return (
                  <a
                    key={video.id}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl overflow-hidden border border-[#EDE8E1] hover:shadow-md hover:border-[#B8956A]/30 transition-all duration-300"
                  >
                    <div className="relative aspect-video bg-[#FAF8F5] overflow-hidden">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#EDE8E1]">
                          <Play className="w-6 h-6 text-[#B8956A]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-[#B8956A] ml-0.5" />
                        </div>
                      </div>
                      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold ${platformColors[video.platform] || 'bg-[#B8956A]'}`}>
                        {PlatIcon && <PlatIcon className="w-2.5 h-2.5" />}
                        {video.platform}
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-[9px] tracking-widest uppercase text-[#B8956A] font-semibold">{video.type}</span>
                      <h3
                        className="font-medium text-[#1C1917] text-sm mt-1 leading-snug line-clamp-2 group-hover:text-[#B8956A] transition-colors"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      >
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-3 text-xs text-[#A8A29E]">
                        {video.views && <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {video.views}</span>}
                        {video.likes && <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {video.likes}</span>}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━ FOLLOW CTA ━━━━━ */}
      <section className="py-16 md:py-20 bg-[#1C1917]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Want exclusive content?
          </h2>
          <p className="text-[#A8A29E] mb-8">
            Join me on social media for daily skincare tips, behind-the-scenes content, and first looks at new products.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { platform: 'Instagram', followers: '245K', link: 'https://instagram.com', Icon: Instagram },
              { platform: 'TikTok', followers: '389K', link: 'https://tiktok.com', Icon: TikTokIcon },
              { platform: 'YouTube', followers: '52K', link: 'https://youtube.com', Icon: Youtube },
            ].map(({ platform, followers, link, Icon }) => (
              <a
                key={platform}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <Icon className="w-4 h-4 text-[#B8956A]" />
                <div className="text-left">
                  <p className="text-xs text-[#A8A29E]">{platform}</p>
                  <p className="text-sm font-semibold">{followers} followers</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
