'use client';
import { UseFormReturn } from 'react-hook-form';
import { TypeEditVendorBranchSchema } from '../validations/editVender';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

import dynamic from 'next/dynamic';
const MyMap = dynamic(() => import('@/shared/components/MyMap/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
import AddressLandmarkFields from '@/shared/components/selectors/InputSearch';
import { FormEvent } from 'react';

const BranchEditForm = ({
  form,
}: {
  form: UseFormReturn<TypeEditVendorBranchSchema>;
}) => {
  const { control, register, handleSubmit } = form;

  const handleSumbit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSumbit} className=" flex flex-wrap gap-5">
        <FormField
          control={form.control}
          name="main_branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main branch</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_ar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name Ar</FormLabel>
              <FormControl>
                <Input placeholder="nameAr" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input placeholder="mobile" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Row 3: Address */}

        <AddressLandmarkFields
          form={form}
          landmarkFieldName="address"
          isMap={true}
          location="address"
        />

        <FormField
          control={form.control}
          name="address.paci_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>pnci</FormLabel>
              <FormControl>
                <Input placeholder="Pnci" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.latitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>latitude</FormLabel>
              <FormControl>
                <Input placeholder="latitude" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.longitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>longitude</FormLabel>
              <FormControl>
                <Input placeholder="longitude" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional address info</FormLabel>
              <FormControl>
                <Input placeholder="Additional address info" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default BranchEditForm;
