import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/admin/login', {
        email: email.trim(),
        password
      });

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        if (response.data.user) {
          localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        }
        navigate('/admin/dashboard');
      } else {
        throw new Error('Authentication token missing in server response');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid administrator credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Gateway</h2>
          <p className="text-xs text-slate-300 mt-1 uppercase tracking-wider font-semibold">
            FingerMobile Protocol Control Plane
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800/80 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 top-3" />
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fingermobileprotocol.com"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 top-3" />
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* SOVEREIGN MOBILE QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 px-3 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <ShieldCheck className="w-5 h-5 mb-0.5 text-indigo-400" />
            <span className="text-[10px] leading-tight">Home</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-lg text-indigo-400 font-bold bg-indigo-950/40 transition-colors"
          >
            <Lock className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight">User Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
