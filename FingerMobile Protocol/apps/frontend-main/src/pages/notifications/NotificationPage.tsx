import React, { useEffect, useState } from 'react';
interface Notification {
  id: number;
  title: string;
  content: string;
  date: string;
  read: boolean;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Simulate fetching notifications
  useEffect(() => {
    // In a real app, this would be an API call to fetch notifications
    const mockNotifications = [
      { id: 1, title: 'New Message', content: 'You have received a new message', date: '2023-06-15', read: false },
      { id: 2, title: 'System Update', content: 'Platform will undergo maintenance tonight', date: '2023-06-14', read: true },
      { id: 3, title: 'Security Alert', content: 'New login detected from a different device', date: '2023-06-13', read: true }
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id} className={`notification ${!notification.read ? 'unread' : ''}`}>
              <div className="notification-header">
                <h3>{notification.title}</h3>
                <span className="date">{notification.date}</span>
              </div>
              <p>{notification.content}</p>
              <div className="notification-actions">
                {!notification.read && (
                  <button onClick={() => markAsRead(notification.id)}>Mark as Read</button>
                )}
                <button onClick={() => deleteNotification(notification.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No notifications at this time.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
