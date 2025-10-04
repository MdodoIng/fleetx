import {
  MapPin,
  Truck,
  Clock,
  Coins,
  LocateFixed,
  DollarSign,
  MapPinned,
} from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { useOrderStore } from '@/store';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Fragment } from 'react';
export default function DeliverySummaryFooter({
  handleOrder,
  handleCancel,
  isValid = false,
}: {
  handleOrder: () => void;
  handleCancel: () => void;
  isValid: boolean;
}) {
  const orderStore = useOrderStore();

  const { estTime, totalDelivery, totalKM, totalOrders } =
    orderStore.deliverySummary || {};

  const t = useTranslations('component.features.orders.create.footer');

  const data = [
    {
      icon: <MapPinned className="w-4 h-4 text-gray-500" />,
      text: totalKM,
      label: t('distance'),
    },
    {
      icon: <LocateFixed className="w-4 h-4 text-gray-500" />,
      text: totalOrders,
      label: t('drop-off'),
    },
    {
      icon: <Clock className="w-4 h-4 text-gray-500" />,
      text: estTime ? estTime + ' ' + t('min') : '',
      label: t('estTime'),
    },
    {
      icon: <DollarSign className="w-4 h-4 text-gray-500" />,
      text: totalDelivery,
      label: t('deliveryFee'),
    },
  ];

  return (
    <>
      <Card className="w-full max-md:hidden bg-white py-4 ">
        <CardContent className=" sm:rounded-[8px]  bg-white   flex  items-center justify-between   text-sm   flex-wrap gap-x-10 gap-y-4 ">
          <div className="flex items-center space-x-6 max-sm:bg-whites ">
            <span className="font-medium text-primary-blue cursor-pointer">
              {t('orderDetails')}
            </span>
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                {item.icon}
                <p>{item.label}</p>
                <span className="text-primary-blue">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={'ghost'}
              onClick={() => handleCancel()}
              className="cursor-pointer bg-[#6750A414] text-[#1D1B20]"
            >
              {t('button.cancel')}
            </Button>
            <Button
              disabled={isValid}
              onClick={() => handleOrder()}
              className="cursor-pointer"
            >
              {t('button.createOrder')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col  md:hidden w-full gap-6 sm:col-span-2">
        <Card className="w-full bg-white">
          <CardContent className=" sm:rounded-[8px]  bg-white   flex  items-center justify-between   text-sm text-gray-700  flex-wrap gap-x-10 gap-y-4 ">
            <div className="flex flex-col items-start gap-4 w-full">
              <span className="font-medium text-primary-blue cursor-pointer">
                {t('orderDetails')}
              </span>
              <menu className="flex w-full flex-col gap-4">
                {data.map((item, index) => (
                  <Fragment key={index}>
                    <li className="flex items-center space-x-1 w-full">
                      <span className="aspect-square size-9 bg-off-white flex items-center justify-center rounded-[8px]">
                        {item.icon}
                      </span>
                      <p>{item.label}</p>
                      <span className="text-primary-blue ml-auto">
                        {item.text}
                      </span>
                    </li>
                    <span className="w-full h-[1px] bg-[#CAC4D0] last:hidden" />
                  </Fragment>
                ))}
              </menu>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full  bg-white ">
          <CardContent className="w-full overflow-hidden flex gap-4">
            <Button
              variant={'ghost'}
              onClick={() => handleCancel()}
              className="cursor-pointer bg-[#6750A414] text-[#1D1B20] w-1/3"
            >
              {t('button.cancel')}
            </Button>
            <Button
              disabled={isValid}
              onClick={() => handleOrder()}
              className="cursor-pointer w-full shrink"
            >
              {t('button.createOrder')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
