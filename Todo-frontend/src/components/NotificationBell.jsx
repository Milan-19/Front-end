import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { format, isToday, isYesterday } from 'date-fns';

const NotificationBell = () => {
  const { notifications, unreadCount, loading, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  // Close the notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark notifications as read when opening the panel
    if (!isOpen && unreadCount > 0) {
      markAsRead();
    }
  };

  const formatNotificationDate = (date) => {
    const notifDate = new Date(date);
    if (isToday(notifDate)) {
      return `Today at ${format(notifDate, 'h:mm a')}`;
    } else if (isYesterday(notifDate)) {
      return `Yesterday at ${format(notifDate, 'h:mm a')}`;
    } else {
      return format(notifDate, 'MMM d, yyyy h:mm a');
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        onClick={toggleNotifications}
        className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:text-white"
        aria-label="Notifications"
      >
        <svg 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              {loading && <div className="animate-pulse text-xs text-gray-500">Refreshing...</div>}
            </div>
          </div>
          
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-6 px-4 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="mt-2 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification._id} 
                    className={`px-4 py-3 border-b border-gray-200 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="mt-1 text-xs text-gray-500">{formatNotificationDate(notification.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="py-2 px-3 bg-gray-100 border-t border-gray-200">
              <button
                onClick={() => markAsRead()}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 