import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); return; }
      if (data.session) { toast.success('Welcome back!'); navigate('/admin'); }
    } catch {
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block">
            <span
              className="text-3xl tracking-[0.12em] font-semibold text-[#1C1917]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              LIZA UGC
            </span>
            <span className="block text-[9px] tracking-[0.25em] uppercase text-[#B8956A] font-medium mt-0.5">
              Skin & Beauty
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#EDE8E1] p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1C1917] mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Admin Sign In
            </h1>
            <p className="text-[#78716C] text-sm">
              Sign in to manage your content.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#1C1917] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#B8956A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase font-semibold text-[#1C1917] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#EDE8E1] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#B8956A] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#B8956A] text-white text-sm font-semibold rounded-lg hover:bg-[#9E7A56] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#B8956A] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}