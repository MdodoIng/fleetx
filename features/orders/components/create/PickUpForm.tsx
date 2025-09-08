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
import { classForInput, Input } from '@/shared/components/ui/input';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Fragment, useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { fi } from 'zod/v4/locales';

import dynamic from 'next/dynamic';
import { TypePickUpSchema } from '../../validations/order';
import AddressLandmarkFields from '@/shared/components/InputSearch';
// const AddressLandmarkFields = dynamic(() => import('../ui/LandmarkFields'), {
//   ssr: false,
//   loading: () => <p>Loading Map...</p>,
// });

interface SenderFormProps {
  senderForm: UseFormReturn<TypePickUpSchema>;
  onSenderSubmit: (data: TypePickUpSchema) => void;
}

const PickUpForm: React.FC<SenderFormProps> = ({
  senderForm,
  onSenderSubmit,
}) => {
  const { register, control, watch } = senderForm;

  return (
    <Form {...senderForm}>
      <form
        onSubmit={senderForm.handleSubmit(onSenderSubmit)}
        className="space-y-6"
      >
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="bg-emerald-50 rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
              Pick Up
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2  gap-4">
            {/* Sender Name */}
            <FormField
              control={senderForm.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Sender Names</FormLabel>
                  <FormControl>
                    <Input placeholder="Cafe cafe, jabariya" {...field} />
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
                <FormItem>
                  <FormLabel> Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 77897729" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <AddressLandmarkFields
              form={senderForm}
              landmarkFieldName="address"
              isMap={true}
            />

            {/* Appartment */}
            <FormField
              control={senderForm.control}
              name="apartment_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment No</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3" {...field} />
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
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: House number, Building number etc"
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
                <FormItem className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: House number, Building number etc"
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
