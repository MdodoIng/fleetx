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

interface DropOffCardValue {
  source: string;
  destination: string;
  distance: number;
  deliveryFee: number;
  customerName: string;
  address: string;
  index: number;
}

interface LiveOrderDisplayModel {
  source: string;
  destination: string;
  distance: number;
  deliveryFee: number;
}

interface TotalOrderHistory {
  totalOrders: number;
  totalKM: number;
  totalDelivery: number;
}

interface EstimatedDeliveryModel {
  order_session_id: string;
  vendor_id: string;
  branch_id: string;
  pickup: any;
  drop_offs: any[];
}

interface SelectedAddress {
  id: string;
  name_en: string;
  type: string;
  latitude?: number;
  longitude?: number;
  area_id?: string;
  block_id?: string;
}

interface Option {
  id: string;
  value: string;
}

// Main component
export default function ShippingForm() {
  const { user } = useAuthStore();

  // State
  const [isCOD, setIsCOD] = useState(false);
  const [submitPlaceOrder, setSubmitPlaceOrder] = useState(false);

  // Complex state objects
  const [dropOffCardValues, setDropOffCardValues] = useState<
    DropOffCardValue[]
  >([]);

  const [estimatedDeliveryData, setEstimatedDeliveryData] =
    useState<EstimatedDeliveryModel>({
      order_session_id: '',
      vendor_id: '',
      branch_id: '',
      pickup: null,
      drop_offs: [],
    });

  const [selectedAddressPickUp, setSelectedAddressPickUp] = useState<
    SelectedAddress[]
  >([]);
  const [selectedAddressDropOff, setSelectedAddressDropOff] = useState<
    SelectedAddress[]
  >([]);

  // Refs
  const placeOrderButtonRef = useRef<HTMLButtonElement>(null);

  // Forms
  const pickUpForm = useForm<TypePickUpSchema>({
    resolver: zodResolver(pickUpSchema),
    defaultValues: {
      customerName: '',
      paciNumber: '',
      floor: '',
      landmark: [''],
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
      landmark: '',
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

    return () => {
      // Cleanup
      setSelectedAddressDropOff([]);
      setSelectedAddressPickUp([]);
      setEstimatedDeliveryData({
        order_session_id: '',
        vendor_id: '',
        branch_id: '',
        pickup: null,
        drop_offs: [],
      });
    };
  }, []);

  useEffect(() => {
    // Watch form changes
    const mobileNumberSubscription = dropOffForm.watch((value, { name }) => {
      if (name === 'mobileNumber') {
        debouncedMobileNumberSearch(value.mobileNumber || '');
      }
    });

    return () => mobileNumberSubscription.unsubscribe();
  }, [dropOffForm.watch, debouncedMobileNumberSearch]);

  // Helper functions

  const updatePickUpDetailsForBranchUser = () => {
    // Get current user details and update pickup form
    const currentUser = getCurrentUser();
    if (
      currentUser?.roles[0] === 'VENDOR_USER' &&
      currentUser.user.vendor?.branch_id
    ) {
      // Fetch branch details and update form
      fetchBranchDetails(
        currentUser.user.vendor.vendor_id,
        currentUser.user.vendor.branch_id
      );
    }
  };

  const getCurrentUser = () => {
    return user;
  };

  const fetchBranchDetails = async (vendorId: string, branchId: string) => {
    try {
      // Mock API call - replace with actual service
      console.log('Fetching branch details...', vendorId, branchId);
    } catch (error) {
      console.error('Error fetching branch details:', error);
    }
  };

  const searchAddressByMobileNumber = (mobileNumber: string) => {
    if (mobileNumber && mobileNumber.length >= 7) {
      // Mock API call to search addresses by mobile number
      console.log('Searching addresses for:', mobileNumber);
    }
  };

  const onClickAddDropOff = () => {
    const orderLimit = commonConstants.ORDER_LIMIT_BAHRAIN;
    if (dropOffCardValues.length >= orderLimit) {
      alert('Grouping orders limit reached');
      return;
    }

    if (selectedAddressPickUp.length < 2) {
      alert('Please select pickup address');
      return;
    }

    if (selectedAddressDropOff.length < 2) {
      alert('Please select customer address');
      return;
    }

    // Add drop off logic
    console.log('Adding drop off...');
  };

  const onClickPlaceOrder = async () => {
    if (submitPlaceOrder) return;

    setSubmitPlaceOrder(true);

    if (!basicValidationForPlaceOrder()) {
      setSubmitPlaceOrder(false);
      return;
    }

    try {
      // Create order object and submit
      const order = createOrderObject();
      await submitOrder(order);

      // Show success message and reset form
      showSuccessMessage();
      resetAfterPlaceOrder();
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setSubmitPlaceOrder(false);
    }
  };

  const basicValidationForPlaceOrder = () => {
    return (
      pickUpForm.formState.isValid &&
      dropOffCardValues.length > 0 &&
      selectedAddressPickUp.length >= 2 &&
      selectedAddressDropOff.length >= 2
    );
  };

  const createOrderObject = () => {
    // Create order object from form data
    return {
      pick_up: createPickUpObject(),
      drop_offs: estimatedDeliveryData.drop_offs,
      vendor_id: estimatedDeliveryData.vendor_id,
      branch_id: estimatedDeliveryData.branch_id,
      order_session_id: estimatedDeliveryData.order_session_id,
      driver_id: null,
    };
  };

  const createPickUpObject = () => {
    const pickUpData = pickUpForm.getValues();
    return {
      customer_name: pickUpData.customerName,
      mobile_number: pickUpData.mobileNumber,
      landmark: pickUpData.landmark,
      floor: pickUpData.floor,
      area: selectedAddressPickUp[0]?.name_en,
      area_id: selectedAddressPickUp[0]?.id,
      block: selectedAddressPickUp[1]?.name_en,
      block_id: selectedAddressPickUp[1]?.id,
      street: selectedAddressPickUp[2]?.name_en,
      street_id: selectedAddressPickUp[2]?.id,
    };
  };

  const submitOrder = async (order: any) => {
    // Mock API call - replace with actual service
    console.log('Submitting order:', order);
    return Promise.resolve({ data: { order_number: 'ORD-123' } });
  };

  const showSuccessMessage = () => {
    alert('Order placed successfully!');
  };

  const resetAfterPlaceOrder = () => {
    pickUpForm.reset();
    dropOffForm.reset({ paymentType: PAYMENTTYPE.KNET });
    setSelectedAddressPickUp([]);
    setSelectedAddressDropOff([]);
    setDropOffCardValues([]);
    setEstimatedDeliveryData({
      order_session_id: '',
      vendor_id: '',
      branch_id: '',
      pickup: null,
      drop_offs: [],
    });
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
              onClick={onClickAddDropOff}
            >
              <Plus className="w-4 h-4 mr-1" />
              Save and add drop off
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={!basicValidationForPlaceOrder()}
              className="bg-gray-200 text-gray-400 hover:bg-gray-200"
              onClick={onClickPlaceOrder}
              ref={placeOrderButtonRef}
            >
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
