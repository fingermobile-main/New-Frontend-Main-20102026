import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import realTimeService from '../services/realTimeService';
import type { Notification } from '../types';
import {
  BellIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserPlusIcon,
  ShoppingCartIcon,
  AtSymbolIcon,
  GiftIcon,
  CheckIcon,
  SparklesIcon
} from '../icons';

type NotificationTab = 'all' | 'unread' | 'like' | 'comment' | 'follow' | 'purchase' | 'mention' | 'gift';

const NotificationsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Return SVG Icon components based on notification type
  const renderNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
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
        return <BellIcon className={`${iconClass} text-gray-500`} />;
    }
  };

  // Mark single notification as read
  const markAsRead = useCallback((id: string | number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true, read: true } : n))
    );

    showToast("Notification marked as read", "info");

    if (isConnected) {
      realTimeService.sendChatMessage('notifications', JSON.stringify({
        event: 'mark_as_read',
        notificationId: id
      }));
    }
  }, [isConnected, showToast]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true, read: true }))
    );
    showToast("All notifications marked as read", "success");

    if (isConnected) {
      realTimeService.sendChatMessage('notifications', JSON.stringify({
        event: 'mark_all_as_read'
      }));
    }
  }, [isConnected, showToast]);

  // Connect & subscribe to Realtime Service
  useEffect(() => {
    const handleNewNotification = (data: unknown) => {
      const newNotification = data as Notification;
      setNotifications(prev => [newNotification, ...prev]);
    };

    const handleConnectionStatus = (data: unknown) => {
      const status = data as string;
      setIsConnected(status === 'connected');
    };

    const connectToRealTimeService = async () => {
      try {
        await realTimeService.connect();
        setIsConnected(true);
        realTimeService.joinChatRoom('notifications');

        realTimeService.subscribe('new_notification', handleNewNotification);
        realTimeService.subscribe('connection_status', handleConnectionStatus);
      } catch (error) {
        console.error('Failed to connect to real-time service:', error);
        setIsConnected(false);
      }
    };

    connectToRealTimeService();

    return () => {
      realTimeService.unsubscribe('new_notification', handleNewNotification);
      realTimeService.unsubscribe('connection_status', handleConnectionStatus);
      realTimeService.leaveChatRoom('notifications');
    };
  }, []);

  // Sync unread counter with notifications state
  useEffect(() => {
    const count = notifications.filter(n => !(n.isRead || n.read)).length;
    setUnreadCount(count);
  }, [notifications]);

  // Filter notifications according to selected tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !(notification.isRead || notification.read);
    return notification.type === activeTab;
  });

  const availableTabs: { id: NotificationTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'like', label: 'Likes' },
    { id: 'comment', label: 'Comments' },
    { id: 'follow', label: 'Follows' },
    { id: 'purchase', label: 'Purchases' },
    { id: 'mention', label: 'Mentions' },
    { id: 'gift', label: 'Gifts' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
        <div className="flex items-center">
          <div className="bg-white/20 p-2.5 rounded-lg">
            <BellIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="mt-1 text-blue-100 text-sm sm:text-base">
              Stay updated with the latest activity across your network
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className={`flex items-center text-xs font-semibold ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {unreadCount > 0 && (
              <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <CheckIcon className="h-4 w-4 mr-2 text-gray-500" />
              Mark all as read
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px px-6 space-x-2 scrollbar-none">
            {availableTabs.map((tab) => {
              const count = tab.id === 'all'
                ? notifications.length
                : tab.id === 'unread'
                ? unreadCount
                : notifications.filter(n => n.type === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-3 text-center border-b-2 font-medium text-sm whitespace-nowrap flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{renderNotificationIcon(tab.id)}</span>
                  {tab.label}
                  {count > 0 && (
                    <span className={`ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Notification List */}
        <div className="divide-y divide-gray-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <BellIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const isRead = notification.isRead || notification.read;
              return (
                <div
                  key={notification.id}
                  className={`p-5 hover:bg-gray-50/80 transition-colors ${!isRead ? 'bg-blue-50/40' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="bg-white border border-gray-100 shadow-sm rounded-full p-2">
                        {renderNotificationIcon(notification.type)}
                      </div>
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold text-gray-900">{notification.member}</span>{' '}
                          <span className="text-gray-600">{notification.action}</span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{notification.timestamp}</span>
                          {!isRead && (
                            <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                      </div>

                      {notification.content && (
                        <p className="mt-1 text-sm text-gray-600 bg-gray-50/60 p-2.5 rounded-lg border border-gray-100">
                          {notification.content}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          disabled={isRead}
                          className={`text-xs font-medium flex items-center transition-colors ${
                            isRead
                              ? 'text-gray-400 cursor-default'
                              : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" />
                          {isRead ? 'Read' : 'Mark as read'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;