'use client';

import { Badge } from '@/shared/components/ui/badge';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import { useSharedStore } from '@/store';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

export default function DeliveryPricingCard() {
  const { appConstants } = useSharedStore();
  const t = useTranslations('component.features.wallet');
  return (
    <Card className="">
      <CardHeader className="flex justify-start ">
        <CardIcon>
          <Icon icon={'streamline-freehand:money-bag-dollar'} />
        </CardIcon>
        <div className="flex w-full flex-col relative z-0">
          <CardTitle className="">{t('detailedPricing')}</CardTitle>
          <CardDescription className="">
            {t('viewDetailedKmBasedPricing')}
          </CardDescription>
          <Badge
            variant="default"
            className="text-xs top-0 right-0 absolute max-md:hidden"
          >
            {t.rich('flatDeliveryFee', {
              value: appConstants?.currency,
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Badge variant="default" className="text-xs  md:hidden">
          {t.rich('flatDeliveryFee', {
            value: appConstants?.currency,
          })}
        </Badge>
        {/* Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700"> {t('baseFare')}</span>
            <span className="text-sm font-medium text-gray-800">
              1.00 {appConstants?.currency}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {t('additionalPerKm')}
            </span>
            <span className="text-sm font-medium text-gray-800">
              0.50 {appConstants?.currency}
            </span>
          </div>
        </div>

        <Separator />

        {/* Example */}
        <p className="text-sm text-dark-grey font-medium">
          {t.rich('example', {
            value: appConstants?.currency,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
