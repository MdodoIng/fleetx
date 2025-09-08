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
import { useSharedStore, useVenderStore } from '@/store';
import {
  getVendorWalletBalanceInit,
  useWalletStore,
} from '@/store/useWalletStore';
import { Lightbulb, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export function WalletBalance({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<Number | undefined>>;
}) {
  const sharedStore = useSharedStore();
  const { walletBalance, isDisableAddCredit } = useWalletStore();
  const { vendorId, branchId, selectedBranch, selectedVendor } =
    useVenderStore();

  const isLowBalence = Number(walletBalance) < 3;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        await getVendorWalletBalanceInit();
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      }
    };
    fetchBalance();
  }, [vendorId, branchId, selectedBranch, selectedVendor]);

  return (
    <Card className=" bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-full flex ">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg">Wallet Balance</CardTitle>
          <p className="text-3xl font-bold mt-2">
            {walletBalance} {sharedStore.appConstants?.currency}
          </p>
          {isLowBalence && (
            <p className="text-sm mt-1">
              Low Balance Alert: <br /> Add credit to continue placing orders
            </p>
          )}
        </div>
        <div className="flex flex-col items-cemter justify-center gap-2">
          <Button
            disabled={!isDisableAddCredit}
            onClick={() => setIsOpen(2)}
            className="bg-white text-indigo-600 hover:bg-gray-100"
          >
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
