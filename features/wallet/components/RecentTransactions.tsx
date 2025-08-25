'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TransactionItem } from './TransactionItem';

export function RecentTransactions() {
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
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <p className="text-sm text-muted-foreground">
          All your confirmed orders are listed here
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((t, i) => (
          <TransactionItem
            key={i}
            {...t}
            type={t.type === 'fee' ? 'fee' : 'recharge'}
          />
        ))}
      </CardContent>
    </Card>
  );
}
