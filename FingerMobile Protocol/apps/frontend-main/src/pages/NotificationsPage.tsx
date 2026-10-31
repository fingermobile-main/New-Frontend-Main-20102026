import React, { useState, useEffect, useCallback } from 'react';
import { BellIcon, CheckIcon, TrashIcon, ChatBubbleLeftRightIcon, GiftIcon, HeartIcon } from '@heroicons/react/24/outline';
import { api } from '../services/api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  referenceId?: string;
}

interface RawNotification {
  id: string;
  type: string;
  title: string;
  message?: string;
  created_at: string;
  is_read: boolean;
  actor_id?: string;
  actor_username?: string;
  actor_display_name?: string;
  actor_avatar_url?: string;
  reference_id?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications?limit=50');
      if (res.data?.success && Array.isArray(res.data.notifications)) {
        const mapped: Notification[] = res.data.notifications.map((n: RawNotification) => ({
          id: n.id,
          type: n.type || 'system',
          title: n.title,
          message: n.message || '',
          timestamp: new Date(n.created_at).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          isRead: Boolean(n.is_read),
          actorId: n.actor_id,
          actorName: n.actor_display_name || n.actor_username || 'Someone',
          actorAvatar: n.actor_avatar_url,
          referenceId: n.reference_id,
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.debug('Failed to fetch persistent notifications, keeping existing:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  const deleteAllNotifications = async () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <HeartIcon className="h-6 w-6 text-pink-500" />;
      case 'gift':
        return <GiftIcon className="h-6 w-6 text-purple-500" />;
      case 'message':
      case 'comment':
      case 'mention':
        return <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500" />;
      case 'like':
        return <HeartIcon className="h-6 w-6 text-rose-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <BellIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
                <p className="text-xs text-slate-700">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 transition-colors"
                >
                  <CheckIcon className="h-4 w-4 mr-1 text-emerald-600" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={deleteAllNotifications}
                  className="inline-flex items-center px-3 py-1.5 border border-rose-300 rounded-lg text-xs font-semibold text-rose-700 bg-white hover:bg-rose-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-1 text-rose-600" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-slate-200">
            {loading ? (
              <div className="py-12 text-center text-sm font-medium text-slate-600">
                Loading live notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-16 text-center">
                <BellIcon className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <h3 className="text-sm font-semibold text-slate-900">No notifications yet</h3>
                <p className="text-xs text-slate-700 mt-1 max-w-sm mx-auto">
                  Interactions like comments, mentions, likes, and messages will arrive here in real time.
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 sm:p-5 flex items-start space-x-4 transition-colors ${
                    notification.isRead ? 'bg-white' : 'bg-indigo-50/40'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {notification.actorAvatar ? (
                      <img
                        src={notification.actorAvatar}
                        alt={notification.actorName || 'User'}
                        className="h-10 w-10 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="p-2 bg-slate-100 rounded-full border border-slate-200">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {notification.title}
                      </p>
                      <span className="text-xs text-slate-600 whitespace-nowrap ml-2">
                        {notification.timestamp}
                      </span>
                    </div>
                    {notification.message && (
                      <p className="mt-1 text-xs text-slate-800 line-clamp-2">
                        {notification.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        type="button"
                        aria-label="Mark notification as read"
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label="Delete notification"
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all disabled:opacity-40"
          >
            <CheckIcon className="w-5 h-5 mb-0.5 text-sky-600" />
            <span>Read All</span>
          </button>
          <button
            type="button"
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-900 transition-all disabled:opacity-40"
          >
            <TrashIcon className="w-5 h-5 mb-0.5 text-rose-600" />
            <span>Clear</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all"
          >
            <BellIcon className="w-5 h-5 mb-0.5 text-slate-600" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
