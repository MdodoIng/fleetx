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
import { UseFormReturn } from 'react-hook-form';
import { TypeDropOffSchema } from '../../validations/order';
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
      <form
        onSubmit={recipientForm.handleSubmit(onRecipientSubmit)}
        className="space-y-6"
      >
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="bg-cyan-50 rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-cyan-800">
              <img src="/pickUp_img.svg" alt="Dropoff" className="w-6 h-6" />
              Drop Off
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Recipient Name */}
            <FormField
              control={recipientForm.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Recipient Names</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipient Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={recipientForm.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 6045 9486" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AddressLandmarkFields
              form={recipientForm}
              landmarkFieldName="landmark"
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
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apt</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cash Collection */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
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
                      recipientForm.setValue('paymentType', 'cash');
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
                      recipientForm.setValue('paymentType', 'card');
                    }}
                    className="accent-cyan-500 w-4 h-4"
                  />
                  NO
                </label>
              </div>
            </div>

            {/* Amount - Conditionally rendered */}
            {shallCollectCash && (
              <FormField
                control={recipientForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Additional Address */}
            <FormField
              control={recipientForm.control}
              name="vendorOrderNumber"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FormLabel>Additional Address</FormLabel>
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

            {/* Order Number */}
            <FormField
              control={recipientForm.control}
              name="vendorOrderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: DHA334D01" {...field} />
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

export default DropoffForm;
