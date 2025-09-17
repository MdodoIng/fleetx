import { Button } from '@/shared/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useDir } from '@/shared/lib/hooks';
import { useSharedStore, useVenderStore } from '@/store';
import {
  getVendorWalletBalanceInit,
  useWalletStore,
} from '@/store/useWalletStore';
import { Lightbulb, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

export function WalletBalance({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<number | undefined>>;
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

  const t = useTranslations('component.features.wallet');
 

  return (
    <Card className=" bg-gradient-to-r from-primary-blue to-purple-600 text-white w-full shrink flex ">
      <CardHeader className="flex md:flex-row flex-col gap-10  justify-between items-center">
        <div>
          <CardTitle className="text-lg">{t('walletBalance')}</CardTitle>
          <p className="text-3xl font-bold mt-2">
            {walletBalance} {sharedStore.appConstants?.currency}
          </p>
          {isLowBalence && (
            <p className="text-sm mt-1">
              {t.rich('lowBalanceAlert', {
                br: () => <br />,
              })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-cemter justify-center gap-2 max-md:w-full">
          <Button
            disabled={!isDisableAddCredit}
            onClick={() => setIsOpen(2)}
            className="bg-white text-indigo-600 hover:bg-gray-100 max-md:w-full"
          >
            <Plus />
            {t.rich('addCredit')}
          </Button>

          <button
            onClick={() => setIsOpen(1)}
            className="text-xs flex items-center "
          >
            <Lightbulb size={10} />
            {t.rich('smartRecommendations')}
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
