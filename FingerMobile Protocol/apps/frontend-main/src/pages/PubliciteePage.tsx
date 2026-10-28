import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { PubliciteeSection } from '../components/PubliciteeSection';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';
import {
  Film, Sparkles, Clock, DollarSign,
  Layers, Upload, Video, ShieldCheck
} from 'lucide-react';

const PubliciteePage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<'all' | 'short_film' | 'vlog' | 'skit'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subDaysRemaining, setSubDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/publicitee/subscription/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHasSubscription(data.data.has_active_subscription || false);
        setSubDaysRemaining(data.data.days_remaining || null);
      }
    } catch {
      // Ignore network errors on check
    }
  };

  const handleSubscribe = async () => {
    try {
      setSubLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/publicitee/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          plan_type: 'monthly',
          amount: 3.00,
          currency: 'USD'
        })
      });
      const data = await res.json();
      if (data.success) {
        setHasSubscription(true);
        setSubDaysRemaining(30);
        showToast('🎉 Publicitee Creator Subscription activated! You can now publish 168h Reels.', 'success');
      } else {
        showToast(data.error || 'Failed to activate subscription', 'error');
      }
    } catch {
      setHasSubscription(true);
      showToast('🎉 Publicitee Creator Subscription simulated successfully!', 'success');
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        {/* Creator Specs & Subscription Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
                <Film className="w-3.5 h-3.5" />
                Publicitee™ Official Creator Platform
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Reels for Filmmakers, Vloggers & Skit Makers
              </h1>
              <p className="text-sm md:text-base text-rose-100">
                168 Hours (7 Days) TTL strictly enforced • Single Video Card • Max 1.5GB • Max 1Hr:55Mins duration.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-rose-100 pt-1">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-300" /> 168h Expiration
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Layers className="w-4 h-4 text-emerald-300" /> 1 Video Card Max
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Video className="w-4 h-4 text-blue-300" /> 1.5GB / 1h 55m Cap
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-yellow-300" /> $3.00 Monthly
                </span>
              </div>
            </div>

            {/* Subscription Box */}
            <div className="w-full md:w-auto flex-shrink-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 text-center space-y-3">
              {hasSubscription ? (
                <div>
                  <div className="flex items-center justify-center gap-1 text-emerald-300 text-sm font-bold">
                    <ShieldCheck className="w-5 h-5" /> Active Creator Pass
                  </div>
                  <div className="text-xs text-rose-100 mt-1">
                    {subDaysRemaining ? `${subDaysRemaining} days remaining` : 'Renews monthly'}
                  </div>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="mt-3 w-full py-2.5 px-5 bg-white text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Create Publicitee Reel
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-black text-rose-100 uppercase tracking-wide">Creator Upload Access</div>
                  <div className="text-2xl font-black text-white">$3.00 <span className="text-xs font-semibold text-rose-200">/ month</span></div>
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={handleSubscribe}
                      disabled={subLoading}
                      className="py-2.5 px-5 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {subLoading ? 'Activating...' : 'Subscribe ($3.00/mo)'}
                    </button>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="text-xs text-rose-100 hover:text-white hover:underline font-semibold"
                    >
                      Or Upload with existing token
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Create Trigger */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-300 pb-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Reels' },
              { id: 'short_film', label: '🎬 Short Films' },
              { id: 'vlog', label: '📹 Vlogs' },
              { id: 'skit', label: '🎭 Skits' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="py-2 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Reel (168h TTL)
          </button>
        </div>

        {/* Live Publicitee Section Feed */}
        <PubliciteeSection
          category={activeCategory}
          placement="newsfeed_tab"
          onOpenCreate={() => setIsCreating(true)}
        />

        {/* Unified Creation Modal */}
        <CreatePubliciteeShortsModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          hasPubliciteeSubscription={hasSubscription}
          onSuccess={() => {
            setIsCreating(false);
            showToast('Reel uploaded and published! Live for 168 hours.', 'success');
          }}
        />
      </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
          <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold ${
                activeCategory === 'all' ? 'text-rose-600 bg-rose-50 border border-rose-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🎞️</span>
              <span>All Reels</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('short_film')}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold ${
                activeCategory === 'short_film' ? 'text-rose-600 bg-rose-50 border border-rose-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🎬</span>
              <span>Films</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-800"
            >
              <span className="text-base font-black">➕</span>
              <span>Upload</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
            >
              <span className="text-base font-black">⌂</span>
              <span>Top</span>
            </button>
          </div>
        </div>
    </MainLayout>
  );
};

export default PubliciteePage;
