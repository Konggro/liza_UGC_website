import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import {
  Plus, Trash2, LogOut, Star, ExternalLink, Edit3,
  Play, Eye, Heart, Mail, MailOpen, X, ChevronDown, ChevronUp,
  Instagram, Youtube, Film,
} from 'lucide-react';

const API = `https://${projectId}.supabase.co/functions/v1/make-server-675548e5`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Collaboration {
  id: string; brandName: string; brandLogo: string; thumbnail: string;
  campaignName: string; description: string; type: string; platforms: string[];
  year: string; metrics: { reach?: string; engagement?: string; impressions?: string };
  testimonial: { quote: string; author: string; title: string };
  featured: boolean; createdAt: string;
}
interface Review {
  id: string; productName: string; brand: string; productImage: string;
  review: string; excerpt: string; rating: number; category: string;
  skinType: string; concern: string; price: string; priceRange: string;
  wouldRepurchase: boolean; isHolyGrail: boolean; createdAt: string;
}
interface Video {
  id: string; title: string; description: string; thumbnail: string;
  platform: string; type: string; views: string; likes: string;
  duration: string; date: string; url: string; featured: boolean; createdAt: string;
}
interface ContactSubmission {
  id: string; type: string; name: string; email: string; subject: string;
  message: string; company: string; service: string; budget: string;
  createdAt: string; read: boolean;
}

type TabType = 'collaborations' | 'reviews' | 'videos' | 'contacts';

// ─── Constants ────────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#B8956A] transition-colors";
const platforms = ['Instagram', 'TikTok', 'YouTube'];
const reviewCategories = ['Cleansers', 'Serums & Treatments', 'Moisturizers', 'Sunscreens', 'Masks', 'Eye Care', 'Tools & Devices', 'Makeup', 'Other'];
const skinTypes = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Mature', 'All Skin Types'];
const priceRanges = ['Drugstore ($0–$20)', 'Mid-Range ($20–$50)', 'Luxury ($50–$100)', 'Premium ($100+)'];
const collabTypes = ['Sponsored Campaign', 'Brand Ambassador', 'Product Launch', 'Sponsored Posts', 'Other'];
const videoTypes = ['Skincare Routines', 'Product Reviews', 'Educational Content', 'Get Ready With Me', 'Product Comparisons', 'Hauls & Unboxings', 'Tutorials', 'Other'];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.26 6.26 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#EDE8E1] sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-[#1C1917] text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</h2>
          <button onClick={onClose} className="text-[#78716C] hover:text-[#1C1917] w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FAF8F5] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#1C1917] mb-2">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

// ─── Default form states ──────────────────────────────────────────────────────
const defaultCollab = {
  brandName: '', brandLogo: '', thumbnail: '', campaignName: '',
  description: '', type: 'Sponsored Campaign', platforms: [] as string[],
  year: new Date().getFullYear().toString(), featured: false,
  metricsReach: '', metricsEngagement: '', metricsImpressions: '',
  testimonialQuote: '', testimonialAuthor: '', testimonialTitle: '',
};

const defaultReview = {
  productName: '', brand: '', productImage: '', excerpt: '', review: '',
  rating: 5, category: 'Serums & Treatments', skinType: 'Combination',
  concern: '', price: '', priceRange: 'Mid-Range ($20–$50)',
  wouldRepurchase: true, isHolyGrail: false,
};

const defaultVideo = {
  title: '', description: '', thumbnail: '', platform: 'Instagram',
  type: 'Product Reviews', views: '', likes: '', duration: '', date: '', url: '', featured: false,
};

// ─── Main Admin Component ─────────────────────────────────────────────────────
export function Admin() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState('');
  const [tab, setTab] = useState<TabType>('reviews');
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  // Collab form/modal
  const [collabOpen, setCollabOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaboration | null>(null);
  const [collab, setCollab] = useState(defaultCollab);

  // Review form/modal
  const [reviewOpen, setReviewOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [rev, setRev] = useState(defaultReview);

  // Video form/modal
  const [videoOpen, setVideoOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [vid, setVid] = useState(defaultVideo);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/login'); return; }
    setAccessToken(session.access_token);
    fetchData(session.access_token);
    // Keep the token fresh — Supabase rotates it roughly every hour
    supabase.auth.onAuthStateChange((_event, s) => {
      if (s) setAccessToken(s.access_token);
      else navigate('/login');
    });
  };

  const authHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const fetchData = async (token: string) => {
    try {
      const [cr, rr, vr, cnr] = await Promise.all([
        fetch(`${API}/collaborations`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
        fetch(`${API}/reviews`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
        fetch(`${API}/videos`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
        fetch(`${API}/contacts`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (cnr.status === 401) {
        toast.error('This account is not an admin');
        await supabase.auth.signOut();
        navigate('/login');
        return;
      }
      const [cd, rd, vd, cnd]= await Promise.all([cr.json(), rr.json(), vr.json(), cnr.json()]);
      setCollaborations(cd.collaborations || []);
      setReviews(rd.reviews || []);
      setVideos(vd.videos || []);
      setContacts(cnd.submissions || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate('/login'); };

  // ─── Collab helpers ──────────────────────────────────────────────────────────
  const openAddCollab = () => {
    setEditingCollab(null);
    setCollab(defaultCollab);
    setCollabOpen(true);
  };

  const openEditCollab = (c: Collaboration) => {
    setEditingCollab(c);
    setCollab({
      brandName: c.brandName, brandLogo: c.brandLogo || '', thumbnail: c.thumbnail || '',
      campaignName: c.campaignName || '', description: c.description, type: c.type,
      platforms: c.platforms || [], year: c.year,
      featured: c.featured,
      metricsReach: c.metrics?.reach || '', metricsEngagement: c.metrics?.engagement || '',
      metricsImpressions: c.metrics?.impressions || '',
      testimonialQuote: c.testimonial?.quote || '', testimonialAuthor: c.testimonial?.author || '',
      testimonialTitle: c.testimonial?.title || '',
    });
    setCollabOpen(true);
  };

  const togglePlatform = (platform: string) => {
    setCollab(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const saveCollab = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        brandName: collab.brandName, brandLogo: collab.brandLogo,
        thumbnail: collab.thumbnail, campaignName: collab.campaignName,
        description: collab.description, type: collab.type,
        platforms: collab.platforms, year: collab.year, featured: collab.featured,
        metrics: { reach: collab.metricsReach, engagement: collab.metricsEngagement, impressions: collab.metricsImpressions },
        testimonial: { quote: collab.testimonialQuote, author: collab.testimonialAuthor, title: collab.testimonialTitle },
      };

      if (editingCollab) {
        const res = await fetch(`${API}/collaborations/${editingCollab.id}`, {
          method: 'PUT', headers: authHeaders(accessToken), body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to update'); return; }
        setCollaborations(prev => prev.map(c => c.id === editingCollab.id ? data.collaboration : c));
        toast.success('Collaboration updated!');
      } else {
        const res = await fetch(`${API}/collaborations`, {
          method: 'POST', headers: authHeaders(accessToken), body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to add'); return; }
        setCollaborations(prev => [data.collaboration, ...prev]);
        toast.success('Collaboration added!');
      }
      setCollabOpen(false);
    } catch { toast.error('Failed to save collaboration'); }
  };

  const deleteCollab = async (id: string) => {
    if (!confirm('Delete this collaboration?')) return;
    try {
      const res = await fetch(`${API}/collaborations/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      setCollaborations(prev => prev.filter(c => c.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  // ─── Review helpers ──────────────────────────────────────────────────────────
  const openAddReview = () => {
    setEditingReview(null);
    setRev(defaultReview);
    setReviewOpen(true);
  };

  const openEditReview = (r: Review) => {
    setEditingReview(r);
    setRev({
      productName: r.productName, brand: r.brand || '', productImage: r.productImage || '',
      excerpt: r.excerpt || '', review: r.review, rating: r.rating,
      category: r.category, skinType: r.skinType, concern: r.concern || '',
      price: r.price || '', priceRange: r.priceRange || 'Mid-Range ($20–$50)',
      wouldRepurchase: r.wouldRepurchase, isHolyGrail: r.isHolyGrail,
    });
    setReviewOpen(true);
  };

  const saveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        const res = await fetch(`${API}/reviews/${editingReview.id}`, {
          method: 'PUT', headers: authHeaders(accessToken), body: JSON.stringify(rev),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to update'); return; }
        setReviews(prev => prev.map(r => r.id === editingReview.id ? data.review : r));
        toast.success('Review updated!');
      } else {
        const res = await fetch(`${API}/reviews`, {
          method: 'POST', headers: authHeaders(accessToken), body: JSON.stringify(rev),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to add'); return; }
        setReviews(prev => [data.review, ...prev]);
        toast.success('Review added!');
      }
      setReviewOpen(false);
    } catch { toast.error('Failed to save review'); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`${API}/reviews/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  // ─── Video helpers ───────────────────────────────────────────────────────────
  const openAddVideo = () => {
    setEditingVideo(null);
    setVid(defaultVideo);
    setVideoOpen(true);
  };

  const openEditVideo = (v: Video) => {
    setEditingVideo(v);
    setVid({
      title: v.title, description: v.description || '', thumbnail: v.thumbnail || '',
      platform: v.platform, type: v.type, views: v.views || '',
      likes: v.likes || '', duration: v.duration || '', date: v.date || '',
      url: v.url, featured: v.featured || false,
    });
    setVideoOpen(true);
  };

  const saveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVideo) {
        const res = await fetch(`${API}/videos/${editingVideo.id}`, {
          method: 'PUT', headers: authHeaders(accessToken), body: JSON.stringify(vid),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to update'); return; }
        setVideos(prev => prev.map(v => v.id === editingVideo.id ? data.video : v));
        toast.success('Video updated!');
      } else {
        const res = await fetch(`${API}/videos`, {
          method: 'POST', headers: authHeaders(accessToken), body: JSON.stringify(vid),
        });
        const data = await res.json();
        if (!res.ok) { toast.error(data.error || 'Failed to add'); return; }
        setVideos(prev => [data.video, ...prev]);
        toast.success('Video added!');
      }
      setVideoOpen(false);
    } catch { toast.error('Failed to save video'); }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      const res = await fetch(`${API}/videos/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      setVideos(prev => prev.filter(v => v.id !== id));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  // ─── Contact helpers ──────────────────────────────────────────────────────────
  const markContactRead = async (id: string) => {
    try {
      const res = await fetch(`${API}/contacts/${id}/read`, {
        method: 'PUT', headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        setContacts(prev => prev.map(c => c.id === id ? { ...c, read: true } : c));
      }
    } catch { /* silent */ }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const res = await fetch(`${API}/contacts/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) { toast.error('Failed to delete'); return; }
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Message deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const toggleContact = (id: string) => {
    if (expandedContact !== id) {
      const contact = contacts.find(c => c.id === id);
      if (contact && !contact.read) markContactRead(id);
    }
    setExpandedContact(prev => prev === id ? null : id);
  };

  // ─── Platform icon ────────────────────────────────────────────────────────────
  const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
    if (platform === 'Instagram') return <Instagram className={className} />;
    if (platform === 'TikTok') return <TikTokIcon className={className} />;
    if (platform === 'YouTube') return <Youtube className={className} />;
    return <Film className={className} />;
  };

  const platformColors: Record<string, string> = {
    Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
    TikTok: 'bg-black',
    YouTube: 'bg-red-600',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-[#B8956A] animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    );
  }

  const unreadContacts = contacts.filter(c => !c.read).length;
  const tabConfig: { id: TabType; label: string; count?: number }[] = [
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'collaborations', label: 'Collabs', count: collaborations.length },
    { id: 'videos', label: 'Videos', count: videos.length },
    { id: 'contacts', label: 'Messages', count: contacts.length },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ━━━ Header ━━━ */}
      <header className="bg-white border-b border-[#EDE8E1] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <span className="text-xl tracking-[0.1em] font-semibold text-[#1C1917]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                LIZA UGC
              </span>
            </Link>
            <span className="text-[#EDE8E1]">/</span>
            <span className="text-sm text-[#78716C] font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#78716C] border border-[#EDE8E1] rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* ━━━ Stats ━━━ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Reviews', value: reviews.length },
            { label: 'Collaborations', value: collaborations.length },
            { label: 'Videos', value: videos.length },
            { label: 'New Messages', value: unreadContacts },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-[#EDE8E1]">
              <p className="text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</p>
              <p className="text-[#78716C] text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* ━━━ Tabs ━━━ */}
        <div className="flex gap-1 bg-[#EDE8E1]/50 rounded-xl p-1 w-fit mb-8 flex-wrap">
          {tabConfig.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                tab === t.id ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                  t.id === 'contacts' && unreadContacts > 0
                    ? 'bg-[#B8956A] text-white'
                    : 'bg-[#EDE8E1] text-[#78716C]'
                }`}>
                  {t.id === 'contacts' && unreadContacts > 0 ? unreadContacts : t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ━━━ REVIEWS TAB ━━━ */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === 'reviews' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Product Reviews
              </h2>
              <button
                onClick={openAddReview}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-[#EDE8E1] py-20 text-center">
                <p className="text-[#78716C] mb-4">No reviews yet.</p>
                <button onClick={openAddReview} className="text-[#B8956A] font-medium text-sm">+ Add your first review</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reviews.map(r => (
                  <div key={r.id} className="bg-white rounded-xl border border-[#EDE8E1] overflow-hidden group">
                    <div className="aspect-[4/3] bg-[#FAF8F5] overflow-hidden relative">
                      {r.productImage ? (
                        <img src={r.productImage} alt={r.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-[#EDE8E1]">
                          <Star className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{r.brand}</p>
                      <h3 className="font-semibold text-[#1C1917] text-sm mt-0.5 mb-2">{r.productName}</h3>
                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                        ))}
                      </div>
                      {r.excerpt && <p className="text-[#78716C] text-xs line-clamp-2 mb-3">{r.excerpt}</p>}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {r.category && <span className="text-[9px] bg-[#FAF0E4] text-[#B8956A] px-2 py-0.5 rounded-full">{r.category}</span>}
                        {r.isHolyGrail && <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Holy Grail ✨</span>}
                        {r.wouldRepurchase && <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Would Repurchase</span>}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EDE8E1]">
                        <button
                          onClick={() => openEditReview(r)}
                          className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#B8956A] transition-colors px-2 py-1 rounded hover:bg-[#FAF8F5]"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ━━━ COLLABORATIONS TAB ━━━ */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === 'collaborations' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Collaborations
              </h2>
              <button
                onClick={openAddCollab}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Collaboration
              </button>
            </div>

            {collaborations.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-[#EDE8E1] py-20 text-center">
                <p className="text-[#78716C] mb-4">No collaborations yet.</p>
                <button onClick={openAddCollab} className="text-[#B8956A] font-medium text-sm">+ Add your first collaboration</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {collaborations.map(c => (
                  <div key={c.id} className="bg-white rounded-xl border border-[#EDE8E1] overflow-hidden">
                    <div className="aspect-video bg-[#FAF8F5] overflow-hidden">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.brandName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#B8956A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          {c.brandName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{c.type}</p>
                          <h3 className="font-semibold text-[#1C1917] text-sm mt-0.5">{c.campaignName || c.brandName}</h3>
                        </div>
                        {c.featured && (
                          <span className="text-[9px] tracking-widest uppercase bg-[#FAF0E4] text-[#B8956A] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">Featured</span>
                        )}
                      </div>
                      <p className="text-[#78716C] text-xs line-clamp-2 mb-4">{c.description}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#EDE8E1]">
                        <span className="text-xs text-[#78716C]">{c.year}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditCollab(c)}
                            className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#B8956A] transition-colors px-2 py-1 rounded hover:bg-[#FAF8F5]"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => deleteCollab(c.id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ━━━ VIDEOS TAB ━━━ */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === 'videos' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Videos
              </h2>
              <button
                onClick={openAddVideo}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Video
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-[#EDE8E1] py-20 text-center">
                <p className="text-[#78716C] mb-4">No videos yet.</p>
                <button onClick={openAddVideo} className="text-[#B8956A] font-medium text-sm">+ Add your first video</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map(v => (
                  <div key={v.id} className="bg-white rounded-xl border border-[#EDE8E1] overflow-hidden">
                    <div className="relative aspect-video bg-[#FAF8F5] overflow-hidden">
                      {v.thumbnail ? (
                        <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-[#EDE8E1]" />
                        </div>
                      )}
                      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-semibold ${platformColors[v.platform] || 'bg-[#B8956A]'}`}>
                        <PlatformIcon platform={v.platform} className="w-2.5 h-2.5" />
                        {v.platform}
                      </div>
                      {v.duration && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {v.duration}
                        </div>
                      )}
                      {v.featured && (
                        <div className="absolute top-2 right-2 bg-[#B8956A] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] tracking-widest uppercase text-[#B8956A] font-semibold">{v.type}</p>
                      <h3 className="font-semibold text-[#1C1917] text-sm mt-0.5 mb-2 line-clamp-2">{v.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-[#A8A29E] mb-3">
                        {v.views && <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {v.views}</span>}
                        {v.likes && <span className="flex items-center gap-0.5"><Heart className="w-3 h-3" /> {v.likes}</span>}
                        {v.date && <span>{v.date}</span>}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#EDE8E1]">
                        <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#78716C] hover:text-[#B8956A] transition-colors flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> View
                        </a>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditVideo(v)}
                            className="flex items-center gap-1 text-xs text-[#78716C] hover:text-[#B8956A] transition-colors px-2 py-1 rounded hover:bg-[#FAF8F5]"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => deleteVideo(v.id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* ━━━ CONTACTS TAB ━━━ */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {tab === 'contacts' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C1917]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Contact Messages
                {unreadContacts > 0 && (
                  <span className="ml-3 text-sm font-normal text-[#B8956A]">{unreadContacts} unread</span>
                )}
              </h2>
            </div>

            {contacts.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-[#EDE8E1] py-20 text-center">
                <Mail className="w-8 h-8 text-[#EDE8E1] mx-auto mb-3" />
                <p className="text-[#78716C]">No messages yet. They'll appear here when people reach out.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className={`bg-white rounded-xl border overflow-hidden transition-colors ${c.read ? 'border-[#EDE8E1]' : 'border-[#B8956A]/30 shadow-sm'}`}>
                    <button
                      className="w-full text-left p-5 flex items-center gap-4"
                      onClick={() => toggleContact(c.id)}
                    >
                      <div className="flex-shrink-0">
                        {c.read
                          ? <MailOpen className="w-5 h-5 text-[#A8A29E]" />
                          : <Mail className="w-5 h-5 text-[#B8956A]" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className={`font-semibold text-sm ${c.read ? 'text-[#78716C]' : 'text-[#1C1917]'}`}>{c.name}</span>
                          <span className="text-[#A8A29E] text-xs">{c.email}</span>
                          {!c.read && <span className="text-[9px] bg-[#B8956A] text-white px-2 py-0.5 rounded-full font-semibold">New</span>}
                          {c.type && c.type !== 'general' && (
                            <span className="text-[9px] bg-[#EDE8E1] text-[#78716C] px-2 py-0.5 rounded-full capitalize">{c.type}</span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${c.read ? 'text-[#A8A29E]' : 'text-[#78716C]'}`}>
                          {c.subject || c.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[11px] text-[#A8A29E] hidden md:block">
                          {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {expandedContact === c.id ? <ChevronUp className="w-4 h-4 text-[#A8A29E]" /> : <ChevronDown className="w-4 h-4 text-[#A8A29E]" />}
                      </div>
                    </button>

                    {expandedContact === c.id && (
                      <div className="px-5 pb-5 border-t border-[#EDE8E1]">
                        <div className="pt-4 space-y-3">
                          {c.subject && (
                            <div>
                              <span className="text-[11px] tracking-widest uppercase text-[#A8A29E] font-semibold">Subject</span>
                              <p className="text-sm text-[#1C1917] mt-0.5">{c.subject}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-[11px] tracking-widest uppercase text-[#A8A29E] font-semibold">Message</span>
                            <p className="text-sm text-[#1C1917] mt-0.5 whitespace-pre-wrap leading-relaxed">{c.message}</p>
                          </div>
                          {(c.company || c.service || c.budget) && (
                            <div className="flex flex-wrap gap-4">
                              {c.company && (
                                <div>
                                  <span className="text-[11px] tracking-widest uppercase text-[#A8A29E] font-semibold">Company</span>
                                  <p className="text-sm text-[#1C1917] mt-0.5">{c.company}</p>
                                </div>
                              )}
                              {c.service && (
                                <div>
                                  <span className="text-[11px] tracking-widest uppercase text-[#A8A29E] font-semibold">Service</span>
                                  <p className="text-sm text-[#1C1917] mt-0.5">{c.service}</p>
                                </div>
                              )}
                              {c.budget && (
                                <div>
                                  <span className="text-[11px] tracking-widest uppercase text-[#A8A29E] font-semibold">Budget</span>
                                  <p className="text-sm text-[#1C1917] mt-0.5">{c.budget}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-3 border-t border-[#EDE8E1]">
                            <a
                              href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject || 'Your message')}`}
                              className="flex items-center gap-2 px-4 py-2 bg-[#B8956A] text-white text-xs font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" /> Reply via Email
                            </a>
                            <button
                              onClick={() => deleteContact(c.id)}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ━━━ REVIEW MODAL (Add / Edit) ━━━ */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title={editingReview ? 'Edit Review' : 'Add New Review'}
      >
        <form onSubmit={saveReview} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Product Name" required />
              <input value={rev.productName} onChange={e => setRev(p => ({ ...p, productName: e.target.value }))} required className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Brand" />
              <input value={rev.brand} onChange={e => setRev(p => ({ ...p, brand: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel label="Product Image URL" />
            <input type="url" value={rev.productImage} onChange={e => setRev(p => ({ ...p, productImage: e.target.value }))} placeholder="https://..." className={inputCls} />
            {rev.productImage && (
              <img src={rev.productImage} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-[#EDE8E1]" />
            )}
          </div>

          <div>
            <FieldLabel label="Excerpt (short teaser for cards)" />
            <input value={rev.excerpt} onChange={e => setRev(p => ({ ...p, excerpt: e.target.value }))} className={inputCls} placeholder="A short teaser that appears on cards..." />
          </div>

          <div>
            <FieldLabel label="Full Review" required />
            <textarea value={rev.review} onChange={e => setRev(p => ({ ...p, review: e.target.value }))} required rows={5} className={inputCls + ' resize-none'} />
          </div>

          <div>
            <FieldLabel label="Rating" />
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRev(p => ({ ...p, rating: star }))}>
                  <Star className={`w-7 h-7 ${star <= rev.rating ? 'fill-[#B8956A] text-[#B8956A]' : 'text-[#E8E3DC]'}`} />
                </button>
              ))}
              <span className="text-[#78716C] text-sm ml-2">{rev.rating}/5</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Category" />
              <select value={rev.category} onChange={e => setRev(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                {reviewCategories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="Skin Type" />
              <select value={rev.skinType} onChange={e => setRev(p => ({ ...p, skinType: e.target.value }))} className={inputCls}>
                {skinTypes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Price" />
              <input value={rev.price} onChange={e => setRev(p => ({ ...p, price: e.target.value }))} placeholder="e.g. $24" className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Price Range" />
              <select value={rev.priceRange} onChange={e => setRev(p => ({ ...p, priceRange: e.target.value }))} className={inputCls}>
                {priceRanges.map(pr => <option key={pr}>{pr}</option>)}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel label="Main Skin Concern" />
            <input value={rev.concern} onChange={e => setRev(p => ({ ...p, concern: e.target.value }))} placeholder="e.g. Acne, Anti-Aging, Hyperpigmentation" className={inputCls} />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rev.wouldRepurchase} onChange={e => setRev(p => ({ ...p, wouldRepurchase: e.target.checked }))} className="accent-[#B8956A] w-4 h-4" />
              <span className="text-sm text-[#1C1917]">Would Repurchase</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rev.isHolyGrail} onChange={e => setRev(p => ({ ...p, isHolyGrail: e.target.checked }))} className="accent-[#B8956A] w-4 h-4" />
              <span className="text-sm text-[#1C1917]">Holy Grail ✨</span>
            </label>
          </div>

          <button type="submit" className="w-full py-3.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors">
            {editingReview ? 'Save Changes' : 'Add Review'}
          </button>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ━━━ COLLAB MODAL (Add / Edit) ━━━ */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Modal
        open={collabOpen}
        onClose={() => setCollabOpen(false)}
        title={editingCollab ? 'Edit Collaboration' : 'Add New Collaboration'}
      >
        <form onSubmit={saveCollab} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Brand Name" required />
              <input value={collab.brandName} onChange={e => setCollab(p => ({ ...p, brandName: e.target.value }))} required className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Campaign Name" />
              <input value={collab.campaignName} onChange={e => setCollab(p => ({ ...p, campaignName: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel label="Campaign Thumbnail URL" />
            <input type="url" value={collab.thumbnail} onChange={e => setCollab(p => ({ ...p, thumbnail: e.target.value }))} placeholder="https://..." className={inputCls} />
            {collab.thumbnail && (
              <img src={collab.thumbnail} alt="Preview" className="mt-2 h-20 rounded-lg object-cover border border-[#EDE8E1]" />
            )}
          </div>

          <div>
            <FieldLabel label="Brand Logo URL" />
            <input type="url" value={collab.brandLogo} onChange={e => setCollab(p => ({ ...p, brandLogo: e.target.value }))} placeholder="https://..." className={inputCls} />
          </div>

          <div>
            <FieldLabel label="Description" required />
            <textarea value={collab.description} onChange={e => setCollab(p => ({ ...p, description: e.target.value }))} required rows={3} className={inputCls + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Type" />
              <select value={collab.type} onChange={e => setCollab(p => ({ ...p, type: e.target.value }))} className={inputCls}>
                {collabTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="Year" />
              <input value={collab.year} onChange={e => setCollab(p => ({ ...p, year: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel label="Platforms" />
            <div className="flex gap-4">
              {platforms.map(p => (
                <label key={p} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={collab.platforms.includes(p)} onChange={() => togglePlatform(p)} className="accent-[#B8956A]" />
                  <span className="text-sm text-[#1C1917]">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Reach" />
              <input value={collab.metricsReach} onChange={e => setCollab(p => ({ ...p, metricsReach: e.target.value }))} placeholder="e.g. 1.2M" className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Engagement" />
              <input value={collab.metricsEngagement} onChange={e => setCollab(p => ({ ...p, metricsEngagement: e.target.value }))} placeholder="e.g. 8.4%" className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Impressions" />
              <input value={collab.metricsImpressions} onChange={e => setCollab(p => ({ ...p, metricsImpressions: e.target.value }))} placeholder="e.g. 3.8M" className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel label="Testimonial Quote" />
            <textarea value={collab.testimonialQuote} onChange={e => setCollab(p => ({ ...p, testimonialQuote: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Testimonial Author" />
              <input value={collab.testimonialAuthor} onChange={e => setCollab(p => ({ ...p, testimonialAuthor: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Author Title" />
              <input value={collab.testimonialTitle} onChange={e => setCollab(p => ({ ...p, testimonialTitle: e.target.value }))} className={inputCls} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={collab.featured} onChange={e => setCollab(p => ({ ...p, featured: e.target.checked }))} className="accent-[#B8956A] w-4 h-4" />
            <span className="text-sm text-[#1C1917] font-medium">Feature on homepage & collaborations page</span>
          </label>

          <button type="submit" className="w-full py-3.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors">
            {editingCollab ? 'Save Changes' : 'Add Collaboration'}
          </button>
        </form>
      </Modal>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* ━━━ VIDEO MODAL (Add / Edit) ━━━ */}
      {/* ══════════════════════════════════════════════════════════ */}
      <Modal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        title={editingVideo ? 'Edit Video' : 'Add New Video'}
      >
        <form onSubmit={saveVideo} className="space-y-5">
          <div>
            <FieldLabel label="Video Title" required />
            <input value={vid.title} onChange={e => setVid(p => ({ ...p, title: e.target.value }))} required className={inputCls} placeholder="e.g. My 5-Step Evening Routine" />
          </div>

          <div>
            <FieldLabel label="Video URL" required />
            <input type="url" value={vid.url} onChange={e => setVid(p => ({ ...p, url: e.target.value }))} required placeholder="https://www.youtube.com/watch?v=..." className={inputCls} />
          </div>

          <div>
            <FieldLabel label="Thumbnail URL" />
            <input type="url" value={vid.thumbnail} onChange={e => setVid(p => ({ ...p, thumbnail: e.target.value }))} placeholder="https://..." className={inputCls} />
            {vid.thumbnail && (
              <img src={vid.thumbnail} alt="Preview" className="mt-2 h-24 rounded-lg object-cover border border-[#EDE8E1]" />
            )}
          </div>

          <div>
            <FieldLabel label="Description" />
            <textarea value={vid.description} onChange={e => setVid(p => ({ ...p, description: e.target.value }))} rows={3} className={inputCls + ' resize-none'} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel label="Platform" required />
              <select value={vid.platform} onChange={e => setVid(p => ({ ...p, platform: e.target.value }))} className={inputCls}>
                {platforms.map(pl => <option key={pl}>{pl}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel label="Content Type" />
              <select value={vid.type} onChange={e => setVid(p => ({ ...p, type: e.target.value }))} className={inputCls}>
                {videoTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel label="Views" />
              <input value={vid.views} onChange={e => setVid(p => ({ ...p, views: e.target.value }))} placeholder="e.g. 1.2M" className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Likes" />
              <input value={vid.likes} onChange={e => setVid(p => ({ ...p, likes: e.target.value }))} placeholder="e.g. 98K" className={inputCls} />
            </div>
            <div>
              <FieldLabel label="Duration" />
              <input value={vid.duration} onChange={e => setVid(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 12:34" className={inputCls} />
            </div>
          </div>

          <div>
            <FieldLabel label="Date Published" />
            <input value={vid.date} onChange={e => setVid(p => ({ ...p, date: e.target.value }))} placeholder="e.g. Mar 2025" className={inputCls} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={vid.featured} onChange={e => setVid(p => ({ ...p, featured: e.target.checked }))} className="accent-[#B8956A] w-4 h-4" />
            <span className="text-sm text-[#1C1917] font-medium">Feature this video (shows in "Trending" section)</span>
          </label>

          <button type="submit" className="w-full py-3.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors">
            {editingVideo ? 'Save Changes' : 'Add Video'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
