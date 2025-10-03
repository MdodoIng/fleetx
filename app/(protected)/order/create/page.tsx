'use client';
import PickUpForm from '@/features/orders/components/create/PickUpForm';
import DropoffFormSection from '@/features/orders/components/ui/DropoffFormSection';
import {
  Dashboard,
  DashboardContent,
  DashboardFooter,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import AlertMessage from '@/features/orders/components/AlertMessage';
import WalletCard from '@/features/orders/components/WalletCard';
import DeliverySummaryFooter from '@/features/orders/components/create/DeliverySummaryFooter';
import { useOrderStore, useVendorStore } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  dropOffSchema,
  pickUpSchema,
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';
import { zodResolver } from '@hookform/resolvers/zod';
import useOrderCreate from '@/features/orders/hooks/useOrderCreate';
import { vendorService } from '@/shared/services/vendor';

import { CreateFallback } from '@/shared/components/fetch/fallback';

export default function OrderCreatePage() {
  const orderStore = useOrderStore();
  const [isDropIndex, setIsDropofIndex] = useState<number>(
    orderStore.dropOffs ? orderStore.dropOffs.length - 1 : 0
  );

  const { branchId, vendorId, selectedBranch } = useVendorStore();

  const [isCOD, setIsCOD] = useState<1 | 2>(2);
  const [loading, setLoading] = useState(true);

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
    mode: 'onChange',
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

    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const { functionsDropoffs } = useOrderCreate(
    pickUpForm,
    dropOffForm,
    isCOD,
    setIsCOD,
    isDropIndex,
    setIsDropofIndex
  );

  const updatePickUpDetailsForBranchUser = useCallback(async () => {
    if (branchId && selectedBranch) {
      Object.entries(selectedBranch?.address).forEach(([key, value]) => {
        pickUpForm.setValue(key as keyof TypePickUpSchema, value);
      });

      pickUpForm.setValue('customer_name', selectedBranch.name);
      pickUpForm.setValue('mobile_number', selectedBranch?.mobile_number);
    }
    setLoading(false);
  }, [branchId, pickUpForm, selectedBranch]);

  const updateDropOutDetailsForStore = useCallback(() => {
    if (
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
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, isDropIndex, orderStore.dropOffs]);

  const searchAddressByMobileNumber = useCallback(
    async (mobileNumber: string) => {
      try {
        const res = await vendorService.getAddressByMobile(
          vendorId!,
          branchId!,
          mobileNumber
        );

        console.log(res, 'address search result');
        console.log('Full response data:', JSON.stringify(res.data, null, 2));

        // Handle array response - get the first address if available
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const firstAddress = res.data[0];
          console.log(
            'First address object:',
            JSON.stringify(firstAddress, null, 2)
          );

          if (firstAddress.address) {
            // Set the address details from the first result
            Object.entries(firstAddress.address).forEach(([key, value]) => {
              dropOffForm.setValue(key as keyof TypeDropOffSchema, value);
            });

            // Set customer details if available
            const customerName =
              firstAddress.customer_name || firstAddress.address.customer_name;

            if (customerName) {
              dropOffForm.setValue('customer_name', customerName);
              console.log(
                'Customer name set to:',
                dropOffForm.getValues('customer_name')
              );
            }
          }
        } else {
          // No addresses found for this mobile number
          console.log('No addresses found for mobile number:', mobileNumber);
        }
      } catch (error) {
        console.error('Error searching address by mobile number:', error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vendorId, branchId]
  );

  const mobileNumber = dropOffForm.watch('mobile_number');

  useEffect(() => {
    const fetchIfValid = async () => {
      if (!mobileNumber) return;

      const isValid = await dropOffForm.trigger('mobile_number');
      if (isValid) {
        searchAddressByMobileNumber(mobileNumber);
      }
    };

    fetchIfValid();
  }, [mobileNumber, searchAddressByMobileNumber, dropOffForm]);

  useEffect(() => {
    updatePickUpDetailsForBranchUser();
    updateDropOutDetailsForStore();

    return () => {};
  }, [updateDropOutDetailsForStore, updatePickUpDetailsForBranchUser]);

  const isDropoffOne = orderStore.dropOffs
    ? orderStore.dropOffs.length
      ? true
      : false
    : false;

  const isValid =
    !dropOffForm.formState.isValid || !pickUpForm.formState.isValid;

  if (loading) return <CreateFallback />;

  return (
    <>
      <AlertMessage type="mobile" />
      <Dashboard className="h-auto">
        <DashboardHeader>
          <DashboardHeaderRight>
            <AlertMessage type="laptop" />
          </DashboardHeaderRight>
          <WalletCard className="max-sm:w-full" />
        </DashboardHeader>
        <DashboardContent className="grid md:grid-cols-2 ">
          <PickUpForm senderForm={pickUpForm} />

          <div className="grid gap-4">
            {orderStore.dropOffs?.map((item, idx) => (
              <DropoffFormSection
                dropOffForm={dropOffForm}
                functionsDropoffs={functionsDropoffs}
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
                  functionsDropoffs={functionsDropoffs}
                  isCOD={isCOD}
                  setIsCOD={setIsCOD}
                  isDropIndex={isDropIndex}
                />
              </>
            )}
          </div>
        </DashboardContent>

        <DashboardFooter>
          <DeliverySummaryFooter
            handleOrder={() => functionsDropoffs('order')}
            handleCancel={() => functionsDropoffs('cancel')}
            isValid={isValid}
          />
        </DashboardFooter>
      </Dashboard>
    </>
  );
}
