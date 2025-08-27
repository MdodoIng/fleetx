'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapPin,
  User,
  Phone,
  Car,
  CreditCard,
  Clock,
  Star,
  Truck,
  Navigation,
  Info,
  Receipt,
  User2,
  ServerCrash,
  BetweenVerticalEndIcon,
  GitBranch,
  Axis3dIcon,
  MagnetIcon,
  Minus,
  Activity,
  Edit,
} from 'lucide-react';
import { statusColors, paymentMap } from '@/features/orders/constants';

import { useSharedStore, useVenderStore } from '@/store';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { OperationType } from '@/shared/types/orders';
import { cn } from '@/shared/lib/utils';
import { CentralWalletItem } from '@/features/wallet/type';
import { TypeVenderList } from '@/shared/types/vender';

interface OrdersPageProps {
  data: TypeVenderList;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  nextSetItemTotal: any;
}

export default function TableComponent({
  data,
  page,
  setPage,
  nextSetItemTotal,
}: OrdersPageProps) {
  const { appConstants } = useSharedStore();
  const venderStore = useVenderStore();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 10); // load 10 more items
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [handleLoadMore]);

  return (
    <div className="p-6 bg-gray-50 w-full">
      <div className="space-y-6 w-full">
        {data.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100 w-full"
            >
              {/* Order Details */}
              <div className="grid md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] w-full gap-4 text-sm">
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <User2 size={14} /> Vender.
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {item.name}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <GitBranch size={14} /> Branch.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    {item.main_branch.name}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Phone size={14} /> Phone.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    {item.main_branch.mobile_number}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Axis3dIcon size={14} /> Adress.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    {item.main_branch.address.area},{' '}
                    {item.main_branch.address.block},{' '}
                    {item.main_branch.address.street}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MagnetIcon size={14} /> Account Manager.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    {item.account_manager ? <Activity /> : <Minus />}
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MagnetIcon size={14} /> Users.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    <User />
                  </span>
                </div>
                <div className="flex flex-col p-3 rounded-lg border bg-gray-50">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Edit size={14} /> Action.
                  </span>
                  <span className={cn('text-sm font-medium text-gray-800')}>
                    <Edit />
                  </span>
                </div>
              </div>

              {/* Footer */}
            </div>
          );
        })}
      </div>

      {/* Pagination */}

      <div
        hidden={nextSetItemTotal === null}
        className="flex justify-center mt-6 gap-2 bg-white w-full shadow rounded-md py-3"
      >
        <div
          ref={loadMoreRef}
          className="flex justify-center items-center py-4 text-gray-500"
        >
          Loading more...
        </div>
      </div>
    </div>
  );
}
