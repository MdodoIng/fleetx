import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { checkBlockActivation } from '@/shared/services';
import { useSharedStore, useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import { Wallet, X } from 'lucide-react';
import React, { useState } from 'react';
import { useAddCredit } from '../hooks/useAddCredit';

export default function ModelBox({
  isOpen,
  setIsOpen,
}: {
  isOpen: Number | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<Number | undefined>>;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const sheredStore = useSharedStore();
  const venderStore = useVenderStore();
  const walletStore = useWalletStore();

  const { submitAddCredit, handleAddCredit } = useAddCredit();

  const recommendations = [
    {
      value: 15,
      label: 'Perfect for small Restaurants',
      desc: 'Covers 30-50 Orders',
      label2: '(30-50 Orders/Month)',
    },
    {
      value: 30,
      label: 'Perfect for small Restaurants',
      desc: 'Covers 30-50 Orders',
      lebal2: '(50-80 Orders/Month)',
    },
    {
      value: 50,
      label: 'Perfect for small Restaurants',
      desc: 'Covers 30-50 Orders',
      label2: '(80+Orders/Month',
    },
  ];

  const handleSubmit = async () => {
    const value = parseFloat(String(amount));
    if (Number.isNaN(value) || value <= 0) return;
    try {
      await submitAddCredit(value);
    } catch (err: any) {
      console.log(err.error?.message || err.message);
    }
  };

  return (
    <>
      <div
        hidden={!isOpen}
        className="w-[min(90%,500px)] fixed inset-0 size-full flex items-center justify-center mx-auto my-auto "
      >
        <div className="relative  rounded-2xl bg-white shadow-lg p-6 border mx-auto">
          {/* Close Button */}
          <Button
            onClick={() => setIsOpen(undefined)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </Button>

          {/* Header */}
          <div className="mb-4">
            <h2 className=" font-semibold inline-flex text-gray-700 items-center gap-2">
              {isOpen === 1 ? (
                <>
                  <span role="img" aria-label="bulb">
                    💡
                  </span>
                  Smart Recharge Recommendation
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 text-blue-500" />
                  Add Credit
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500">
              {isOpen === 1 ? (
                <>
                  Charge your Wallet based on your monthly order volume to
                  reduce
                </>
              ) : (
                <>frequent recharging. Quick top-up for faster ordering</>
              )}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {isOpen === 1 ? (
              <>
                {recommendations.map((opt, i) => (
                  <Card
                    key={i}
                    className="border border-yellow-300 p-3  hover:shadow-md transition cursor-pointer"
                  >
                    <CardContent className="flex justify-between items-center p-0">
                      <div>
                        <p className="text-base font-semibold">
                          {opt.value} {sheredStore.appConstants?.currency}
                        </p>
                        <p className="text-sm text-gray-500">
                          {opt.label} {opt.label2}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          !walletStore.isDisableAddCredit && setIsOpen(2);
                          setAmount(opt.value);
                        }}
                        className="bg-yellow-50 border-yellow-300 text-gray-700 text-xs"
                      >
                        {opt.desc}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">Credit Amount:</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={String(amount) || "0"}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                      className="flex-1 border-blue-500 focus-visible:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-600">
                      {sheredStore.appConstants?.currency}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {isOpen === 2 && (
            <div>
              <p className="flex items-center gap-2 text-sm font-medium mb-3">
                💡 Smart Recharge Recommendation
              </p>
              <div className="grid grid-cols-3 gap-3">
                {recommendations.map((item, idx) => (
                  <Card
                    key={idx}
                    onClick={() => {
                      setSelected(item.value);
                      setAmount(item.value);
                    }}
                    className={cn(
                      'cursor-pointer border rounded-xl transition-all',
                      amount! === item.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-blue-400'
                    )}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <p className="text-sm font-bold">
                        {item.value} {sheredStore.appConstants?.currency}
                      </p>
                      <p className="text-xs text-gray-600">{item.label}</p>
                      <span className="inline-block text-[11px] px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                        {item.desc}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <p className="mt-4 text-sm text-gray-600 flex items-center gap-1 justify-center">
            <span role="img" aria-label="money">
              💰
            </span>
            Delivery Charge:{' '}
            <span className="font-medium">1.50 KD per Order</span>
          </p>

          {isOpen === 2 && (
            <Button
              onClick={() => handleSubmit()}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 "
            >
              Add Credit
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
