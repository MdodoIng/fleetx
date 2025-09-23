'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Eye, Star, Smartphone, Truck, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

// Mock data types based on your Angular component
interface RatingData {
  overall_rating_type: string;
  value: number;
}

// Rating dashboard constants (similar to your Angular rateDashBoardValue)
const RATING_TYPES = {
  mashkorRating: 'mashkor_rating',
  mashkorRatingCount: 'mashkor_rating_count',
  courierDashboard: 'courier_dashboard',
  courierDashboardCount: 'courier_dashboard_count',
  courierDashboardPickup: 'courier_dashboard_pickup',
  courierDashboardPickupCount: 'courier_dashboard_pickup_count',
  courierDashboardDelivery: 'courier_dashboard_delivery',
  courierDashboardDeliveryCount: 'courier_dashboard_delivery_count',
  mobileApp: 'mobile_app',
  mobileAppCount: 'mobile_app_count',
  mobileAppPickup: 'mobile_app_pickup',
  mobileAppPickupCount: 'mobile_app_pickup_count',
  mobileAppBuy: 'mobile_app_buy',
  mobileAppBuyCount: 'mobile_app_buy_count',
  sellerDashboard: 'seller_dashboard',
  sellerDashboardCount: 'seller_dashboard_count',
  sellerDashboardPickup: 'seller_dashboard_pickup',
  sellerDashboardPickupCount: 'seller_dashboard_pickup_count',
  sellerDashboardDelivery: 'seller_dashboard_delivery',
  sellerDashboardDeliveryCount: 'seller_dashboard_delivery_count',
  improvementType_1: 'improvement_type_1',
  improvementType_2: 'improvement_type_2',
  improvementType_3: 'improvement_type_3',
  improvementType_4: 'improvement_type_4',
};

const IMPROVEMENT_CATEGORIES = [
  { id: 1, name: "BUDDY'S HYGIENE" },
  { id: 2, name: 'LATE PICKUP' },
  { id: 3, name: 'LATE DELIVERY' },
  { id: 4, name: "BUDDY'S BEHAVIOR" },
];

export default function RatingPage() {
  const t = useTranslations();

  // State for all rating data
  const [ratingData, setRatingData] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to find rating value
  const findRatingValue = (type: string): number => {
    return (
      ratingData.find((item) => item.overall_rating_type === type)?.value || 0
    );
  };

  // Mock API call - replace with your actual service
  const fetchRatingData = useCallback(async () => {
    setLoading(true);
    try {
      // Replace this with your actual API call
      // const response = await rateService.getDashboardData();

      // Mock data for demo
      const mockData: RatingData[] = [
        { overall_rating_type: RATING_TYPES.mashkorRating, value: 4.8 },
        { overall_rating_type: RATING_TYPES.mashkorRatingCount, value: 1250 },
        { overall_rating_type: RATING_TYPES.courierDashboard, value: 4.5 },
        { overall_rating_type: RATING_TYPES.courierDashboardCount, value: 890 },
        {
          overall_rating_type: RATING_TYPES.courierDashboardPickup,
          value: 4.7,
        },
        {
          overall_rating_type: RATING_TYPES.courierDashboardPickupCount,
          value: 445,
        },
        {
          overall_rating_type: RATING_TYPES.courierDashboardDelivery,
          value: 4.3,
        },
        {
          overall_rating_type: RATING_TYPES.courierDashboardDeliveryCount,
          value: 445,
        },
        { overall_rating_type: RATING_TYPES.mobileApp, value: 4.6 },
        { overall_rating_type: RATING_TYPES.mobileAppCount, value: 756 },
        { overall_rating_type: RATING_TYPES.mobileAppPickup, value: 4.4 },
        { overall_rating_type: RATING_TYPES.mobileAppPickupCount, value: 378 },
        { overall_rating_type: RATING_TYPES.mobileAppBuy, value: 4.8 },
        { overall_rating_type: RATING_TYPES.mobileAppBuyCount, value: 378 },
        { overall_rating_type: RATING_TYPES.sellerDashboard, value: 4.2 },
        { overall_rating_type: RATING_TYPES.sellerDashboardCount, value: 634 },
        { overall_rating_type: RATING_TYPES.sellerDashboardPickup, value: 4.1 },
        {
          overall_rating_type: RATING_TYPES.sellerDashboardPickupCount,
          value: 317,
        },
        {
          overall_rating_type: RATING_TYPES.sellerDashboardDelivery,
          value: 4.3,
        },
        {
          overall_rating_type: RATING_TYPES.sellerDashboardDeliveryCount,
          value: 317,
        },
        { overall_rating_type: RATING_TYPES.improvementType_1, value: 85 },
        { overall_rating_type: RATING_TYPES.improvementType_2, value: 92 },
        { overall_rating_type: RATING_TYPES.improvementType_3, value: 78 },
        { overall_rating_type: RATING_TYPES.improvementType_4, value: 88 },
      ];

      setRatingData(mockData);
    } catch (error) {
      console.error('Error fetching rating data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRatingData();
  }, [fetchRatingData]);

  // Show details modal - replace with your actual modal implementation
  const showDetails = (improvementType: number) => {
    console.log('Show details for improvement type:', improvementType);
    // Implement your modal logic here
    // You can use a state to control modal visibility and pass improvementType
  };

  const formatRating = (value: number): string => {
    return value ? value.toFixed(1) : '0.0';
  };

  if (loading) {
    return (
      <Dashboard className="h-auto sm:h-full">
        <DashboardHeader>
          <DashboardHeaderRight />
        </DashboardHeader>
        <DashboardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </DashboardContent>
      </Dashboard>
    );
  }

  return (
    <Dashboard className="">
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>

      <DashboardContent className="space-y-6 flex-col">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Improvement Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <div className="space-y-3">
                  {IMPROVEMENT_CATEGORIES.map((category, index) => {
                    const value = findRatingValue(
                      `improvement_type_${category.id}`
                    );
                    return (
                      <div
                        key={category.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-2xl',
                          index % 2 === 1 &&
                            'bg-gradient-to-r from-gray-50/40 to-blue-50/40'
                        )}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <span className="size-8 shrink-0 bg-primary-blue aspect-square text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {category.id}
                          </span>
                          <span className="text-sm font-bold text-dark-grey tracking-wide uppercase">
                            {category.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showDetails(category.id)}
                            className="bg-slate-800 text-white border-slate-800 hover:bg-slate-700 px-5 py-2 h-9"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>

                          <div className="w-24 h-9 bg-white border-2 border-slate-600 rounded-2xl flex items-center justify-center opacity-35">
                            <span className="text-slate-600 font-bold text-sm">
                              {formatRating(value)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-1  bg-gradient-to-br from-primary-blue to-purple-600 text-white relative overflow-hidden h-full">
            <CardContent className="items-center justify-center flex flex-col text-center h-full">
              <h3 className="text-2xl font-bold tracking-wider mb-4">
                MASHKOR <span className="font-light">RATING</span>
              </h3>

              <Button variant={'outline'} className="bg-white border-none">
                <div className="text-2xl font-bold tracking-widest">
                  {formatRating(findRatingValue(RATING_TYPES.mashkorRating))}
                  <span className="text-lg ml-2">
                    ({findRatingValue(RATING_TYPES.mashkorRatingCount)})
                  </span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Rating Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Courier Dashboard */}
          <Card>
            <CardHeader className="border-b-0 pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-slate-700 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <CardIcon>
                    <Truck />
                  </CardIcon>
                  Courier Dashboard
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue(RATING_TYPES.courierDashboard))}
                  <span className="ml-1">
                    ({findRatingValue(RATING_TYPES.courierDashboardCount)})
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    PICK UP
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(
                        findRatingValue(RATING_TYPES.courierDashboardPickup)
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      (
                      {findRatingValue(
                        RATING_TYPES.courierDashboardPickupCount
                      )}
                      )
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    DELIVERY
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(
                        findRatingValue(RATING_TYPES.courierDashboardDelivery)
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      (
                      {findRatingValue(
                        RATING_TYPES.courierDashboardDeliveryCount
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile App */}
          <Card className="shadow-lg">
            <CardHeader className="border-b-0 pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-slate-700 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <CardIcon>
                    <Smartphone />
                  </CardIcon>
                  Mobile App
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue(RATING_TYPES.mobileApp))}
                  <span className="ml-1">
                    ({findRatingValue(RATING_TYPES.mobileAppCount)})
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    PICK UP
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(
                        findRatingValue(RATING_TYPES.mobileAppPickup)
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue(RATING_TYPES.mobileAppPickupCount)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    BUY
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(findRatingValue(RATING_TYPES.mobileAppBuy))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue(RATING_TYPES.mobileAppBuyCount)})
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Dashboard */}
          <Card className="shadow-lg">
            <CardHeader className="border-b-0 pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-bold text-slate-700 tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <CardIcon>
                    <Users />
                  </CardIcon>
                  Seller Dashboard
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue(RATING_TYPES.sellerDashboard))}
                  <span className="ml-1">
                    ({findRatingValue(RATING_TYPES.sellerDashboardCount)})
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    PICK UP
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(
                        findRatingValue(RATING_TYPES.sellerDashboardPickup)
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      (
                      {findRatingValue(RATING_TYPES.sellerDashboardPickupCount)}
                      )
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 tracking-wider">
                    DELIVERY
                  </span>
                  <div className="bg-white border-2 border-slate-600 px-3 py-1 rounded-2xl flex items-center text-sm">
                    <Star
                      className="w-4 h-4 mr-1 text-green-500"
                      fill="currentColor"
                    />
                    <span className="font-bold text-slate-700">
                      {formatRating(
                        findRatingValue(RATING_TYPES.sellerDashboardDelivery)
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      (
                      {findRatingValue(
                        RATING_TYPES.sellerDashboardDeliveryCount
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>
    </Dashboard>
  );
}
