'use client';

import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getDeliveryRate, setDeliveryRate } from '@/store/sharedStore';
import { TypeOrderHistoryList } from '@/shared/types/orders';
import { typePostRating } from '@/shared/types/rating';

interface RatingProps {
  max?: number;
  initial?: number;
  onChange?: (rating: number) => void;
  order: TypeOrderHistoryList;
}

const Rating: React.FC<RatingProps> = ({
  max = 5,
  initial = 0,
  onChange,
  order,
}) => {
  const [rating, setRating] = useState(initial);

  const handleClick = async (value: number) => {
    // If order is not completed yet, block rating
    // @ts-ignore
    if (!order.completed_at) {
      alert('You can only rate after the order is delivered.');
      return;
    }

    // Check time difference between now and completed_at
    // @ts-ignore
    const completedTime = new Date(order.completed_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - completedTime) / (1000 * 60 * 60); // convert ms -> hours

    if (diffHours > 6) {
      alert(
        'Rating period has expired. You can only rate within 6 hours of delivery.'
      );
      return;
    }

    // ✅ Proceed with rating
    setRating(value);
    const request: typePostRating = {
      order_number: order.fleetx_order_number,
      rating: value,
      improvment_item: '' as any,
    };

    try {
      const res = await setDeliveryRate(request);
      console.log('Rating submitted:', res);
    } catch (err) {
      console.error('Failed to submit rating', err);
    }
  };

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const ratingData = await getDeliveryRate(order.fleetx_order_number);
        setRating(ratingData?.data?.rating!);
      } catch (err: any) {
        console.log(
          'Error fetching rating:',
          err.error?.message || err.message || 'An unknown error occurred.'
        );
        setRating(0);
      }
    };

    fetchRating();
  }, [order.fleetx_order_number]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600 text-sm">Rate:</span>
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => {
          const value = i + 1;
          return (
            <Star
              key={value}
              size={14}
              className={`cursor-pointer transition-colors ${
                value <= rating
                  ? 'fill-green-500 text-green-500'
                  : 'text-green-500'
              }`}
              onClick={() => handleClick(value)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Rating;
