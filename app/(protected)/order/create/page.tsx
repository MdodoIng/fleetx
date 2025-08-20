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
import { randomUUID, UUID } from 'crypto';

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
  TypeEstimatedDeliveryReturnFromApi,
  TypeLiveOrderDisplay,
  TypePickUp,
} from '@/shared/types/orders';
import { configService } from '@/shared/services/app-config';
import { useOrderStore } from '@/store/useOrderStore';
import { hasErrors, hasValue } from '@/shared/lib/helpers';

import { orderService } from '@/features/orders/services/ordersApi';
import { CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  emptyDropOff,
  usedropOffFormValuesForDropffs,
  usePickUpFormValuesForPickUp,
} from '@/features/orders/hooks/useOrders';
import DropoffFormSection from '@/features/orders/components/ui/DropoffFormSection';

// Main component
export default function ShippingForm() {
  const { user } = useAuthStore();
  const orderStore = useOrderStore();
  const { appConstants, readAppConstants } = useSharedStore();
  const [isDropIndex, setIsDropofIndex] = useState<number>(
    orderStore.dropOffs ? orderStore.dropOffs.length - 1 : 0
  );

  const { branchId, vendorId } = useStorageStore();
  const [isValid, setIsValid] = useState(false);

  const [isCOD, setIsCOD] = useState<1 | 2>(1);

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

  const validateFormsAsync = async (): Promise<boolean> => {
    try {
      // Trigger validation on both forms
      const [pickUpValid, dropOffValid] = await Promise.all([
        pickUpForm.trigger(),
        dropOffForm.trigger(),
      ]);

      const pickUpFieldsValid =
        hasValue(pickUpFormValues.customer_name) &&
        hasValue(pickUpFormValues.mobile_number) &&
        hasValue(pickUpFormValues.street_id) &&
        hasValue(pickUpFormValues.floor);

      const dropOffFieldsValid =
        hasValue(dropOffFormValues.order_index) &&
        hasValue(dropOffFormValues.customer_name) &&
        hasValue(dropOffFormValues.mobile_number) &&
        hasValue(dropOffFormValues.street_id) &&
        (isCOD === 2 ? hasValue(dropOffFormValues.amount_to_collect) : true);

      return (
        pickUpValid && dropOffValid && pickUpFieldsValid && dropOffFieldsValid
      );
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

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
    if (
      user?.roles?.includes('VENDOR_USER') &&
      branchId &&
      orderStore.dropOffs &&
      isDropIndex >= 0 &&
      isDropIndex < orderStore.dropOffs.length
    ) {
      Object.entries(orderStore.dropOffs[isDropIndex]).forEach(
        ([key, value]) => {
          dropOffForm.setValue(key as keyof TypeDropOffSchema, value);
        }
      );
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
  ): Promise<TypeEstimatedDeliveryReturnFromApi | undefined> => {
    try {
      const res = await orderService.calculateDeliveryEstimate(data);
      useOrderStore.setState({
        estimatedDeliveryReturnFromApi: res,
      });
      orderStore.setEstimatedDeliveryReturnFromApi(res);
      return res;
    } catch (error) {
      console.log(error, 'sgfdsg');
    }
  };

  const onSenderSubmit = (values: z.infer<TypePickUpSchema>) => {
    console.log('Sender Form Data:', values);
  };

  const onRecipientSubmit = (values: z.infer<TypeDropOffSchema>) => {
    console.log('Recipient Form Data:', values);
  };

  const isDropoffOne = orderStore.dropOffs
    ? orderStore.dropOffs.length
      ? true
      : false
    : false;

  const handleAddOneDropoff = async () => {
    const isFormValid = await validateFormsAsync();

    if (!isFormValid) {
      console.warn(
        'Please complete all required fields before adding drop-off'
      );
      // Optional: Highlight invalid fields or show error message
      return;
    }

    try {
      const newDropOff: TypeDropOffs = usedropOffFormValuesForDropffs({
        dropOffFormValues: dropOffFormValues,
        vendorId: vendorId!,
        isCOD: isCOD,
      });

      const newDropOffs = [...orderStore.dropOffs, newDropOff];

      const updatedPickUp = usePickUpFormValuesForPickUp({
        pickUpFormValues: pickUpFormValues,
      });

      const estimatedDeliveryData: TypeEstimatedDelivery = {
        branch_id: branchId!,
        vendor_id: vendorId!,
        drop_offs: newDropOffs,
        delivery_model: orderStore.deliveryModel.key,
        order_session_id:
          orderStore.estimatedDelivery?.order_session_id ||
          Date.now().toString(),
        pickup: updatedPickUp,
      };

      // const res = await updateCalculateDeliveryEstimate(estimatedDeliveryData!);

      // if (res?.data) {
      useOrderStore.setState((state) => {
        const updatedDropOffs = [...state.dropOffs];
        if (state.dropOffs === undefined || state.dropOffs.length === 0) {
          updatedDropOffs.push(newDropOff);
          updatedDropOffs.push(emptyDropOff as any);
        } else {
          updatedDropOffs.length - 1 <= isDropIndex
            ? ((updatedDropOffs[isDropIndex] = newDropOff),
              updatedDropOffs.push(emptyDropOff as any))
            : updatedDropOffs.push(newDropOff);
        }

        setIsDropofIndex(updatedDropOffs.length - 1);
        return {
          ...state,
          dropOffs: updatedDropOffs,
          pickUp: updatedPickUp,
          estimatedDelivery: estimatedDeliveryData,
        };
      });

      setIsCOD(1);
      dropOffForm.reset(emptyDropOff);
      dropOffForm.clearErrors();

      // }

      console.log(
        'Successfully added and calculated estimate for new drop-off'
      );
    } catch (error) {
      console.error('Error in handleAddOneDropoffImproved:', error);
      // Optionally revert state changes on error
    }
  };

  const handleEditOneDropoff = (index: number) => {
    if (
      isValid &&
      dropOffFormValues &&
      index >= 0 &&
      index < orderStore.dropOffs.length
    ) {
      // Create a proper deep copy to avoid mutation
      const updatedDropOffs = [...orderStore.dropOffs];

      // Update the specific drop-off at the given index
      updatedDropOffs[index] = {
        ...usedropOffFormValuesForDropffs({
          dropOffFormValues: dropOffFormValues,
          vendorId: vendorId!,
          isCOD: isCOD,
        }),
      } as any;

      // Update the store in one atomic operation
      useOrderStore.setState((state) => ({
        ...state,
        dropOffs: updatedDropOffs,
      }));
    }
  };

  const handleSaveCurrentDropOff = async () => {
    useOrderStore.setState((state) => {
      const newDropOffs = [...state.dropOffs];
      newDropOffs[isDropIndex] = {
        ...usedropOffFormValuesForDropffs({
          dropOffFormValues: dropOffFormValues,
          vendorId: vendorId!,
          isCOD: isCOD,
        }),
      } as any;

      const estimatedDeliveryData: TypeEstimatedDelivery = {
        branch_id: branchId!,
        vendor_id: vendorId!,
        drop_offs: newDropOffs,
        delivery_model: state.deliveryModel.key,
        order_session_id:
          state.estimatedDelivery?.order_session_id || Date.now().toString(),
        pickup: usePickUpFormValuesForPickUp({
          pickUpFormValues: pickUpFormValues,
        }),
      };

      return {
        ...state,
        dropOffs: newDropOffs,
        estimatedDelivery: estimatedDeliveryData,
      };
    });
    await updateCalculateDeliveryEstimate(orderStore.estimatedDelivery!);
  };

  const handleEditDropOffWithSave = async (index: number) => {
    try {
      if (typeof index !== 'number' || isNaN(index)) {
        console.error(`Invalid index type: ${index}. Expected a valid number.`);
        return;
      }
      const isFormValid = await validateFormsAsync();
      // Save current changes if we're editing a different drop-off

      // Validate index bounds
      if (index < 0 || index >= orderStore.dropOffs.length) {
        console.error(
          `Invalid index: ${index}. Array length: ${orderStore.dropOffs.length}`
        );
        return;
      }

      if (isDropIndex !== index && isFormValid) {
        handleSaveCurrentDropOff();

        const dropOffData = orderStore.dropOffs[index];

        if (!dropOffData) {
          console.error(`No drop-off data found at index ${index}`);
          return;
        }

        setIsDropofIndex(index);

        console.log(dropOffData);

        Object.entries(dropOffData).forEach(([key, value]) => {
          dropOffForm.setValue(key as keyof TypeDropOffSchema, value);
        });
      }
      console.log(`Editing drop-off at index ${index}`);
    } catch (error) {
      console.error('Error loading drop-off for editing:', error);
    }
  };
  const handleDeleteDropOff = (index: number) => {
    try {
      if (orderStore.dropOffs.length <= 1) {
        console.warn(
          'Cannot delete the last drop-off. At least one drop-off is required.'
        );
        return;
      }

      // Validate index
      if (index < 0 || index >= orderStore.dropOffs.length) {
        console.error(
          `Invalid index: ${index}. Valid range: 0-${orderStore.dropOffs.length - 1}`
        );
        return;
      }

      if (isValid && isDropIndex !== index) {
        useOrderStore.setState((state) => {
          const updatedDropOffs = [...state.dropOffs];
          updatedDropOffs[isDropIndex] = {
            ...usedropOffFormValuesForDropffs({
              dropOffFormValues: dropOffFormValues,
              vendorId: vendorId!,
              isCOD: isCOD,
            }),
          } as any;

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

  console.log(orderStore.dropOffs, 'afa');

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col md:flex-row items-start justify-start gap-10 min-h-screen">
      <div className="grid grid-cols-2 h-full rounded-md  gap-10 w-full">
        {/* PICK UP FORM */}

        <PickUpForm onSenderSubmit={onSenderSubmit} senderForm={pickUpForm} />

        {/* DROP OFF FORM */}

        <div className="grid gap-4">
          {orderStore.dropOffs?.map((item, idx) => (
            <DropoffFormSection
              dropOffForm={dropOffForm}
              dropOffFormValues={dropOffFormValues}
              handleAddOneDropoff={handleAddOneDropoff}
              handleDeleteDropOff={handleDeleteDropOff}
              handleEditDropOffWithSave={handleEditDropOffWithSave}
              index={idx}
              isCOD={isCOD}
              setIsCOD={setIsCOD}
              isDropIndex={isDropIndex}
              item={item}
              key={idx}
            />
          ))}

          {!isDropoffOne && (
            <>
              <DropoffFormSection
                dropOffForm={dropOffForm}
                dropOffFormValues={dropOffFormValues}
                handleAddOneDropoff={handleAddOneDropoff}
                handleDeleteDropOff={handleDeleteDropOff}
                handleEditDropOffWithSave={handleEditDropOffWithSave}
                isCOD={isCOD}
                setIsCOD={setIsCOD}
                isDropIndex={isDropIndex}
              />
            </>
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
              <span>Distance: {orderStore.deliverySummary?.totalKM} </span>
            </div>

            <div className="flex items-center space-x-1">
              <Truck className="w-4 h-4 text-gray-500" />
              <span>Drop-off: {orderStore.deliverySummary?.totalOrders}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>
                Est. Time: {orderStore.deliverySummary?.estTime} Min
                <span className="font-medium">{''}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <Coins className="w-4 h-4 text-gray-500" />
              <span>
                Delivery Fee: {orderStore.deliverySummary?.totalDelivery}
              </span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100">
              Cancel
            </button>
            <Button
              // disabled={!isFormValid}
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
