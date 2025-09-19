'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Control, useFieldArray, UseFormReturn } from 'react-hook-form';

import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import { M_PLUS_1p } from 'next/font/google';
import { TypeDropOffSchema } from '../../validations/order';
import AddressLandmarkFields from '@/shared/components/selectors/InputSearch';
import { useTranslations } from 'next-intl';
import { DollarSign, Info } from 'lucide-react';
import { useSharedStore } from '@/store';
import { Switch } from '@/shared/components/ui/switch';
import BinaryToggle from '@/shared/components/ui/binaryToggle';
import { is } from 'zod/v4/locales';

interface SenderFormProps {
  recipientForm: UseFormReturn<TypeDropOffSchema>;

  isCOD: 1 | 2;
  setIsCOD: Dispatch<SetStateAction<1 | 2>>;
}

const DropoffForm: React.FC<SenderFormProps> = ({
  recipientForm,

  isCOD,
  setIsCOD,
}) => {
  const { appConstants } = useSharedStore();
  const t = useTranslations('component.features.orders.create');
  return (
    <Form {...recipientForm}>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent
          className={cn('mt-2 grid grid-cols-1 sm:grid-cols-2  gap-4')}
        >
          {/* phone */}
          <FormField
            control={recipientForm.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem className="col-span-1 sm:col-span-2">
                <FormLabel>{t('form.phone.label')}</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-[80px_1fr] gap-2 w-full ">
                    <Input
                      disabled
                      defaultValue={t('form.phone.placeholder1')}
                      placeholder={t('form.phone.placeholder1')}
                      className=""
                    />
                    <Input
                      placeholder={t('form.phone.placeholder2')}
                      {...field}
                      className="w-full"
                    />
                  </div>
                </FormControl>
                {field.value ? (
                  <FormMessage />
                ) : (
                  <p className="inline-flex items-baseline gap-2 text-sm text-dark-grey/60">
                    <Info className="size-4 translate-y-1" />
                    {t('form.phone.warning-for-droppoff')}
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* orderNumber */}
          <FormField
            control={recipientForm.control}
            name="order_index"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 col-span-1 ">
                <FormLabel>{t('form.recipientName.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.recipientName.placeholder')}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <AddressLandmarkFields
            form={recipientForm}
            isMap={true}
            landmarkFieldName={t('form.address.label')}
          />

          {/* apartmentNo */}
          <FormField
            control={recipientForm.control}
            name="apartment_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.apartment.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.recipientName.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Floor */}
          <FormField
            control={recipientForm.control}
            name="floor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.floor.label')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.floor.placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apt */}
          <FormField
            control={recipientForm.control}
            name="additional_address"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 col-span-1">
                <FormLabel>{t('form.additionalAddress.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('form.recipientName.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cash Collection */}
          <div className="sm:col-span-2 col-span-1 px-3 py-4 rounded-[8px] bg-[#FDFDD4] border-[#FDFDD4] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-dark-grey flex gap-1">
                <DollarSign className="text-[#CD994D] size-4" />
                {t('form.collectCash.label')}
              </Label>

              <BinaryToggle
                defaultValue={isCOD}
                className=""
                onChange={(val) => setIsCOD(val)}
              />
            </div>

            <span className="w-full h-[1px] bg-[#CAC4D0]" />

            <FormField
              control={recipientForm.control}
              name="amount_to_collect"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>
                    {t.rich('form.amount.label', {
                      value: appConstants?.currency || 'KD',
                    })}
                  </FormLabel>
                  <FormControl className="bg-white">
                    <Input
                      disabled={isCOD === 2}
                      required={isCOD === 1}
                      placeholder={t.rich('form.amount.placeholder', {
                        value: appConstants?.currency || 'KD',
                      })}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </form>
    </Form>
  );
};

export default DropoffForm;
