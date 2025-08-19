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
import { TypeLiveOrderDisplay } from '@/shared/types/orders';
import { configService } from '@/shared/services/app-config';
import { useOrderStore } from '@/store/useOrderStore';
import { hasErrors, hasValue } from '@/shared/lib/helpers';
import { useDeliveryFeeCalculator } from '@/features/orders/hooks/useDeliveryFeeCalculator';
import { orderService } from '@/features/orders/services/ordersApi';
import { CardHeader, CardTitle } from '@/shared/components/ui/card';
import { id } from 'zod/v4/locales';

// Main component
export default function ShippingForm() {
  const { user } = useAuthStore();
  const { appConstants, readAppConstants } = useSharedStore();
  const [isDropIndex, setIsDropofIndex] = useState<number>(0);

  const { branchId, vendorId } = useStorageStore();

  const [isCOD, setIsCOD] = useState(false);
  const [liveOrderDisplay, setLiveOrderDisplay] =
    useState<TypeLiveOrderDisplay>();
  const orderStore = useOrderStore();
  // const { totalOrders, totalDelivery, totalKM, deliveryModel } =
  //   useDeliveryFeeCalculator();

  const pickUpForm = useForm<TypePickUpSchema>({
    resolver: zodResolver(pickUpSchema),
    defaultValues: {
      senderName: '',
      phone: '',
      area: '',
      area_id: '',
      block: '',
      block_id: '',
      street: '',
      street_id: '',
      building: '',
      building_id: '',
      apartmentNo: '',
      floor: '',
      additionalAddress: '',
      latitude: '',
      longitude: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const dropOffForm = useForm<TypeDropOffSchema>({
    resolver: zodResolver(dropOffSchema),
    defaultValues: {
      orderNumber: '',
      customerName: '',
      phone: '',
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
      apartmentNo: '',
      floor: '',
      additionalAddress: '',
      amount: '',
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
    return () => {};
  }, []);

  useEffect(() => {
    // memoize the debounced fn so it doesn't recreate on each render
    const debouncedSearch = debounce((val: string) => {
      searchAddressByMobileNumber(val);
    }, 400);

    const subscription = dropOffForm.watch((value, { name }) => {
      if (name === 'phone') {
        const mobileNumber = value.phone || '';
        if (!dropOffForm.formState.errors.phone) {
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
    hasValue(pickUpFormValues.phone) &&
    hasValue(pickUpFormValues.street_id) &&
    hasValue(pickUpFormValues.floor) &&
    hasValue(dropOffFormValues.phone) &&
    hasValue(dropOffFormValues.street_id) &&
    hasValue(dropOffFormValues.customerName) &&
    (isCOD ? hasValue(dropOffFormValues.amount) : true);

  const prevIsActiveRef = useRef(false);

  useEffect(() => {
    if (isActive && !prevIsActiveRef.current) {
      useOrderStore.setState((state) => {
        const updatedDropOffs = [...state.dropOffs];
        updatedDropOffs[isDropIndex] = {
          ...(dropOffFormValues as any),
        };

        return {
          pickUp: {
            ...(pickUpFormValues as any),
          },
          dropOffs: updatedDropOffs,
        };
      });
    }

    prevIsActiveRef.current = isActive;
  }, [isActive, pickUpFormValues, dropOffFormValues]);

  const updatePickUpDetailsForBranchUser = async () => {
    if (user?.roles?.includes('VENDOR_USER') && branchId) {
      if (orderStore.pickUp) {
        Object.entries(orderStore.pickUp).forEach(([key, value]) => {
          // @ts-ignore
          pickUpForm.setValue(key as keyof typeof orderStore.pickUp, value);
        });
      } else
        try {
          const res = await VendorService.getBranchDetailByBranchId({
            vendor_id: vendorId!,
            branch_id: branchId!,
          });

          Object.entries(res.data.address).forEach(([key, value]) => {
            // @ts-ignore
            pickUpForm.setValue(key as keyof typeof res.data.address, value);
          });

          pickUpForm.setValue('senderName', res.data.name);
          pickUpForm.setValue('phone', res.data.mobile_number);
        } catch (error) {
          console.error('Error fetching branch ddetails:', error);
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
      // dropOffForm.setFocus('address', res.data.address);
    } catch (error) {
      console.error(error);
    }
  };

  const liveDeliverySourceDestination = (index: number) => {
    setLiveOrderDisplay({
      source: index > 0 ? 'D' + index : 'P',
      destination: 'D' + (index + 1),
    });
  };

  const onSenderSubmit = (values: z.infer<TypePickUpSchema>) => {
    console.log('Sender Form Data:', values);
  };

  const onRecipientSubmit = (values: z.infer<TypeDropOffSchema>) => {
    console.log('Recipient Form Data:', values);
  };

  const liveDeliveryFeeAndDistance = (index: number) => {
    if (1 > 2) {
      setLiveOrderDisplay({
        source: '0',
        destination: '0',
      });
    } else {
      setLiveOrderDisplay({
        source: '0',
        destination: '0',
      });
    }
  };

  const isDropoffOne = orderStore.dropOffs.length === 0;

  const handleAddOneDropoff = () => {
    if (isActive) {
      useOrderStore.setState((state) => {
        return {
          dropOffs: [...state.dropOffs, dropOffFormValues as any],
        };
      });
      dropOffForm.reset();
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
      dropOffForm.reset(dropOffData);

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
          dropOffForm.reset(firstDropOff);
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
  console.log(orderStore.dropOffs);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col md:flex-row items-start justify-start gap-10 min-h-screen">
      <div className="grid grid-cols-2 h-full rounded-md  gap-10 w-full">
        {/* PICK UP FORM */}

        <PickUpForm onSenderSubmit={onSenderSubmit} senderForm={pickUpForm} />

        {/* DROP OFF FORM */}

        <div className="grid gap-4">
          {orderStore.dropOffs?.map((item, idx) => (
            <Fragment key={idx}>
              <Suspense>
                {
                  <div className="shadow">
                    <CardHeader className="bg-cyan-50 rounded-t-lg p-4 flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
                        Drop Off {item.orderNumber}
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

          {orderStore.dropOffs.length === 0 && (
            <div className="shadow">
              <CardHeader className="bg-cyan-50 rounded-t-lg p-4 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
                  Drop Off {dropOffFormValues.orderNumber}
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
