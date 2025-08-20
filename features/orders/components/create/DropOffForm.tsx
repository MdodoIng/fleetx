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
import { TypeDropOffSchema, TypePickUpSchema } from '../../validations/order';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { Dispatch, SetStateAction } from 'react';
import AddressLandmarkFields from '../ui/LandmarkFields';

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
  return (
    <Form {...recipientForm}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <Card className="rounded-lg shadow-lg">
          <CardContent className="p-6 grid grid-cols-2  gap-4">
            {/* orderNumber */}
            <FormField
              control={recipientForm.control}
              name="order_index"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel> orderNumber</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipient Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* customerName */}
            <FormField
              control={recipientForm.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>customerName</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6045 9486" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* phone */}
            <FormField
              control={recipientForm.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddressLandmarkFields
              form={recipientForm}
              landmarkFieldName="address"
              isMap={true}
            />

            {/* apartmentNo */}
            <FormField
              control={recipientForm.control}
              name="apartment_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>apartmentNo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3" {...field} />
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
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3" {...field} />
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
                <FormItem className="col-span-2">
                  <FormLabel>additionalAddress</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cash Collection */}
            <div className="col-span-2 p-3 bg-yellow-100">
              <div className="flex items-center justify-between">
                <Label className="text-gray-500">
                  Shall we collect cash from the recipient?
                </Label>
                <div className="flex gap-4 items-center">
                  {/* YES Option */}
                  <label
                    className={cn(
                      'flex items-center gap-2 cursor-pointer',
                      isCOD === 2
                        ? 'text-cyan-500 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    <input
                      type="radio"
                      value="yes"
                      checked={isCOD === 2}
                      onChange={() => {
                        setIsCOD(2);
                      }}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    YES
                  </label>

                  {/* NO Option */}
                  <label
                    className={cn(
                      'flex items-center gap-2 cursor-pointer',
                      isCOD === 1
                        ? 'text-cyan-500 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    <input
                      type="radio"
                      value="no"
                      checked={isCOD === 1}
                      onChange={() => {
                        setIsCOD(1);
                      }}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    NO
                  </label>
                </div>
              </div>

              <FormField
                control={recipientForm.control}
                name="amount_to_collect"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Amount</FormLabel>
                    <FormControl className="bg-white">
                      <Input
                        disabled={isCOD === 1}
                        placeholder="Ex: 10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default DropoffForm;
