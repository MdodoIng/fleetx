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
import { Icon } from '@iconify/react';

export default function DeliveryPricingCard() {
  return (
    <Card className="">
      <CardHeader className="flex justify-start ">
        <CardIcon className='flex items-center justify-center bg-off-white rounded-[8px] h-full aspect-square shrink-0 [&_svg]:text-primary-blue [&_svg]:size-[70%] '>
          <Icon icon={'streamline-freehand:money-bag-dollar'} />
        </CardIcon>
        <div className="flex w-full flex-col">
          <CardTitle className="text-lg flex items-start justify-between">
            Detailed Pricing 
            <Badge variant="default" className="text-sm">
              💰Flat Delivery Fee: 1 KD (0–8 km)
            </Badge>
          </CardTitle>
          <CardDescription className="">
            View Detailed Km-based Pricing here 
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Base Fare (0–8 km)</span>
            <span className="text-sm font-medium text-gray-800">1.00 KD</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Additional per km (after 8 km)
            </span>
            <span className="text-sm font-medium text-gray-800">0.50 KD</span>
          </div>
        </div>

        <Separator />

        {/* Example */}
        <p className="text-sm text-dark-grey font-medium">
          Eg: 12Km Delivery= 1.00 KD (base)+ 0.5 KD  (4 Extra Km)=3.00 KD
        </p>
      </CardContent>
    </Card>
  );
}
