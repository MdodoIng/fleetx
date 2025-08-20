'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Plus,
  MapPin,
  Lightbulb,
  Coins,
  Truck,
  Clock,
  DollarSign,
  Delete,
  Edit,
} from 'lucide-react';
import { useState, useEffect, useRef, Suspense, Fragment } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { never, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import PickUpForm from '@/features/orders/components/create/PickUpForm';
import DropoffForm from '@/features/orders/components/create/DropOffForm';
import { useAuthStore, useSharedStore } from '@/store';
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

import { VendorService } from '@/shared/services/vender';
import { debounce } from 'lodash';
import { useStorageStore } from '@/shared/services/storage';
import LoadingPage from '../../loading';
import {
  TypeDropOffs,
  TypeEstimatedDelivery,
  TypeLiveOrderDisplay,
  TypePickUp,
} from '@/shared/types/orders';
import { configService } from '@/shared/services/app-config';
import { useOrderStore } from '@/store/useOrderStore';
import { hasErrors, hasValue } from '@/shared/lib/helpers';
import { useDeliveryFeeCalculator } from '@/features/orders/hooks/useDeliveryFeeCalculator';
import { orderService } from '@/features/orders/services/ordersApi';
import { CardHeader, CardTitle } from '@/shared/components/ui/card';

// Main component
export default function ShippingForm() {
  const { user } = useAuthStore();
  const { appConstants, readAppConstants } = useSharedStore();
  const [isDropIndex, setIsDropofIndex] = useState<number>(0);

  const { branchId, vendorId } = useStorageStore();

  const [isCOD, setIsCOD] = useState<1 | 2>(1);
  const [liveOrderDisplay, setLiveOrderDisplay] =
    useState<TypeLiveOrderDisplay>();
  const orderStore = useOrderStore();
  // const { totalOrders, totalDelivery, totalKM, deliveryModel } =
  //   useDeliveryFeeCalculator();

  const pickUpForm = useForm<TypePickUpSchema>({
    resolver: zodResolver(pickUpSchema),
    defaultValues: {
      customer_name: '',
      mobile_number: '',
      area: '',
      area_id: '',
      block: '',
      block_id: '',
      street: '',
      street_id: '',
      building: '',
      building_id: '',
      apartment_no: '',
      floor: '',
      additional_address: '',
      latitude: '',
      longitude: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const dropOffForm = useForm<TypeDropOffSchema>({
    resolver: zodResolver(dropOffSchema),
    defaultValues: {
      order_index: '',
      customer_name: '',
      mobile_number: '',
      area: '',
      area_id: '',
      block: '',
      block_id: '',
      street: '',
      street_id: '',
      building: '',
      building_id: '',
      latitude: '',
      longitude: '',
      apartment_no: '',
      floor: '',
      additional_address: '',
      amount_to_collect: '',
    },

    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const pickUpFormValues = pickUpForm.watch();
  const dropOffFormValues = dropOffForm.watch();

  // Effects
  useEffect(() => {
    readAppConstants();
    updatePickUpDetailsForBranchUser();
    updateDropOutDetailsForStore();
    return () => {};
  }, []);

  useEffect(() => {
    // memoize the debounced fn so it doesn't recreate on each render
    const debouncedSearch = debounce((val: string) => {
      searchAddressByMobileNumber(val);
    }, 400);

    const subscription = dropOffForm.watch((value, { name }) => {
      if (name === 'mobile_number') {
        const mobileNumber = value.mobile_number || '';
        if (!dropOffForm.formState.errors.mobile_number) {
          debouncedSearch(mobileNumber);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      debouncedSearch.cancel(); // cleanup debounce
    };
  }, [dropOffForm]);

  const isActive =
    !hasErrors(pickUpForm) &&
    !hasErrors(dropOffForm) &&
    hasValue(pickUpFormValues.mobile_number) &&
    hasValue(pickUpFormValues.street_id) &&
    hasValue(pickUpFormValues.floor) &&
    hasValue(dropOffFormValues.mobile_number) &&
    hasValue(dropOffFormValues.street_id) &&
    hasValue(dropOffFormValues.customer_name) &&
    (isCOD === 2 ? hasValue(dropOffFormValues.amount_to_collect) : true);

  const prevIsActiveRef = useRef(false);

  const updatePickUpDetailsForBranchUser = async () => {
    if (user?.roles?.includes('VENDOR_USER') && branchId) {
      if (orderStore.pickUp?.area) {
        Object.entries(orderStore.pickUp).forEach(([key, value]) => {
          // @ts-ignore
          pickUpForm.setValue(key as keyof typeof orderStore.pickUp, value);
        });
      }
      try {
        const res = await VendorService.getBranchDetailByBranchId({
          vendor_id: vendorId!,
          branch_id: branchId!,
        });

        Object.entries(res.data.address).forEach(([key, value]) => {
          // @ts-ignore
          pickUpForm.setValue(key as keyof typeof res.data.address, value);
        });

        pickUpForm.setValue('customer_name', res.data.name);
        pickUpForm.setValue('mobile_number', res.data.mobile_number);
      } catch (error) {
        console.error('Error fetching branch ddetails:', error);
      }
    }
  };

  const updateDropOutDetailsForStore = () => {
    if (user?.roles?.includes('VENDOR_USER') && branchId) {
      if (orderStore.dropOffs) {
        Object.entries(orderStore.dropOffs[isDropIndex]).forEach(
          ([key, value]) => {
            // @ts-ignore
            dropOffForm.setValue(key as keyof TypeDropOffs, value);
          }
        );
      }
    }
  };

  const searchAddressByMobileNumber = async (mobileNumber: string) => {
    try {
      const res = await VendorService.getAddressByMobile(
        vendorId!,
        branchId!,
        mobileNumber
      );

      // dropOffForm.setValue('address', res.data.address);
    } catch (error) {
      console.error(error);
    }
  };

  const updateCalculateDeliveryEstimate = async (
    data: TypeEstimatedDelivery
  ) => {
    try {
      const res = await orderService.calculateDeliveryEstimate(data);
      console.log(res);
    } catch (error) {}
  };

  const onSenderSubmit = (values: z.infer<TypePickUpSchema>) => {
    console.log('Sender Form Data:', values);
  };

  const onRecipientSubmit = (values: z.infer<TypeDropOffSchema>) => {
    console.log('Recipient Form Data:', values);
  };

  const isDropoffOne = orderStore.dropOffs[0].area;

  const handleAddOneDropoff = async () => {
    if (isActive) {
      const dropOffFormValuesForDropffs: TypeDropOffs = {
        id: Number(new Date()),
        vendor_order_id: vendorId!,
        address: '',
        customer_name: dropOffFormValues.customer_name,
        area: dropOffFormValues.area,
        area_id: Number(dropOffFormValues.area_id),
        block: dropOffFormValues.area,
        block_id: Number(dropOffFormValues.block_id),
        street: dropOffFormValues.street,
        street_id: Number(dropOffFormValues.street_id),
        building: dropOffFormValues.building,
        building_id: Number(dropOffFormValues.building_id),
        floor: dropOffFormValues.floor,
        room_number: '',
        latitude: dropOffFormValues.latitude,
        longitude: dropOffFormValues.latitude,
        landmark: dropOffFormValues.additional_address,
        mobile_number: dropOffFormValues.mobile_number,
        order_index: Number(dropOffFormValues.order_index),
        amount_to_collect: Number(dropOffFormValues.amount_to_collect),
        display_address: dropOffFormValues.additional_address,
        quantity: 1,
        payment_type: isCOD,
        paci_number: '',
        specific_driver_instructions: dropOffFormValues.additional_address,
      };
      const pickUpFormValuesForPickUp: TypePickUp = {
        address: pickUpFormValues.additional_address,
        area: pickUpFormValues.area,
        area_id: Number(pickUpFormValues.area_id),
        block: pickUpFormValues.block,
        block_id: Number(pickUpFormValues.block_id),
        street: pickUpFormValues.street,
        street_id: Number(pickUpFormValues.street_id),
        building: pickUpFormValues.building,
        building_id: Number(pickUpFormValues.building_id),
        latitude: pickUpFormValues.latitude,
        longitude: pickUpFormValues.longitude,
        floor: pickUpFormValues.floor,
        room_number: pickUpFormValues.apartment_no,
        landmark: pickUpFormValues.apartment_no,
        mobile_number: pickUpFormValues.mobile_number,
        customer_name: pickUpFormValues.customer_name,
        paci_number: '',
      };

      useOrderStore.setState((state) => {
        return {
          dropOffs: [...state.dropOffs, dropOffFormValuesForDropffs],
          pickUp: pickUpFormValuesForPickUp,
        };
      });

      const estimatedDeliveryData: TypeEstimatedDelivery = {
        branch_id: branchId!,
        vendor_id: vendorId!,
        drop_offs: orderStore.dropOffs,
        delivery_model: orderStore.deliveryModel.key!,
        order_session_id: '',
        pickup: orderStore.pickUp!,
      };
      useOrderStore.setState({
        estimatedDelivery: estimatedDeliveryData,
      });
      await updateCalculateDeliveryEstimate(estimatedDeliveryData);
      dropOffForm.reset();
      setIsDropofIndex(orderStore.dropOffs.length);
    }
  };

  const handleEditOneDropoff = (index: number) => {
    if (
      isActive &&
      dropOffFormValues &&
      index >= 0 &&
      index < orderStore.dropOffs.length
    ) {
      // Create a proper deep copy to avoid mutation
      const updatedDropOffs = [...orderStore.dropOffs];

      // Update the specific drop-off at the given index
      updatedDropOffs[index] = { ...dropOffFormValues } as any;

      // Update the store in one atomic operation
      useOrderStore.setState((state) => ({
        ...state,
        dropOffs: updatedDropOffs,
      }));
    }
  };

  const handleSaveCurrentDropOff = () => {
    if (isActive && dropOffFormValues) {
      useOrderStore.setState((state) => {
        const newDropOffs = [...state.dropOffs];
        newDropOffs[isDropIndex] = { ...dropOffFormValues } as any;

        return {
          ...state,
          dropOffs: newDropOffs,
        };
      });
    }
  };

  const handleEditDropOffWithSave = (index: number) => {
    try {
      // Save current changes if we're editing a different drop-off
      if (isDropIndex !== index && isActive) {
        handleSaveCurrentDropOff();
      }

      // Validate index bounds
      if (index < 0 || index >= orderStore.dropOffs.length) {
        console.error(
          `Invalid index: ${index}. Array length: ${orderStore.dropOffs.length}`
        );
        return;
      }

      const dropOffData = orderStore.dropOffs[index];

      if (!dropOffData) {
        console.error(`No drop-off data found at index ${index}`);
        return;
      }

      // Set the current editing index
      setIsDropofIndex(index);

      // Load the data into the form
      dropOffForm.reset();

      console.log(`Editing drop-off at index ${index}`);
    } catch (error) {
      console.error('Error loading drop-off for editing:', error);
    }
  };
  const handleDeleteDropOff = (index: number) => {
    try {
      // Prevent deletion if it's the last drop-off
      if (orderStore.dropOffs.length <= 1) {
        console.warn(
          'Cannot delete the last drop-off. At least one drop-off is required.'
        );
        // You might want to show a toast notification here
        return;
      }

      // Validate index
      if (index < 0 || index >= orderStore.dropOffs.length) {
        console.error(
          `Invalid index: ${index}. Valid range: 0-${orderStore.dropOffs.length - 1}`
        );
        return;
      }

      // Save current form data before deletion if we're editing
      if (isActive && isDropIndex !== index) {
        // Save current editing form data
        useOrderStore.setState((state) => {
          const updatedDropOffs = [...state.dropOffs];
          updatedDropOffs[isDropIndex] = { ...dropOffFormValues } as any;

          return {
            ...state,
            dropOffs: updatedDropOffs,
          };
        });
      }

      // Delete the item
      useOrderStore.setState((state) => {
        const updatedDropOffs = [...state.dropOffs];
        updatedDropOffs.splice(index, 1);

        return {
          ...state,
          pickUp: {
            ...(pickUpFormValues as any),
          },
          dropOffs: updatedDropOffs,
        };
      });

      // Handle editing index adjustment
      if (isDropIndex === index) {
        // If we deleted the currently edited item, switch to the first one
        setIsDropofIndex(0);
        // Load the first item's data into the form
        const firstDropOff = orderStore.dropOffs[0];
        if (firstDropOff) {
          dropOffForm.reset();
        }
      } else if (isDropIndex > index) {
        // If we deleted an item before the current one, adjust the index
        setIsDropofIndex(isDropIndex - 1);
      }

      console.log(`Successfully deleted drop-off at index ${index}`);
    } catch (error) {
      console.error('Error deleting drop-off:', error);
    }
  };
  console.log(orderStore.dropOffs, isActive);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col md:flex-row items-start justify-start gap-10 min-h-screen">
      <div className="grid grid-cols-2 h-full rounded-md  gap-10 w-full">
        {/* PICK UP FORM */}

        <PickUpForm onSenderSubmit={onSenderSubmit} senderForm={pickUpForm} />

        {/* DROP OFF FORM */}

        <div className="grid gap-4">
          {isDropoffOne &&
            orderStore.dropOffs?.map((item, idx) => (
              <Fragment key={idx}>
                <Suspense>
                  {
                    <div className="shadow">
                      <CardHeader className="bg-cyan-50 rounded-t-lg p-4 flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
                          Drop Off {item?.customer_name}
                        </CardTitle>
                        {idx == isDropIndex ? (
                          <Button
                            disabled={!isActive}
                            onClick={() => handleAddOneDropoff()}
                          >
                            <Plus /> dropOff {idx + 1}
                          </Button>
                        ) : (
                          <div className="grid-cols-2 grid gap-4">
                            <Button
                              onClick={() => handleDeleteDropOff(idx)}
                              variant="destructive"
                            >
                              <Delete />
                            </Button>
                            <Button
                              onClick={() => handleEditDropOffWithSave(idx)}
                              variant="secondary"
                            >
                              <Edit />
                            </Button>
                          </div>
                        )}
                      </CardHeader>
                      {isDropIndex === idx && (
                        <DropoffForm
                          onRecipientSubmit={onRecipientSubmit}
                          recipientForm={dropOffForm}
                          shallCollectCash={isCOD}
                          setIsCOD={setIsCOD}
                        />
                      )}
                    </div>
                  }
                </Suspense>
              </Fragment>
            ))}

          {!isDropoffOne && (
            <div className="shadow">
              <CardHeader className="bg-cyan-50 rounded-t-lg p-4 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
                  Drop Off {dropOffFormValues.order_index}
                </CardTitle>

                <Button
                  disabled={!isActive}
                  onClick={() => handleAddOneDropoff()}
                >
                  <Plus /> dropOff
                </Button>
              </CardHeader>

              <DropoffForm
                onRecipientSubmit={onRecipientSubmit}
                recipientForm={dropOffForm}
                shallCollectCash={isCOD}
                setIsCOD={setIsCOD}
              />
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-between bg-white border rounded-lg shadow-sm  text-sm text-gray-700 w-full col-span-2 p-3">
          {/* Left Section */}
          <div className="flex items-center space-x-6">
            <span className="font-medium text-blue-600 cursor-pointer">
              Order Details
            </span>

            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>Distance: {liveOrderDisplay?.distance} </span>
            </div>

            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4 text-gray-500" />
              <span>Drop-off: {liveOrderDisplay?.source}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                Est. Time:{' '}
                <span className="font-medium">{liveOrderDisplay?.source}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>
                Delivery Fee:{' '}
                <span className="text-blue-600 font-medium">
                  {' '}
                  {appConstants?.currency} {liveOrderDisplay?.deliveryFee}
                </span>
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100">
              Cancel
            </button>
            <Button
              disabled={!isActive}
              className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700"
            >
              Create Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
