'use client';

import { Button } from '@/shared/components/ui/button';
import { Plus, MapPin, Lightbulb, Coins } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PickUpForm from '@/features/orders/components/create/PickUpForm';
import DropoffForm from '@/features/orders/components/create/DropOffForm';
import { useAuthStore } from '@/store';
import {
  commonConstants,
  PAYMENTTYPE,
} from '@/shared/constants/storageConstants';
import {
  dropOffSchema,
  pickUpSchema,
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';
import { useDebounce } from '@/shared/lib/hooks';
import {
  DropOffCardValue,
  EstimatedDeliveryModel,
  SelectedAddress,
} from '@/shared/types/orders';
import { VendorService } from '@/shared/services/vender';

// Main component
export default function ShippingForm() {
  const { user } = useAuthStore();

  // State
  const [isCOD, setIsCOD] = useState(false);

  const pickUpForm = useForm<TypePickUpSchema>({
    resolver: zodResolver(pickUpSchema),
    defaultValues: {
      customerName: '',
      paciNumber: '',
      floor: '',
      address: {},
      mobileNumber: '',
      additionalAddress: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const dropOffForm = useForm<TypeDropOffSchema>({
    resolver: zodResolver(dropOffSchema),
    defaultValues: {
      customerName: '',
      floor: '',
      roomNumber: '',
      paymentType: PAYMENTTYPE.KNET,
      address: {},
      mobileNumber: '',
      amount: '',
      additionalAddress: '',
      vendorOrderNumber: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Debounced functions
  const debouncedMobileNumberSearch = useDebounce((value: string) => {
    searchAddressByMobileNumber(value);
  }, 400);

  // Effects
  useEffect(() => {
    // Initialize component
    updatePickUpDetailsForBranchUser();

    return () => {};
  }, []);

  useEffect(() => {
    const mobileNumberSubscription = dropOffForm.watch((value, { name }) => {
      if (name === 'mobileNumber') {
        debouncedMobileNumberSearch(value.mobileNumber || '');
      }
    });

    return () => mobileNumberSubscription.unsubscribe();
  }, [dropOffForm.watch, debouncedMobileNumberSearch]);

  // Helper functions

  const updatePickUpDetailsForBranchUser = async () => {
    if (user?.roles?.includes('VENDOR_USER') && user.user.vendor?.branch_id) {
      try {
        const res = await VendorService.getBranchDetailByBranchId({
          vendor_id: user.user.vendor.vendor_id,
          branch_id: user?.user.vendor.branch_id,
        });

        pickUpForm.setValue('address', res.data.address);
        pickUpForm.setValue('customerName', res.data.name);
        pickUpForm.setValue('mobileNumber', res.data.mobile_number);
      } catch (error) {
        console.error('Error fetching branch ddetails:', error);
      }
    }
  };

  const searchAddressByMobileNumber = (mobileNumber: string) => {
    if (mobileNumber && mobileNumber.length >= 7) {
      // Mock API call to search addresses by mobile number
      console.log('Searching addresses for:', mobileNumber);
    }
  };

  const onSenderSubmit = (values: z.infer<TypePickUpSchema>) => {
    console.log('Sender Form Data:', values);
  };

  const onRecipientSubmit = (values: z.infer<TypeDropOffSchema>) => {
    console.log('Recipient Form Data:', values);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col md:flex-row items-start justify-start gap-10 min-h-screen">
      <div className="flex rounded-md max-w-full md:max-w-[70%] flex-col gap-10 w-full">
        {/* PICK UP FORM */}
        <PickUpForm onSenderSubmit={onSenderSubmit} senderForm={pickUpForm} />

        {/* DROP OFF FORM */}

        <DropoffForm
          onRecipientSubmit={onRecipientSubmit}
          recipientForm={dropOffForm}
          shallCollectCash={isCOD}
          setIsCOD={setIsCOD}
        />

        {/* BOTTOM SECTION */}
        <div className="flex items-center justify-between flex-col border rounded-lg p-3 bg-gray-50 gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-4 text-gray-500 text-sm justify-between w-full border p-4 rounded-md ">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>P.... D1</span>
            </div>
            <div className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              <span>0 KM</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span>0 KD</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              className="text-teal-500 border-teal-500 hover:bg-teal-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Save and add drop off
            </Button>

            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-200 text-gray-400 hover:bg-gray-200"
            >
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
