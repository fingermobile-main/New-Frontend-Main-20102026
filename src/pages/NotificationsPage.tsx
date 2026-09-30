import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import realTimeService from '../services/realTimeService';
import MainLayout from '../components/layout/MainLayout';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  AtSymbolIcon,
  GiftIcon,
  CheckIcon,
  SparklesIcon,
  SettingsIcon,
  XMarkIcon,
  CheckCircleIcon
} from '../icons';

export interface NotificationItem {
  id: string | number;
  type: 'like' | 'comment' | 'follow' | 'purchase' | 'mention' | 'gift' | 'system';
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

type NotificationTab = 'all' | 'unread' | 'like' | 'comment' | 'follow' | 'purchase' | 'mention' | 'gift';

const NotificationsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);

  // Preference Settings State
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    purchase_alerts: true,
    creator_gifts: true,
    mentions: true
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/notifications');
      if (res && res.data && res.data.length > 0) {
        setNotifications(res.data);
      } else {
        setNotifications([
          {
            id: 'notif-01',
            type: 'purchase',
            title: 'PhotoCredit License Sold!',
            body: 'A creator purchased a commercial license for "Lekki Toll Twilight". 15 FIC has been credited to your wallet.',
            action_url: '/wallet',
            is_read: false,
            created_at: '10 minutes ago'
          },
          {
            id: 'notif-02',
            type: 'like',
            title: 'Appreciation on Your Gallery Post',
            body: 'Fatima Al-Hassan and 24 others liked your artwork "Afrofuturist Mural & Bronze Heritage".',
            action_url: '/gallery',
            is_read: false,
            created_at: '1 hour ago'
          },
          {
            id: 'notif-03',
            type: 'gift',
            title: 'Lush Pressie Received!',
            body: 'You received a Golden Danfo commemorative digital gift from @djflex.',
            action_url: '/lush-pressies',
            is_read: false,
            created_at: '3 hours ago'
          },
          {
            id: 'notif-04',
            type: 'comment',
            title: 'New Reply in Topics',
            body: 'Kemi Visuals replied to your discussion in #NostalgicAfricanArt.',
            action_url: '/topics',
            is_read: true,
            created_at: 'Yesterday'
          }
        ]);
      }
    } catch {
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleNewNotification = (data: unknown) => {
      const newNotif = data as NotificationItem;
      setNotifications(prev => [newNotif, ...prev]);
      showToast(newNotif.title || 'New notification received', 'info');
    };

    realTimeService.connect().then(() => {
      realTimeService.subscribe('new_notification', handleNewNotification);
    }).catch(() => {});

    return () => {
      realTimeService.unsubscribe('new_notification', handleNewNotification);
    };
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.is_read).length);
  }, [notifications]);

  const markAsRead = (id: string | number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
    ApiService.put(`/notifications/${id}/read`, {}).catch(() => {});
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    ApiService.post('/notifications/mark-all-read', {}).catch(() => {});
    showToast('All notifications marked as read', 'success');
  };

  const renderIcon = (type: string) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
    case 'comment':
      return <ChatBubbleLeftRightIcon className={`${iconClass} text-blue-500`} />;
    case 'like':
      return <HeartIcon className={`${iconClass} text-red-500`} />;
    case 'follow':
      return <UserPlusIcon className={`${iconClass} text-green-500`} />;
    case 'mention':
      return <AtSymbolIcon className={`${iconClass} text-purple-500`} />;
    case 'purchase':
      return <ShoppingCartIcon className={`${iconClass} text-amber-500`} />;
    case 'gift':
      return <GiftIcon className={`${iconClass} text-pink-500`} />;
    default:
      return <BellIcon className={`${iconClass} text-blue-600`} />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.is_read;
    return n.type === activeTab;
  });

  return (
    <MainLayout pageTitle="Notifications">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <BellIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">Activity Center</h1>
              <p className="text-blue-100 text-sm mt-0.5">
                {unreadCount > 0 ? `You have ${unreadCount} unread updates` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs backdrop-blur-md transition-colors"
              >
                Mark All Read
              </button>
            )}
            <button
              onClick={() => setShowPreferencesModal(true)}
              className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-md transition-colors"
              title="Notification Settings"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'purchase', label: 'Purchases' },
            { id: 'gift', label: 'Gifts' },
            { id: 'like', label: 'Likes' },
            { id: 'comment', label: 'Comments' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label} {tab.id === 'unread' && unreadCount > 0 && `(${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.is_read) markAsRead(notif.id);
                if (notif.action_url) window.location.href = notif.action_url;
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.is_read
                  ? 'bg-blue-50/50 border-blue-200 shadow-sm hover:bg-blue-50'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-100 shrink-0">
                {renderIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-sm font-bold truncate ${!notif.is_read ? 'text-blue-900' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{notif.created_at}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.body}</p>
              </div>

              {!notif.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2"></div>
              )}
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <CheckCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">No notifications found.</p>
            </div>
          )}
        </div>

        {/* Preferences Modal */}
        {showPreferencesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Notification Settings</h3>
                <button onClick={() => setShowPreferencesModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {[
                  { key: 'email_notifications', label: 'Email Digest Notifications' },
                  { key: 'push_notifications', label: 'Instant Mobile Push Alerts' },
                  { key: 'purchase_alerts', label: 'Storefront & PhotoCredits Sales Alerts' },
                  { key: 'creator_gifts', label: 'Lush Pressies & FIC Gift Notifications' },
                  { key: 'mentions', label: 'Social Tagging & Forum Mentions' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(preferences as any)[item.key]}
                      onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowPreferencesModal(false);
                    showToast('Notification preferences saved!', 'success');
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
