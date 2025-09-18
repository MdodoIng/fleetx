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
import {
  useAuthStore,
  useOrderStore,
  useSharedStore,
  useVenderStore,
} from '@/store';
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
import { vendorService } from '@/shared/services/vender';
import { useDebounce } from '@/shared/lib/hooks';

export default function ShippingForm() {
  const { user } = useAuthStore();
  const orderStore = useOrderStore();
  const { readAppConstants } = useSharedStore();
  const [isDropIndex, setIsDropofIndex] = useState<number>(
    orderStore.dropOffs ? orderStore.dropOffs.length - 1 : 0
  );

  const { branchId, vendorId } = useVenderStore();

  const [isCOD, setIsCOD] = useState<1 | 2>(2);

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

  const dropOffFormValues = dropOffForm.watch();

  const { functionsDropoffs } = useOrderCreate(
    pickUpForm,
    dropOffForm,
    isCOD,
    setIsCOD,
    isDropIndex,
    setIsDropofIndex
  );

  const updatePickUpDetailsForBranchUser = useCallback(async () => {
    if (branchId) {
      try {
        const res = await vendorService.getBranchDetailByBranchId({
          vendor_id: vendorId!,
          branch_id: branchId!,
        });
        
 

        Object.entries(res.data.address).forEach(([key, value]) => {
          pickUpForm.setValue(key as keyof TypePickUpSchema, value);
        });

        pickUpForm.setValue('customer_name', res.data.name);
        pickUpForm.setValue('mobile_number', res.data.mobile_number);
      } catch (error) {
        console.error('Error fetching branch ddetails:', error);
      }
    }
  }, [branchId, vendorId, pickUpForm]);

  const updateDropOutDetailsForStore = useCallback(() => {
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
  }, [user, branchId, orderStore.dropOffs, isDropIndex, dropOffForm]);

  const searchAddressByMobileNumber = useCallback(
    async (mobileNumber: string) => {
      try {
        const res = await vendorService.getAddressByMobile(
          vendorId!,
          branchId!,
          mobileNumber
        );

        console.log(res, 'afds');
        if (res.data.address) {
          dropOffForm.setValue('address', res.data.address);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [vendorId, branchId, dropOffForm]
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
    readAppConstants();
    updatePickUpDetailsForBranchUser();
    updateDropOutDetailsForStore();
    return () => {};
  }, [
    readAppConstants,
    updateDropOutDetailsForStore,
    updatePickUpDetailsForBranchUser,
  ]);

  const isDropoffOne = orderStore.dropOffs
    ? orderStore.dropOffs.length
      ? true
      : false
    : false;

  return (
    <>
      <AlertMessage type="mobile" />
      <Dashboard className='h-auto'>
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
                dropOffFormValues={dropOffFormValues}
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
                  dropOffFormValues={dropOffFormValues}
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
            handleCancle={() => functionsDropoffs('cancle')}
          />
        </DashboardFooter>
      </Dashboard>
    </>
  );
}
