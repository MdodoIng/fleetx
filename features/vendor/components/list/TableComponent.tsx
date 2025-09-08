'use client';

import {
  Dispatch,
  ForwardRefExoticComponent,
  JSX,
  RefAttributes,
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
  LucideProps,
} from 'lucide-react';
import { statusColors, paymentMap } from '@/features/orders/constants';

import { useSharedStore, useVenderStore } from '@/store';
import { TypeWalletTransactionHistoryRes } from '@/shared/types/report';
import { OperationType } from '@/shared/types/orders';
import { cn } from '@/shared/lib/utils';
import { CentralWalletItem } from '@/features/wallet/type';
import { TypeVenderList } from '@/shared/types/vender';

interface OrdersPageProps {
  data:
    | (
        | {
            icon: ForwardRefExoticComponent<
              Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
            >;
            title: string;
            value: string;
            onClick?: undefined;
          }
        | {
            icon: ForwardRefExoticComponent<
              Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
            >;
            title: string;
            value: JSX.Element;
            onClick?: undefined;
          }
        | {
            icon: ForwardRefExoticComponent<
              Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
            >;
            title: string;
            value: JSX.Element;
            onClick: () => void;
          }
      )[][]
    | undefined;
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
  const [isEdit, setIsEdit] = useState({ id: '' });

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
        {data?.map((i, x) => (
          <div
            key={x}
            className="bg-white rounded-lg shadow p-4 flex flex-col border border-gray-100 w-full"
          >
            {/* Order Details */}
            <div className="grid md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] w-full gap-4 text-sm">
              {i.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-3 rounded-lg border bg-gray-50"
                >
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <item.icon size={14} /> {item.title}.
                  </span>
                  <span
                    className="text-sm font-medium text-gray-800"
                    onClick={item.onClick}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
          </div>
        ))}
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
