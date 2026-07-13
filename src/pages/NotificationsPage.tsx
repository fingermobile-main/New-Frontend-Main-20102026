import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import realTimeService from '../services/realTimeService';
import MainLayout from '../components/layout/MainLayout';
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
  BoltIcon
} from '../icons';

const NotificationsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('all');
  const [unreadCount, setUnreadCount] = React.useState(2);
  const [isConnected, setIsConnected] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 1,
      type: 'like',
      member: 'Taylor Swift',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'liked your post',
      content: 'New music production tutorial released!',
      timestamp: '2 min ago',
      isRead: false
    },
    {
      id: 2,
      type: 'comment',
      member: 'Alex Johnson',
      memberAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'commented on your post',
      content: 'Great tutorial! Can you make one about mixing vocals?',
      timestamp: '15 min ago',
      isRead: false
    },
    {
      id: 3,
      type: 'follow',
      member: 'DJ Pulse',
      memberAvatar: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'started following you',
      content: '',
      timestamp: '1 hour ago',
      isRead: true
    },
    {
      id: 4,
      type: 'purchase',
      member: 'Music Producer Pro',
      memberAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'purchased your product',
      content: 'Summer Vibes Beat Pack',
      timestamp: '3 hours ago',
      isRead: true
    },
    {
      id: 5,
      type: 'mention',
      member: 'PixelArtist',
      memberAvatar: 'https://images.unsplash.com/photo-1543857778-c4a1a569e7bd?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'mentioned you in a comment',
      content: 'Thanks @you for the inspiration on this piece!',
      timestamp: '5 hours ago',
      isRead: true
    },
    {
      id: 6,
      type: 'gift',
      member: 'ShutterMaster',
      memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      action: 'sent you a gift',
      content: '25 FIC',
      timestamp: '1 day ago',
      isRead: true
    }
  ]);

  // Connect to real-time service
  React.useEffect(() => {
    const connectToRealTimeService = async () => {
      try {
        await realTimeService.connect();
        setIsConnected(true);
        
        // Join notifications room
        realTimeService.joinChatRoom('notifications');
        
        // Subscribe to new notifications
        realTimeService.subscribe('new_notification', (data) => {
          const newNotification = data as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        });
        
        // Subscribe to connection status
        realTimeService.subscribe('connection_status', (data) => {
          const status = data as string;
          setIsConnected(status === 'connected');
        });
      } catch (error) {
        console.error('Failed to connect to real-time service:', error);
        setIsConnected(false);
      }
    };

    connectToRealTimeService();
    
    // Cleanup
    return () => {
      realTimeService.unsubscribe('new_notification', () => {});
      realTimeService.unsubscribe('connection_status', () => {});
      realTimeService.leaveChatRoom('notifications');
    };
  }, []);

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  const unreadNotifications = notifications.filter(notification => !notification.isRead);

  const markAllAsRead = () => {
    // In a real app, this would update the backend
    setUnreadCount(0);
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    showToast("All notifications marked as read", "success");
    
    // Notify server about marking all as read
    if (isConnected) {
      realTimeService.sendChatMessage('notifications', JSON.stringify({
        event: 'mark_all_as_read'
      }));
    }
  };

  const markAsRead = (id: string | number) => {
    // In a real app, this would update the backend
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      );
      showToast("Notification marked as read", "info");
    }
    
    // Notify server about marking as read
    if (isConnected) {
      realTimeService.sendChatMessage('notifications', JSON.stringify({
        event: 'mark_as_read',
        notificationId: id
      }));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <HeartIcon className="h-5 w-5 text-red-500" />;
      case 'comment':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500" />;
      case 'follow':
        return <UserPlusIcon className="h-5 w-5 text-green-500" />;
      case 'purchase':
        return <ShoppingCartIcon className="h-5 w-5 text-purple-500" />;
      case 'mention':
        return <AtSymbolIcon className="h-5 w-5 text-indigo-500" />;
      case 'gift':
        return <GiftIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
        <div className="flex items-center">
          <div className="bg-white/20 p-2 rounded-lg">
            <BellIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="mt-1 text-blue-100">
              Stay updated with the latest activities
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <div className={`flex items-center text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {unreadCount > 0 && (
              <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark all as read
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto -mb-px px-6">
            {['all', 'like', 'comment', 'follow', 'purchase', 'mention', 'gift'].map((tab) => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-3 text-center border-b-2 font-medium text-sm capitalize flex items-center ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{getNotificationIcon(tab)}</span>
                {tab === 'all' ? 'All Notifications' : tab}
                {tab !== 'all' && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gray-400 rounded-full">
                    {notifications.filter(n => n.type === tab).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <BellIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-gray-500">
                You're all caught up! Check back later for new notifications.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} 
                className={`p-6 hover:bg-gray-50 transition ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-gray-200 rounded-full p-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">
                        <span className="font-bold">{notification.member}</span> {notification.action}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        {!notification.isRead && (
                          <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                    {notification.content && (
                      <p className="mt-1 text-sm text-gray-600">{notification.content}</p>
                    )}
                    <div className="mt-3 flex items-center justify-end">
                      <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        {notification.isRead ? 'Read' : 'Mark as read'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;