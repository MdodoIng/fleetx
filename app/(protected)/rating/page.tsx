'use client';

import RateImproveBuddies from '@/features/rating/components/RateImproveBuddies';
import { RatingFallback } from '@/shared/components/fetch/fallback';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';
import { rateService } from '@/shared/services/rate';
import {
  OverallRatingType,
  TypeGetDashBoardResponse,
} from '@/shared/types/rate';
import { Eye, Smartphone, Star, Truck, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Improvement categories
const IMPROVEMENT_CATEGORIES = [
  { id: 1, name: "BUDDY'S HYGIENE" },
  { id: 2, name: 'LATE PICKUP' },
  { id: 3, name: 'LATE DELIVERY' },
  { id: 4, name: "BUDDY'S BEHAVIOR" },
];

export default function RatingPage() {
  const [ratingData, setRatingData] = useState<
    TypeGetDashBoardResponse['data']
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    improvementType: number;
    resBuddyList: { data: any[]; count: number };
  } | any>(null);

  // Helper function to find rating value and convert to number
  const findRatingValue = (type: OverallRatingType): number => {
    const item = ratingData.find((item) => item.overall_rating_type === type);
    return item ? parseFloat(item.value) || 0 : 0;
  };

  // Fetch rating data
  const fetchRatingData = useCallback(async () => {
    setError(null);
    try {
      const response = await rateService.getDashBoard();
      console.log('API Response:', response); // Debug log
      if (response.data) {
        setRatingData(response.data);
      } else {
        setError('No data returned from API');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rating data');
      console.error('Error fetching rating data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRatingData();
  }, [fetchRatingData]);

  // Show details modal
  const handleShowDetails = async (improvementType: number) => {
    try {
      const res = await rateService.getBuddiesDetailedList(
        improvementType,
        1,
        10
      );
      setModalData({ improvementType, resBuddyList: res });
      setModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch detailed list');
      console.error('Error in showDetails:', err);
    }
  };

  const formatRating = (value: number): string => {
    return value ? value.toFixed(1) : '0.0';
  };

  if (loading) return <RatingFallback />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  return (
    <Dashboard className="h-auto sm:h-full">
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
                      `ImprovementType_${category.id}` as OverallRatingType
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
                            onClick={() => handleShowDetails(category.id)}
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

          <Card className="lg:col-span-1 bg-gradient-to-br from-primary-blue to-purple-600 text-white relative overflow-hidden h-full">
            <CardContent className="items-center justify-center flex flex-col text-center h-full">
              <h3 className="text-2xl font-bold tracking-wider mb-4">
                FleetX <span className="font-light">RATING</span>
              </h3>
              <Button variant="outline" className="bg-white border-none">
                <div className="text-2xl font-bold tracking-widest">
                  {formatRating(findRatingValue('MashkorRating'))}
                  <span className="text-lg ml-2">
                    ({findRatingValue('MashkorRatingCount')})
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
                  <Truck />
                  Courier Dashboard
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue('CourierDashboard'))}
                  <span className="ml-1">
                    ({findRatingValue('CourierDashboardCount')})
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
                      {formatRating(findRatingValue('CourierDashboardPickup'))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('CourierDashboardPickupCount')})
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
                        findRatingValue('CourierDashboardDelivery')
                      )}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('CourierDashboardDeliveryCount')})
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
                  <Smartphone />
                  Mobile App
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue('MobileApp'))}
                  <span className="ml-1">
                    ({findRatingValue('MobileAppCount')})
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
                      {formatRating(findRatingValue('MobileAppPickup'))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('MobileAppPickupCount')})
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
                      {formatRating(findRatingValue('MobileAppBuy'))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('MobileAppBuyCount')})
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
                  <Users />
                  Seller Dashboard
                </div>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-2xl text-sm flex items-center">
                  <Star
                    className="w-4 h-4 mr-2 text-green-400"
                    fill="currentColor"
                  />
                  {formatRating(findRatingValue('SellerDashboard'))}
                  <span className="ml-1">
                    ({findRatingValue('SellerDashboardCount')})
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
                      {formatRating(findRatingValue('SellerDashboardPickup'))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('SellerDashboardPickupCount')})
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
                      {formatRating(findRatingValue('SellerDashboardDelivery'))}
                    </span>
                    <span className="ml-1 text-xs">
                      ({findRatingValue('SellerDashboardDeliveryCount')})
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>

      {modalData && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="w-max sm:max-w-full  bg-white">
            <DialogHeader>
              <DialogTitle>Buddy Details</DialogTitle>
            </DialogHeader>
            <RateImproveBuddies
              improvementType={modalData.improvementType}
              resBuddyList={modalData.resBuddyList}
              isDetailedPopup={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </Dashboard>
  );
}
