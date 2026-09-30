import React, { useState, useEffect } from 'react';
import { XIcon } from '../icons';

export interface PeripheralNotificationItem {
  id: string;
  title: string;
  snippet: string;
  urgency: 'low' | 'info' | 'high';
  displayWindowSeconds: number;
  edgeGlowColor?: string;
  timestamp?: string;
}

export const PeripheralNotificationShade: React.FC = () => {
  const [activeNotification, setActiveNotification] = useState<PeripheralNotificationItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Poll peripheral notifications queue every 30 seconds
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/v1/vault/anticipation/notifications/peripheral');
        if (res.ok) {
          const data = await res.json();
          if (data.data?.notifications?.length > 0) {
            const notif = data.data.notifications[0];
            setActiveNotification(notif);
            setIsVisible(true);

            // Auto dismiss after specified window (5-7 seconds)
            const ttl = (notif.displayWindowSeconds || 6) * 1000;
            setTimeout(() => {
              setIsVisible(false);
            }, ttl);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };

    const initialTimer = setTimeout(fetchNotifications, 5000);
    const interval = setInterval(fetchNotifications, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible || !activeNotification) return null;

  const glowColor = activeNotification.edgeGlowColor || '#f59e0b';

  return (
    <aside
      aria-label="System notifications"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full transition-all duration-500 transform translate-y-0 opacity-100"
      style={{
        filter: `drop-shadow(0 0 16px ${glowColor}40)`
      }}
    >
      <div
        className="rounded-2xl p-4 bg-slate-900/95 border backdrop-blur-xl shadow-2xl flex items-start gap-3 relative overflow-hidden"
        style={{ borderColor: `${glowColor}60` }}
      >
        {/* Subtle Edge Glow Bar */}
        <div
          className="absolute top-0 left-0 bottom-0 w-1.5"
          style={{ backgroundColor: glowColor }}
        />

        <div className="flex-1 pl-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: glowColor }}
              />
              {activeNotification.title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeNotification.displayWindowSeconds}s
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2">
            {activeNotification.snippet}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Dismiss notification"
        >
          <XIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default PeripheralNotificationShade;
