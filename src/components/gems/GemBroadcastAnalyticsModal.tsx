import React from 'react';
import { BroadcastPost } from './types';
import {
  BarChart3,
  X,
  Clock,
  Eye,
  MessageSquare,
  Bot,
  Radio,
  Sparkles,
  TrendingUp,
  Share2,
  CheckCircle2
} from 'lucide-react';

interface GemBroadcastAnalyticsModalProps {
  post: BroadcastPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GemBroadcastAnalyticsModal: React.FC<GemBroadcastAnalyticsModalProps> = ({
  post,
  isOpen,
  onClose
}) => {
  if (!isOpen || !post) return null;

  const analytics = post.analytics || {
    broadcastId: post.id,
    totalImpressions: 1840,
    openRate: 82.5,
    directReplyRate: 21.4,
    autoRepliesTriggered: 64,
    autoRepliesBreakdown: {
      greeting: 28,
      away: 14,
      quickReplies: 16,
      eventManagement: 6
    },
    ignoredCount: 9,
    topChannels: [
      { channel: post.channel_name || '#general-living-room', reach: 890 },
      { channel: '#general-living-room', reach: 560 },
      { channel: '@direct-member-walls', reach: 390 }
    ],
    hourlyEngagement: [
      { hour: '0h-4h', views: 580 },
      { hour: '4h-8h', views: 420 },
      { hour: '8h-12h', views: 290 },
      { hour: '12h-16h', views: 180 },
      { hour: '16h-20h', views: 120 },
      { hour: '20h-24h', views: 60 }
    ],
    sentimentSummary: {
      positive: 78,
      neutral: 18,
      inquiry: 4
    }
  };

  const autoRepliesTotal = analytics.autoRepliesTriggered;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col justify-between overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/20">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>Sender Analytics Response Console</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                    24h TTL Live Telemetry
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Real-time member wall reception, response velocity, and auto-replies audit
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Broadcast Overview Card */}
          <div className="my-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white">Broadcast #{post.id}</span>
                <span className="text-slate-300">•</span>
                <span className="text-purple-400 font-semibold">{post.channel_name}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Transmitted
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 italic max-w-xl">
                "{post.content_text}"
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <Clock className="w-3 h-3" /> 24h Ephemeral Window
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>Total Impressions</span>
              </div>
              <div className="text-2xl font-black text-white">
                {analytics.totalImpressions.toLocaleString()}
              </div>
              <div className="text-[10px] text-purple-300 mt-1 font-semibold">Active follower walls</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open / Read Rate</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {analytics.openRate}%
              </div>
              <div className="text-[10px] text-slate-300 mt-1 font-semibold">+14% vs ecosystem avg</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                <span>Direct Reply Rate</span>
              </div>
              <div className="text-2xl font-black text-sky-400">
                {analytics.directReplyRate}%
              </div>
              <div className="text-[10px] text-slate-300 mt-1 font-semibold">Inquiries received</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-300 text-xs font-semibold mb-1">
                <Bot className="w-3.5 h-3.5 text-teal-400" />
                <span>Auto-Replies</span>
              </div>
              <div className="text-2xl font-black text-teal-300">
                {analytics.autoRepliesTriggered}
              </div>
              <div className="text-[10px] text-slate-300 mt-1 font-semibold">Automated responses</div>
            </div>
          </div>

          {/* Auto-Replies Breakdown & Channel Reach */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Breakdown of Auto-Replies Triggered */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-teal-400" />
                  Auto-Replies Breakdown ({autoRepliesTotal})
                </h4>
                <span className="text-[10px] text-teal-400 font-bold">100% Automated</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-purple-400" /> Greeting (First Contact / 14d)
                  </span>
                  <span className="font-bold text-white">{analytics.autoRepliesBreakdown.greeting}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${(analytics.autoRepliesBreakdown.greeting / autoRepliesTotal) * 100}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-400" /> Away (After-Hours & Holiday)
                  </span>
                  <span className="font-bold text-white">{analytics.autoRepliesBreakdown.away}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${(analytics.autoRepliesBreakdown.away / autoRepliesTotal) * 100}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-3 h-3 text-sky-400" /> Quick Replies (/pricing, /hours)
                  </span>
                  <span className="font-bold text-white">{analytics.autoRepliesBreakdown.quickReplies}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-500 h-full rounded-full"
                    style={{
                      width: `${(analytics.autoRepliesBreakdown.quickReplies / autoRepliesTotal) * 100}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-emerald-400" /> Event Management Suite
                  </span>
                  <span className="font-bold text-white">{analytics.autoRepliesBreakdown.eventManagement}</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${(analytics.autoRepliesBreakdown.eventManagement / autoRepliesTotal) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Channel Reach & 24h Velocity */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                Channel Reach & 24h Engagement Decay
              </h4>

              <div className="space-y-2 text-xs">
                {analytics.topChannels.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-900 text-slate-300">
                    <span className="font-mono text-purple-300">{item.channel}</span>
                    <span className="font-bold text-white">{item.reach.toLocaleString()} views</span>
                  </div>
                ))}
              </div>

              {/* Engagement decay velocity blocks */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-300 block mb-2 font-semibold">
                  Hourly Views Distribution (Peak at Transmit):
                </span>
                <div className="grid grid-cols-6 gap-1 text-center">
                  {analytics.hourlyEngagement.map((h, i) => (
                    <div key={i} className="bg-slate-900 rounded-lg p-1.5 border border-slate-800">
                      <div className="text-[9px] text-slate-300 font-semibold">{h.hour}</div>
                      <div className="text-xs font-bold text-purple-300">{h.views}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-300 font-medium">
            FingerMobile Protocol™ Sovereign Broadcast Telemetry Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
