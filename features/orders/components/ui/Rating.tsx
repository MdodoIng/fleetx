'use client';

import React, { useEffect, useState } from 'react';
import { Star, Check } from 'lucide-react';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { getDeliveryRate, setDeliveryRate } from '@/shared/services';
import { cn } from '@/shared/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { toast } from 'sonner';
import { typePostRating } from '@/shared/types/rate';

// Constants
const MAX_RATE = 5;
const MIN_RATE_FOR_FEEDBACK = 4;
const RATING_EXPIRY_HOURS = 6;

const RATE_REASONS = [
  { id: 1, name: "Buddy's Hygiene" },
  { id: 2, name: 'Late Pickup' },
  { id: 3, name: 'Late Delivery' },
  { id: 4, name: "Buddy's Behavior" },
  { id: 5, name: 'Service Quality' },
  { id: 6, name: 'Other Issues' },
];

interface RatingProps {
  order: TypeOrderHistoryList & { completed_at?: any };
  onChange?: (rating: number) => void;
}

// Cache for ratings to avoid repeated API calls
const ratingCache = new Map<
  string,
  { rating: number; timestamp: number; improvements?: string[] }
>();

const Rating: React.FC<RatingProps> = ({ order, onChange }) => {
  const [rating, setRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState<any>(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState<number | null>();
  const [isFeedback, setIsFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isShowSuccess, setIsShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [canRate, setCanRate] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);

  const checkRatingEligibility = () => {
    // Check if order is completed
    if (!order.delivered_date) {
      return {
        canRate: false,
        message: 'Pending delivery',
      };
    }

    // Check if within rating time window
    const completedTime = new Date(order.delivered_date).getTime();
    const now = new Date().getTime();
    const diffHours = (now - completedTime) / (1000 * 60 * 60);

    if (diffHours > RATING_EXPIRY_HOURS) {
      return {
        canRate: false,
        message: 'Rating expired',
      };
    }

    return { canRate: true, message: '' };
  };

  const fetchRating = async () => {
    const orderNumber = order.fleetx_order_number;

    // Check cache first
    const cached = ratingCache.get(orderNumber);
    if (cached) {
      const now = Date.now();
      // Cache for 5 minutes to reduce API calls
      if (now - cached.timestamp < 5 * 60 * 1000) {
        setRating(cached.rating);
        setImprovements(cached.improvements || []);
        return;
      }
    }

    try {
      const ratingData = await getDeliveryRate(orderNumber);
      const fetchedRating = ratingData?.data?.rating || 0;
      const fetchedImprovements = ratingData?.data?.improvements || [];

      setRating(fetchedRating);
      setImprovements(fetchedImprovements);

      // Update cache
      ratingCache.set(orderNumber, {
        rating: fetchedRating,
        improvements: fetchedImprovements,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      console.log('Error fetching rating:', err?.message);
      setRating(0);
      setImprovements([]);
    }
  };

  const handleRatingClick = (value: number) => {
    setSelectedRating(value);
    setErrorMessage(undefined);

    if (value < MIN_RATE_FOR_FEEDBACK) {
      setIsFeedback(true);
    } else {
      setIsFeedback(false);
      setFeedback(null);
    }
  };

  const handleFeedbackChange = (value: number) => {
    setFeedback(value);
    setErrorMessage(undefined);
  };

  const validateAndSubmit = () => {
    if (!selectedRating) {
      setErrorMessage('Please select a rating.');
      return;
    } else if (selectedRating < MIN_RATE_FOR_FEEDBACK && !feedback) {
      setErrorMessage('Please select your feedback for ratings below 4 stars.');
      return;
    } else {
      // submitRating();
    }
  };

  const submitRating = async () => {
    setLoading(true);
    setErrorMessage('');

    const request: typePostRating = {
      order_number: order.fleetx_order_number,
      rating: selectedRating,
      improvment_item: feedback || null,
    };

    try {
      await setDeliveryRate(request);

      // Update local state and cache
      setRating(selectedRating);
      const improvementName = feedback
        ? RATE_REASONS.find((r) => r.id === feedback)?.name
        : '';
      const newImprovements = improvementName ? [improvementName] : [];
      setImprovements(newImprovements);

      // Update cache
      ratingCache.set(order.fleetx_order_number, {
        rating: selectedRating,
        improvements: newImprovements,
        timestamp: Date.now(),
      });

      setIsShowSuccess(true);
      onChange?.(selectedRating);

      toast('Rating Submitted', {
        description: `Thank you for rating this order ${selectedRating} star${selectedRating !== 1 ? 's' : ''}!`,
      });
    } catch (err: any) {
      setErrorMessage('Failed to submit rating. Please try again.');
      toast('Rating Failed', {
        description: err?.error?.message || 'Failed to submit rating.',
        action: {
          label: 'Try Again',
          onClick: () => submitRating(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSelectedRating(0);
    setHoveredRating(0);
    setFeedback(undefined);
    setIsFeedback(false);
    setErrorMessage(undefined);
    setIsShowSuccess(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      resetDialog();
    }
  };

  useEffect(() => {
    const eligibility = checkRatingEligibility();
    setCanRate(eligibility.canRate);
    setStatusMessage(eligibility.message);

    fetchRating();
  }, [order?.completed_at, order?.fleetx_order_number]);

  const renderStars = (
    interactive: boolean = false,
    size: 'small' | 'large' = 'small'
  ) => {
    return Array.from({ length: MAX_RATE }, (_, index) => {
      const starValue = index + 1;
      const isActive = interactive
        ? (hoveredRating || selectedRating) >= starValue
        : starValue <= rating;

      return (
        <button
          key={starValue}
          type="button"
          className={cn(
            'transition-colors duration-200',
            size === 'large' ? 'text-4xl' : 'text-sm',
            isActive ? 'text-primary-blue' : 'text-gray-300',
            interactive && canRate
              ? 'hover:text-primary-blue cursor-pointer hover:scale-110'
              : 'cursor-default'
          )}
          onClick={() => interactive && canRate && handleRatingClick(starValue)}
          onMouseEnter={() =>
            interactive && canRate && setHoveredRating(starValue)
          }
          onMouseLeave={() => interactive && canRate && setHoveredRating(0)}
          disabled={!interactive || !canRate || loading}
        >
          <Star
            className={cn(size === 'large' ? 'size-10' : 'size-3.5')}
            fill={isActive ? 'currentColor' : 'none'}
          />
        </button>
      );
    });
  };

  if (isShowSuccess) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-gray-600 text-sm">Rate:</span>
            <div className="flex gap-1">{renderStars(false, 'small')}</div>
            <span className="text-xs text-green-600 font-medium">
              {rating}/5
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <Card className="border-none shadow-none">
            <CardContent className="p-6 text-center">
              {/* Success Animation */}
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary-blue relative bg-white">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-blue/20 animate-ping"></div>
                  <Check className="w-10 h-10 text-primary-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
              </div>

              <h5 className="text-lg font-medium text-dark-grey mb-4">
                Thank you for the rating!
              </h5>

              <div className="flex justify-center space-x-2 mb-4">
                {renderStars(false, 'large')}
              </div>

              {improvements.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Feedback:</p>
                  {improvements.map((improvement, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 mr-2"
                    >
                      {improvement}
                    </span>
                  ))}
                </div>
              )}

              <Button onClick={() => setOpen(false)} className="mt-4">
                Close
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-gray-600 text-sm">Rate:</span>
          <div className="flex gap-1">{renderStars(false, 'small')}</div>
          {rating > 0 ? (
            <span className="text-xs text-green-600 font-medium">
              {rating}/5
            </span>
          ) : (
            <span className="text-xs text-gray-400">{statusMessage}</span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <Card className="border-none shadow-none">
          <CardContent className="p-6">
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
              </div>
            )}

            <div className="space-y-6">
              {/* Rating Question */}
              <div className="text-center">
                <h5 className="text-lg font-medium text-dark-grey mb-6">
                  How would you rate this order?
                </h5>

                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-6">
                  {renderStars(true, 'large')}
                </div>
              </div>

              {/* Feedback Section */}
              {isFeedback && (
                <div className="space-y-4">
                  <h5 className="text-sm font-medium text-dark-grey text-center">
                    What can we improve?
                  </h5>

                  <Select
                    onValueChange={handleFeedbackChange as any}
                    value={feedback?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select feedback category" />
                    </SelectTrigger>
                    <SelectContent>
                      {RATE_REASONS.map((reason) => (
                        <SelectItem
                          key={reason.id}
                          value={reason.id.toString()}
                        >
                          {reason.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="text-center text-red-500 text-sm">
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => validateAndSubmit()}
                  disabled={loading || !canRate}
                >
                  {loading ? 'Submitting...' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default Rating;
