import React, { useState, useEffect } from 'react';
import { Star, Check } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { cn } from '@/shared/lib/utils';

// Constants
const MAX_RATE = 5;
const MIN_RATE_FOR_FEEDBACK = 4;

const RATE_REASONS = [
  { id: 1, name: "Buddy's Hygiene" },
  { id: 2, name: 'Late Pickup' },
  { id: 3, name: 'Late Delivery' },
  { id: 4, name: "Buddy's Behavior" },
  { id: 5, name: 'Service Quality' },
  { id: 6, name: 'Other Issues' },
];

const RATE_TYPES = {
  rateDelivery: 1,
  ratePickUp: 2,
  ratePickUpFromNotify: 3,
  rateFirstOrderPickUp: 4,
};

interface RatingPopupProps {
  rateType?: number;
  currentRates?: number;
  orderNumber?: string;
  improvements?: Array<{ improvement_type: number }>;
}

export default function RatingPopup({
  rateType = RATE_TYPES.rateDelivery,
  currentRates,
  orderNumber,
  improvements = [],
}: RatingPopupProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isFeedback, setIsFeedback] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);
  const [isAlreadyRate, setIsAlreadyRate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [iDontCare, setIDontCare] = useState<boolean>(false);
  const [improvementsList, setImprovementsList] = useState<string[]>([]);
  const [open, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentRates) {
      setIsAlreadyRate(true);
      // Map improvements to names
      const impNames = improvements
        .map((element) => {
          const impValue = RATE_REASONS.find(
            (x) => x.id === element.improvement_type
          );
          return impValue?.name || '';
        })
        .filter((name) => name);
      setImprovementsList(impNames);
    }
  }, [currentRates, improvements]);

  const handleRating = (value: number) => {
    setSelectedRating(value);
    setErrorMessage('');

    if (value < MIN_RATE_FOR_FEEDBACK) {
      setIsFeedback(true);
    } else {
      setIsFeedback(false);
      setFeedback('');
    }
  };

  const handleFeedbackChange = (value: string) => {
    setFeedback(value);
    setErrorMessage('');
  };

  const handleIDoNotCare = () => {
    setIDontCare(true);
    setIsShowSuccess(true);
  };

  const validateAndSubmit = () => {
    if (!selectedRating) {
      setErrorMessage('Please rate your order.');
      return;
    }

    if (selectedRating < MIN_RATE_FOR_FEEDBACK && !feedback) {
      setErrorMessage('Please select your feedback.');
      return;
    }

    submitRating();
  };

  const submitRating = async () => {
    setLoading(true);
    setErrorMessage('');

    const request = {
      order_number: orderNumber,
      rating: selectedRating,
      improvement_item: feedback,
    };

    try {
      // Replace with your actual API calls
      switch (rateType) {
        case RATE_TYPES.rateDelivery:
          // await rateService.deliveryRate(request);
          break;
        case RATE_TYPES.ratePickUp:
          // await rateService.pickUpRate(request);
          break;
        case RATE_TYPES.ratePickUpFromNotify:
          // await rateService.pickUpRateFromNotify({...request, order_number: undefined}, orderNumber);
          break;
        case RATE_TYPES.rateFirstOrderPickUp:
          // await rateService.firstOrderPickUpRate(request);
          break;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      clearAll();
    } catch (error) {
      setErrorMessage('Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedRating(0);
    setFeedback('');
    setIsFeedback(false);
    setIsShowSuccess(true);
  };

  const renderStars = (interactive: boolean = false, size?: 'small') => {
    return Array.from({ length: MAX_RATE }, (_, index) => {
      const starValue = index + 1;
      const isActive = interactive
        ? (hoveredRating || selectedRating) >= starValue
        : currentRates
          ? starValue <= currentRates
          : false;

      return (
        <button
          key={starValue}
          type="button"
          className={cn(
            ` transition-colors duration-200`,
            size === 'small' ? 'text-sm' : 'text-4xl',
            isActive ? 'text-primary-blue' : 'text-dark-grey/10',
            interactive
              ? 'hover:text-primary-blue cursor-pointer'
              : 'cursor-default'
          )}
          onClick={() => interactive && handleRating(starValue)}
          onMouseEnter={() => interactive && setHoveredRating(starValue)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
          disabled={!interactive}
        >
          <Star className={cn(size === 'small' ? 'size-3.5' : 'size-10')} />
        </button>
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Rate:</span>
          {renderStars(true, 'small')}
        </div>
      </DialogTrigger>
      <DialogContent className="">
        <Card className="border-none shadow-none">
          <CardContent>
            {loading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
              </div>
            )}

            {!isAlreadyRate && !isShowSuccess ? (
              <div className="space-y-6">
                {/* Rating Question */}
                <div className="text-center">
                  <h5 className="text-lg font-medium text-dark-grey mb-6">
                    How would you rate us?
                  </h5>

                  {/* Star Rating */}
                  <div className="flex justify-center space-x-2 mb-6">
                    {renderStars(true)}
                  </div>
                </div>

                {/* Feedback Section */}
                {isFeedback && (
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-dark-grey text-center">
                      What can we improve?
                    </h5>

                    <Select
                      onValueChange={handleFeedbackChange}
                      value={feedback}
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
                  <div className="text-center text-red-500 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleIDoNotCare}
                    className=""
                    disabled={loading}
                  >
                    I don't care
                  </Button>

                  <Button
                    onClick={validateAndSubmit}
                    className=""
                    disabled={loading}
                  >
                    {loading ? 'Rating...' : 'Rate Now'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                {/* Thank You Message */}
                <h5 className="text-lg font-medium text-dark-grey">
                  Thank you for the rating
                </h5>

                {/* Display Current Rating */}
                <div className="flex justify-center space-x-2">
                  {renderStars(false)}
                </div>

                {/* Display Improvements */}
                {improvementsList.length > 0 && (
                  <div className="space-y-2">
                    {improvementsList.map((improvement, index) => (
                      <span
                        key={index}
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Improvement: {improvement}
                      </span>
                    ))}
                  </div>
                )}

                <Button onClick={() => setIsOpen(false)} className="mt-4">
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
