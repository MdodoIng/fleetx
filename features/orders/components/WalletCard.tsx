import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useSharedStore, useWalletStore } from '@/store';
import { getVendorWalletBalanceInit } from '@/store/useWalletStore';
import { Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function WalletCard({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('component.features.orders.walletCard');
  const { appConstants } = useSharedStore();
  const { walletBalance } = useWalletStore();

  useEffect(() => {
    getVendorWalletBalanceInit();
  }, []);

  return (
    <div
      className={cn(
        'bg-primary-blue/[5%] text-dark-grey flex items-center justify-start rounded-[8px] gap-3  px-3 py-2',
        className
      )}
      {...props}
    >
      <Wallet className="h-6 w-auto  text-primary-blue" />
      <div className="">
        <p className="sm:text-sm text-xs opacity-80">{t('title')}</p>
        <p className="font-medium text-primary-teal max-sm:text-sm">
          {appConstants?.currency}.{walletBalance}
        </p>
      </div>
      <Button variant="default" className="ml-auto">
        {t('button')}
      </Button>
    </div>
  );
}
