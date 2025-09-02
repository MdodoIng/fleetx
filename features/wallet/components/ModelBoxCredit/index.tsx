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

import { useAddCredit } from '../../hooks/useAddCredit';
import Recommendation from './Recommendation';
import AddCredit from './AddCredit';

export default function ModelBoxCredit({
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
      <Dialog
        open={isOpen !== undefined}
        onOpenChange={(open) => !open && setIsOpen(undefined)}
      >
        <DialogContent className="sm:max-w-fit">
          <DialogHeader>
            <DialogTitle className=" font-semibold inline-flex text-gray-700 items-center gap-2">
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
            </DialogTitle>
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
          </DialogHeader>

          {isOpen === 1 && (
            <Recommendation
              recommendations={recommendations}
              setAmount={setAmount}
              setIsOpen={setIsOpen}
            />
          )}

          {isOpen === 2 && (
            <AddCredit
              amount={amount}
              setAmount={setAmount}
              recommendations={recommendations}
              setSelected={setSelected}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
