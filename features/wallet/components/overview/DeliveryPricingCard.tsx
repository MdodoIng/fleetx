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
        <CardIcon>
          <Icon icon={'streamline-freehand:money-bag-dollar'} />
        </CardIcon>
        <div className="flex w-full flex-col relative z-0">
          <CardTitle className="">Detailed Pricing</CardTitle>
          <CardDescription className="">
            View Detailed Km-based Pricing here
          </CardDescription>
          <Badge
            variant="default"
            className="text-xs top-0 right-0 absolute max-md:hidden"
          >
            💰Flat Delivery Fee: 1 KD (0–8 km)
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
      <Badge variant="default" className="text-xs  md:hidden">
        💰Flat Delivery Fee: 1 KD (0–8 km)
      </Badge>
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
          Eg: 12Km Delivery= 1.00 KD (base)+ 0.5 KD (4 Extra Km)=3.00 KD
        </p>
      </CardContent>
    </Card>
  );
}
