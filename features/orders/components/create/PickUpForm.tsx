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
import { TypePickUpSchema, pickUpSchema } from '../../validations/order';

interface SenderFormProps {
  senderForm: UseFormReturn<pickUpSchema>;
  onSenderSubmit: (data: pickUpSchema) => void;
}

const PickUpForm: React.FC<SenderFormProps> = ({
  senderForm,
  onSenderSubmit,
}) => {
  return (
    <Form {...senderForm}>
      <form
        onSubmit={senderForm.handleSubmit(onSenderSubmit)}
        className="space-y-6"
      >
        <Card className="rounded-lg shadow-lg">
          <CardHeader className="bg-emerald-50 rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
              <img src="/pickUp_img.svg" alt="Pickup" className="w-6 h-6" />
              Pick Up
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Sender Name */}
            <FormField
              control={senderForm.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Sender Names</FormLabel>
                  <FormControl>
                    <Input placeholder="Sender Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PACI Number */}
            <FormField
              control={senderForm.control}
              name="paciNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> PACI Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 77897729" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={senderForm.control}
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

            {/* Address */}
            <FormField
              control={senderForm.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="House No, Street, City" {...field} />
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
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Address */}
            <FormField
              control={senderForm.control}
              name="additionalAddress"
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default PickUpForm;
