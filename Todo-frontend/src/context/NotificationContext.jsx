import { createContext, useState, useEffect, useContext } from 'react';
import { getNotifications, markNotificationsAsRead } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Fetch notifications periodically (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNotifications();
      
      if (response.data) {
        setNotifications(response.data);
        // Count unread notifications
        const unread = response.data.filter(notif => !notif.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds) => {
    try {
      setLoading(true);
      setError(null);
      
      // If no ids provided, mark all as read
      const ids = notificationIds || notifications.filter(n => !n.read).map(n => n._id);
      
      if (ids.length === 0) return;
      
      await markNotificationsAsRead(ids);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          ids.includes(notif._id) ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - ids.length));
      
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      setError('Failed to mark notifications as read');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationContext; 