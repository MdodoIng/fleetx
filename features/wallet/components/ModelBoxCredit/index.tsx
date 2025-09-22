import { Button } from '@/shared/components/ui/button';
import { CardIcon } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useSharedStore, useVenderStore } from '@/store';
import { useWalletStore } from '@/store/useWalletStore';
import { Wallet } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useAddCredit } from '../../hooks/useAddCredit';
import Recommendation from './Recommendation';
import PaymentForm from './PaymentForm';
import { useTranslations } from 'next-intl';

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

  const t = useTranslations('component.features.wallet');

  const recommendations = [
    {
      value: 15,
      label: t('recommendations.15.label'),
      desc: t('recommendations.15.desc'),
      label2: t('recommendations.15.label2'),
    },
    {
      value: 30,
      label: t('recommendations.30.label'),
      desc: t('recommendations.30.desc'),
      label2: t('recommendations.30.label2'),
    },
    {
      value: 50,
      label: t('recommendations.50.label'),
      desc: t('recommendations.50.desc'),
      label2: t('recommendations.50.label2'),
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
                <>{t('smartRechargeRecommendation')}</>
              ) : (
                <>
                  <CardIcon>
                    <Wallet className="" />
                  </CardIcon>
                  {t('addCredit')}
                </>
              )}
            </DialogTitle>
            <p className="text-sm text-gray-500">
              {isOpen === 1 ? (
                <>{t('chargeWallet')}</>
              ) : (
                <>{t('frequentRecharging')}</>
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
