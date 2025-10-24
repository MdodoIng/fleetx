'use client';

import bellIcon from '@/assets/icons/notification.svg';
import LoadMore from '@/shared/components/fetch/LoadMore';
import NoData from '@/shared/components/fetch/NoData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import { notificationService } from '@/shared/services/notification';
import { TypeNotificationItem } from '@/shared/types/notification';
import { OperationType } from '@/shared/types/orders';
import { Icon } from '@iconify/react/dist/iconify.js';
import { formatDate } from 'date-fns';
import { SendHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TypeNotificationItem[]>(
    []
  );
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(10);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getNotification(
          notificationService.getNotificationHistoryUrl(page, null, null)
        );

        if (!response.data) throw new Error('Failed to fetch notifications');
        setNotifications(response.data);
        setNotificationCount(response.count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page]);

  const unreadCount = notifications.filter((item) => !item.vendor_read).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'relative flex items-center h-full w-full aspect-square justify-center lg:bg-off-white rounded-[8px] hover:bg-dark-grey/20 ',
            isOpen && 'lg:!bg-primary-blue lg:!text-off-white !bg-off-white/10'
          )}
          aria-label="Toggle notifications"
        >
          {' '}
          <div className="relative z-0 ">
            {' '}
            <Image
              src={bellIcon}
              alt=""
              width={20}
              height={20}
              className={cn('size-6 max-lg:invert', isOpen && 'invert')}
            />{' '}
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center size-2 text-xs font-bold text-white bg-[#FFD744] rounded-full" />
            )}{' '}
          </div>{' '}
        </button>
      </PopoverTrigger>

      <PopoverContent className="max-w-96 w-80 starting:translate-y-10  rounded-t-none">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Notifications{' '}
            <span className="text-primary-blue text-sm">
              {' '}
              {unreadCount ? ' • ' + unreadCount + ' New' : ''}{' '}
            </span>
          </p>
          <button onClick={() => setIsOpen(false)} className=" cursor-pointer ">
            <Icon
              icon="carbon:close-outline"
              className="text-dark-grey/30 size-7"
            />
          </button>
        </div>
        <div
          // onScroll={handleScroll}
          className="max-h-96 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col mt-4"
          style={{ direction: 'ltr' }}
        >
          {loading && notifications.length === 0 ? (
            <div className="text-center text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map((notification, idx) => {
                const operationType = OperationType.find(
                  (item) => item.key === notification.entity_operation_type
                );

                const operationDirection = operationType?.arrow === 'down';

                return (
                  <div
                    key={idx}
                    className={cn(
                      ` flex justify-start text-left mb-2 flex-col group`
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <SendHorizontal
                        className={cn(
                          'text-primary-blue size-8 bg-white p-2 border border-dark-grey/30 shadow rounded-[7px] -rotate-90 aspect-square shrink-0',
                          operationDirection && 'rotate-90'
                        )}
                      />

                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={cn(
                            'px-2 py-0.5 text-xs rounded-full !text-white',
                            operationType?.color
                          )}
                        >
                          {operationType?.value}
                        </span>
                        <p className="text-sm line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[#717171] text-sm">
                          {formatDate(notification.notify_at, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {idx !== notifications.length - 1 && (
                      <span className="w-full bg-dark-grey/20 h-[1px] mt-2" />
                    )}
                  </div>
                );
              })}

              <LoadMore
                count={notifications.length}
                loadMoreNumber={notificationCount}
                setPage={setPage}
                type="skeleton-small"
              />
            </>
          ) : (
            <NoData size="small" message="No notifications" />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
