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
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  dropOffSchema,
  pickUpSchema,
  TypeDropOffSchema,
  TypePickUpSchema,
} from '@/features/orders/validations/order';
import { zodResolver } from '@hookform/resolvers/zod';
import useOrderCreate from '@/features/orders/hooks/useOrderCreate';
import { debounce } from 'lodash';
import { vendorService } from '@/shared/services/vender';

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

  const { functionsDropoffs, validateFormsAsync } = useOrderCreate(
    pickUpForm,
    dropOffForm,
    isCOD,
    setIsCOD,
    isDropIndex,
    setIsDropofIndex
  );

  useEffect(() => {
    readAppConstants();
    updatePickUpDetailsForBranchUser();
    updateDropOutDetailsForStore();
    return () => {};
  }, []);

  // useEffect(() => {
  //   const debouncedSearch = debounce((val: string) => {
  //     searchAddressByMobileNumber(val);
  //   }, 400);

  //   const subscription = dropOffForm.watch((value, { name }) => {
  //     if (name === 'mobile_number') {
  //       const mobileNumber = value.mobile_number || '';
  //       if (!dropOffForm.formState.errors.mobile_number) {
  //         debouncedSearch(mobileNumber);
  //       }
  //     }
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //     debouncedSearch.cancel();
  //   };
  // }, [dropOffForm]);

  const updatePickUpDetailsForBranchUser = async () => {
    if (branchId) {
      try {
        const res = await vendorService.getBranchDetailByBranchId({
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
    // try {
    //   const res = await vendorService.getAddressByMobile(
    //     vendorId!,
    //     branchId!,
    //     mobileNumber
    //   );
    //   // dropOffForm.setValue('', res.data.address);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const isDropoffOne = orderStore.dropOffs
    ? orderStore.dropOffs.length
      ? true
      : false
    : false;

  return (
    <>
      <AlertMessage type="mobile" />
      <Dashboard>
        <DashboardHeader>
          <DashboardHeaderRight>
            <AlertMessage type="laptop" />
          </DashboardHeaderRight>
          <WalletCard className='max-sm:w-full'   />
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
