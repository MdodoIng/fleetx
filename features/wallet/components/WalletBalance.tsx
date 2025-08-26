import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { TypeWallet } from '@/shared/types/vender';
import { useSharedStore } from '@/store';
import { Lightbulb, X } from 'lucide-react';
import React, { useState } from 'react';

export function WalletBalance({
  wallet,
  handleCreditAction,
  setIsOpen,
}: {
  wallet: TypeWallet;
  handleCreditAction: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<Number | undefined>>;
}) {
  const sharedStore = useSharedStore();
  const isLowBalence = wallet?.wallet_balance < 3;

  return (
    <Card className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full flex ">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg">Wallet Balance</CardTitle>
          <p className="text-3xl font-bold mt-2">
            {wallet?.wallet_balance} {sharedStore.appConstants?.currency}
          </p>
          {isLowBalence && (
            <p className="text-sm mt-1">
              Low Balance Alert: <br /> Add credit to continue placing orders
            </p>
          )}
        </div>
        <div className="flex flex-col items-cemter justify-center gap-2">
          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            + Add Credit
          </Button>

          <Button
            variant={'ghost'}
            onClick={() => setIsOpen(1)}
            className="text-xs flex items-center "
          >
            <Lightbulb size={10} />
            Smart Recommendations?
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
