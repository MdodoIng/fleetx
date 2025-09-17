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
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAddCredit } from '../../hooks/useAddCredit';
import Recommendation from './Recommendation';
import PaymentForm from './PaymentForm';

export default function ModelBoxCredit({
  isOpen,
  setIsOpen,
}: {
  isOpen: number | undefined;
  setIsOpen: Dispatch<SetStateAction<number | undefined>>;
}) {
  const [amount, setAmount] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const sheredStore = useSharedStore();
  const venderStore = useVenderStore();
  const { prepareMashkor } = useWalletStore();

  const { submitAddCredit, submitCreditDebitConformed } = useAddCredit();

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

          {isOpen === 1 && !prepareMashkor && (
            <Recommendation
              recommendations={recommendations}
              setAmount={setAmount}
              setIsOpen={setIsOpen}
            />
          )}

          {isOpen === 2 && !prepareMashkor && (
            <PaymentForm
              amount={amount}
              setAmount={setAmount}
              recommendations={recommendations}
              setSelected={setSelected}
            />
          )}
          {prepareMashkor && (
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col justify-end items-end">
                <p className="text-sm text-gray-500">
                  Balance will be {prepareMashkor.amount}
                </p>
                <Button
                  className="w-full max-w-[200px] text-lg font-semibold py-6"
                  onClick={async () =>
                    await submitCreditDebitConformed({ setIsOpen: setIsOpen })
                  }
                >
                  Add Credit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
