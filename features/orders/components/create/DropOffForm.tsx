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
  onRecipientSubmit: (data: TypeDropOffSchema) => void;
  shallCollectCash: boolean;
  setIsCOD: Dispatch<SetStateAction<boolean>>;
}

const DropoffForm: React.FC<SenderFormProps> = ({
  recipientForm,
  onRecipientSubmit,
  shallCollectCash,
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
              name="orderNumber"
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
              name="customerName"
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
              name="phone"
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
              name="apartmentNo"
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
              name="additionalAddress"
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
                      shallCollectCash
                        ? 'text-cyan-500 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    <input
                      type="radio"
                      value="yes"
                      checked={shallCollectCash}
                      onChange={() => {
                        setIsCOD(true);
                      }}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    YES
                  </label>

                  {/* NO Option */}
                  <label
                    className={cn(
                      'flex items-center gap-2 cursor-pointer',
                      !shallCollectCash
                        ? 'text-cyan-500 font-semibold'
                        : 'text-gray-500'
                    )}
                  >
                    <input
                      type="radio"
                      value="no"
                      checked={!shallCollectCash}
                      onChange={() => {
                        setIsCOD(false);
                      }}
                      className="accent-cyan-500 w-4 h-4"
                    />
                    NO
                  </label>
                </div>
              </div>

              <FormField
                control={recipientForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Amount</FormLabel>
                    <FormControl className="bg-white">
                      <Input
                        // disabled={!shallCollectCash}
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
