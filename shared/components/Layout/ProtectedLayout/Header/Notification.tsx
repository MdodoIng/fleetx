'use client';

import { notificationService } from '@/shared/services/notification';
import { TypeNotificationItem } from '@/shared/types/notification';
import bellIcon from '@/assets/icons/notification.svg';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotificationItem[]>(
    []
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getNotification(
          notificationService.getNotificationHistoryUrl(10, null, null)
        );
        if (!response.data) throw new Error('Failed to fetch notifications');
        setNotifications(response.data);
        setNotificationCount(response.count || 0);
        setHasMore(response.data.length === 10);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Fetch more notifications on scroll
  const fetchMoreNotifications = async () => {
    if (loading || !hasMore) return;

    const lastNotification = notifications[notifications.length - 1];
    try {
      setLoading(true);
      const response = await notificationService.getNotification(
        notificationService.getNotificationHistoryUrl(
          10,
          lastNotification?.notify_at ?? null,
          lastNotification?.id?.toString() ?? null
        )
      );
      if (!response.data) {
        setHasMore(false);
        return;
      }
      setNotifications((prev) => [...prev, ...response.data]);
      setNotificationCount(response.count || notificationCount);
      setHasMore(response.data.length === 10); // No more if less than 10 items
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
      fetchMoreNotifications();
    }
  };

  // Toggle notification popup and handle outside clicks
  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative h-full aspect-square">
      <button
        onClick={toggleNotifications}
        className="relative flex items-center h-full w-full justify-center bg-off-white rounded-[8px] hover:bg-dark-grey/20"
        aria-label="Toggle notifications"
      >
        <div className="relative z-0 ">
          <Image src={bellIcon} alt="" className="size-6" />

          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center size-2  text-xs font-bold text-white bg-[#FFD744] rounded-full" />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          ref={notificationRef}
          onScroll={handleScroll}
          className="absolute top-12 right-0 w-80 max-h-96 bg-white shadow-lg border border-gray-200 rounded-md overflow-auto z-50 p-4"
          style={{ direction: 'ltr' }}
        >
          {loading && notifications.length === 0 ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notification, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-full text-left p-2 rounded-md mb-2 ${
                    notification.color === 1
                      ? 'text-green-600 bg-green-50'
                      : 'text-red-600 bg-red-50'
                  }`}
                >
                  <span>
                    {notification.color === 1 ? (
                      <span className="inline-block w-4 h-4 mr-2">💰</span>
                    ) : (
                      <span className="inline-block w-4 h-4 mr-2">❌</span>
                    )}
                  </span>
                  {notification.message}
                </button>
              ))}
              {loading && (
                <div className="text-center text-gray-500">Loading more...</div>
              )}
              {!hasMore && notifications.length > 0 && (
                <div className="text-center text-gray-500">
                  No more notifications
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
}
