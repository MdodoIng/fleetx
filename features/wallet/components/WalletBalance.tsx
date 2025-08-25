'use client';

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
import { useState } from 'react';

export function WalletBalance({
  wallet,
  handleCreditAction,
}: {
  wallet: TypeWallet;
  handleCreditAction: () => void;
}) {
  const sharedStore = useSharedStore();
  const isLowBalence = wallet?.wallet_balance < 3;
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      amount: '50 KD',
      desc: 'Perfect for small Restaurants (30-50 Orders/Month)',
      covers: 'Covers 30-50 Orders',
    },
    {
      amount: '80 KD',
      desc: 'Perfect for Medium Volume Restaurants (50-80 Orders/Month)',
      covers: 'Covers 50-80 Orders',
    },
    {
      amount: '100+ KD',
      desc: 'Perfect for high volume Restaurants (80+ Orders/Month)',
      covers: 'Covers 80+ Orders',
    },
  ];

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
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs flex items-center "
          >
            <Lightbulb size={10} />
            Smart Recommendations?
          </Button>
          <div hidden={!isOpen} className="w-[min(90%,400px)] fixed inset-0 size-full flex items-center justify-center mx-auto my-auto ">
            <div className="relative  rounded-2xl bg-white shadow-lg p-6 border mx-auto">
              {/* Close Button */}
              <Button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </Button>

              {/* Header */}
              <div className="mb-4">
                <h2 className=" font-semibold inline-flex text-gray-700 items-center gap-2">
                  <span role="img" aria-label="bulb">
                    💡
                  </span>
                  Smart Recharge Recommendation
                </h2>
                <p className="text-sm text-gray-500">
                  Charge your Wallet based on your monthly order volume to
                  reduce frequent recharging.
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {options.map((opt, i) => (
                  <Card
                    key={i}
                    className="border border-yellow-300 p-3  hover:shadow-md transition cursor-pointer"
                  >
                    <CardContent className="flex justify-between items-center p-0">
                      <div>
                        <p className="text-base font-semibold">{opt.amount}</p>
                        <p className="text-sm text-gray-500">{opt.desc}</p>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-yellow-50 border-yellow-300 text-gray-700 text-xs"
                      >
                        {opt.covers}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer Note */}
              <p className="mt-4 text-sm text-gray-600 flex items-center gap-1 justify-center">
                <span role="img" aria-label="money">
                  💰
                </span>
                Delivery Charge:{' '}
                <span className="font-medium">1.50 KD per Order</span>
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
