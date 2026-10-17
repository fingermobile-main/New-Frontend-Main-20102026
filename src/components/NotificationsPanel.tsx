import React, {} from 'react';


interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  link?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAsRead
}) => {
  const handleNotificationClick = (id: string, link?: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
    if (link) {
      window.location.href = link; // WARNING: Potential XSS vulnerability. Validate redirect URLs.
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons: Record<Notification['type'], string> = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      message: '📧',
      system: '🔔'
    };
    return icons[type] || '🔔';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose} role="button" tabIndex={0}>
      <div className="flex items-start justify-end min-h-screen">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        <div
          className="relative bg-white shadow-xl max-w-md w-full max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()} role="button" tabIndex={0}
        >
          <div className="sticky top-0 bg-white border-b border-slate-300 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button onClick={onClose} className="text-slate-700 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-700">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id, notification.link)} role="button" tabIndex={0}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-700 mt-1">{notification.timestamp}</p>
                    </div>
                    {!notification.isRead && (
                      <span className="h-2 w-2 bg-brand-blue rounded-full flex-shrink-0 mt-2"></span>
                    )}
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

export default NotificationsPanel;
