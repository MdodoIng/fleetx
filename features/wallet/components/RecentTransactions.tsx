'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TransactionItem } from './TransactionItem';
import { TypeNotificationItem } from '@/shared/types/notification';
import { cn } from '@/shared/lib/utils';

export function RecentTransactions({
  walletHistory,
}: {
  walletHistory: TypeNotificationItem[] | undefined;
}) {
  const transactions = [
    { id: 'B-49M5C', amount: -1.5, type: 'fee', date: 'Today at 3:20 PM' },
    {
      id: 'B-49M5C',
      amount: +50,
      type: 'recharge',
      date: '21 Aug 2025, 06:24 PM',
    },
    { id: 'B-49M5C', amount: -1.5, type: 'fee', date: '21 Aug 2025, 06:24 PM' },
    {
      id: 'B-49M5C',
      amount: +50,
      type: 'recharge',
      date: '21 Aug 2025, 06:24 PM',
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          All your confirmed orders are listed here
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {walletHistory?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-3 mb-3">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-500">{item.entity_id}</p>
                <p
                  className={` max-w-[36ch]`}
                >
                  {item.message}
                </p>
                <p className="text-xs text-gray-400 ">
                  {new Date(item.notify_at).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-2 rounded-full h-max text-xs bg-yellow-500 text-center`}
              > 
                {item.message.includes('debited')
                  ? 'Delivery Fee'
                  : 'Wallet Recharged'}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
