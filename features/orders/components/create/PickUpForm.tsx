'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
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
import { UseFormReturn } from 'react-hook-form';

import { TypePickUpSchema } from '../../validations/order';
import AddressLandmarkFields from '@/shared/components/InputSearch';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useMediaQuery from '@/shared/lib/hooks/useMediaQuery';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

interface SenderFormProps {
  senderForm: UseFormReturn<TypePickUpSchema>;
}

const PickUpForm: React.FC<SenderFormProps> = ({ senderForm }) => {
  const [isToggle, setIsToggle] = useState(false);

  const isMobile = useMediaQuery('sm');

  const t = useTranslations('component.features.orders.create');

  console.log(isMobile);

  return (
    <Form {...senderForm}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 h-full ">
        <Card className="rounded-[8px] bg-white h-full border-[#2828281A] flex w-full">
          <CardHeader className="flex w-full justify-between items-center">
            <div className="flex gap-2  text-dark-grey">
              <CardIcon>
                <Icon
                  icon={'weui:location-outlined'}
                  className="!text-[#D97706]"
                />
              </CardIcon>
              <div className="flex flex-col  items-start justify-center">
                <CardTitle>{t('pickUpForm.title')}</CardTitle>
                <CardDescription>{t('pickUpForm.subtitle')}</CardDescription>
              </div>
            </div>
            <Button variant={'ghost'} onClick={() => setIsToggle(!isToggle)}>
              <Icon
                icon={
                  isMobile
                    ? isToggle
                      ? 'iconamoon:edit'
                      : 'ep:arrow-up-bold'
                    : 'iconamoon:edit'
                }
                className="text-dark-grey size-6 shrink-0"
              />
            </Button>
          </CardHeader>
          <CardContent
            className={cn(
              'mt-2 grid grid-cols-1 sm:grid-cols-2  gap-4',
              isToggle
                ? 'max-sm:max-h-0 max-sm:overflow-hidden max-sm:p-0  max-sm:mt-0'
                : ''
            )}
          >
            {/* Sender Name */}
            <FormField
              control={senderForm.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel> {t('form.senderName.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.senderName.placeholder')}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={senderForm.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 ">
                  <FormLabel> {t('form.phone.label')}</FormLabel>
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

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={senderForm.control}
              name="area"
              render={() => (
                <AddressLandmarkFields
                  form={senderForm}
                  landmarkFieldName={t('form.address.label')}
                  isMap
                />
              )}
            />

            {/* Appartment */}
            <FormField
              control={senderForm.control}
              name="apartment_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.apartment.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.apartment.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Floor */}
            <FormField
              control={senderForm.control}
              name="floor"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>{t('form.floor.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.floor.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Addinational Address */}
            <FormField
              control={senderForm.control}
              name="additional_address"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2">
                  <FormLabel>{t('form.additionalAddress.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('form.additionalAddress.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default PickUpForm;
