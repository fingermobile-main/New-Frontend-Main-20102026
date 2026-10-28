import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  SparklesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'info' | 'security' | 'system' | 'reward';
}

const NotificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: 1,
        title: 'New Secure Message',
        content: 'You have received an encrypted message from the Cameroon Commerce Guild.',
        date: 'Today, 10:45 AM',
        read: false,
        type: 'info'
      },
      {
        id: 2,
        title: 'Protocol Infrastructure Update',
        content: 'PostgreSQL clusters and Stercs microservices underwent high-throughput synchronization.',
        date: 'Yesterday, 3:20 PM',
        read: true,
        type: 'system'
      },
      {
        id: 3,
        title: 'Security Alert: New Sign-in',
        content: 'New Sovereign identity verification confirmed from Lagos, Nigeria via biometric key.',
        date: 'Oct 26, 2026',
        read: true,
        type: 'security'
      },
      {
        id: 4,
        title: 'FIC Staking Yield Credited',
        content: 'Your weekly yield of 42.50 FIC has been minted to your decentralized treasury wallet.',
        date: 'Oct 25, 2026',
        read: false,
        type: 'reward'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-600 flex-shrink-0">
            <BellIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Notifications
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              Protocol alerts, messages, security verification, and rewards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-3.5 py-2 min-h-[44px] rounded-xl bg-orange-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`px-3.5 py-2 min-h-[44px] rounded-xl border font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-orange-50 border-orange-400 text-orange-950'
                : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FunnelIcon className="w-4 h-4" />
            <span>{filter === 'unread' ? 'Show All' : `Unread (${unreadCount})`}</span>
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                notification.read
                  ? 'bg-white border-slate-300 opacity-90'
                  : 'bg-orange-50/50 border-orange-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5">
                    {notification.type === 'security' ? (
                      <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                    ) : notification.type === 'system' ? (
                      <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                    ) : notification.type === 'reward' ? (
                      <SparklesIcon className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-950 border border-orange-400">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mt-1">
                      {notification.content}
                    </p>
                    <span className="inline-block text-xs font-bold text-slate-700 mt-2">
                      {notification.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 transition-colors"
                      title="Mark as Read"
                      aria-label="Mark as Read"
                    >
                      <CheckIcon className="w-4 h-4 text-emerald-600" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 border border-slate-300 hover:bg-red-50 transition-colors"
                    title="Delete Notification"
                    aria-label="Delete Notification"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-300">
            <BellIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Notifications</h3>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              You are all caught up! No notifications to display.
            </p>
          </div>
        )}
      </div>

      {/* MOBILE NAVIGATION QUICK DOCK */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          type="button"
          onClick={markAllAsRead}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-orange-600 bg-orange-50 transition-colors"
        >
          <CheckIcon className="w-5 h-5 mb-0.5" />
          <span>Mark Read</span>
        </button>
        <button
          type="button"
          onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <FunnelIcon className="w-5 h-5 mb-0.5" />
          <span>Filter</span>
        </button>
        <button
          type="button"
          onClick={clearAllNotifications}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-red-700 transition-colors"
        >
          <TrashIcon className="w-5 h-5 mb-0.5" />
          <span>Clear All</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <SparklesIcon className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationPage;
