import React, { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, TrashIcon, ChatBubbleLeftRightIcon, GiftIcon, HeartIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: string;
  type: 'match' | 'message' | 'gift' | 'like' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;
  referenceId?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      title: 'New Match!',
      message: 'You matched with Alex Johnson. Send a gift to start chatting!',
      timestamp: '2 hours ago',
      isRead: false,
      actorName: 'Alex Johnson',
      actorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      type: 'gift',
      title: 'Gift Received',
      message: 'Sarah sent you a Virtual Plushie Gift!',
      timestamp: '1 day ago',
      isRead: false,
      actorName: 'Sarah',
      actorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Michael replied to your message',
      timestamp: '2 days ago',
      isRead: true,
      actorName: 'Michael',
      actorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      id: '4',
      type: 'like',
      title: 'Profile Liked',
      message: 'Emma liked your profile',
      timestamp: '3 days ago',
      isRead: true,
      actorName: 'Emma',
      actorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: '5',
      type: 'system',
      title: 'System Update',
      message: 'New privacy features are now available in settings',
      timestamp: '1 week ago',
      isRead: true
    }
  ]);
  const [loading, setLoading] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? {...n, isRead: true} : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
    case 'match':
      return <HeartIcon className="h-5 w-5 text-rose-500" />;
    case 'message':
      return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />;
    case 'gift':
      return <GiftIcon className="h-5 w-5 text-amber-500" />;
    case 'like':
      return <HeartIcon className="h-5 w-5 text-pink-500" />;
    default:
      return <BellIcon className="h-5 w-5 text-slate-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-300 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-slate-700">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark all as read
              </button>
              <button
                onClick={deleteAllNotifications}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear all
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <BellIcon className="mx-auto h-12 w-12 text-slate-700" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-slate-700">Check back later for updates.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                >
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {notification.actorAvatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={notification.actorAvatar}
                          alt={notification.actorName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center border text-gray-950 border-gray-400 font-black">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-700">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-700">
                        {notification.timestamp}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      {!notification.isRead && (
                        <button type="button" aria-label="Confirm"
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center p-1 text-sm font-medium text-slate-700 hover:text-gray-700"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      <button type="button" aria-label="Delete"
                        onClick={() => deleteNotification(notification.id)}
                        className="inline-flex items-center p-1 text-sm font-medium text-slate-700 hover:text-red-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
