'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Plus, MapPin, Lightbulb, Coins } from 'lucide-react';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

// Define the Zod schema for the sender (Pick Up) form
const senderFormSchema = z.object({
  customerName: z.string().min(1, 'Sender Name is required'),
  paciNumber: z
    .string()
    .regex(/^[0-9]{8}$/, 'PACI Number must be an 8-digit number')
    .optional(),
  mobileNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Must be a valid number')
    .min(5, 'Too short')
    .max(15, 'Too long'),
  address: z.string().min(1, 'Address is required'),
  floor: z.string().optional(),
  additionalAddress: z.string().optional(),
});

// Define the Zod schema for the recipient (Drop Off) form
// This schema uses a discriminated union for robust conditional validation
const recipientFormSchema = z.discriminatedUnion('shallCollectCash', [
  z.object({
    shallCollectCash: z.literal(false),
    recipientName: z.string().min(1, 'Recipient Name is required'),
    mobileNumber: z.string().min(5).max(15),
    address: z.string().min(1, 'Address is required'),
    floor: z.string().optional(),
    apt: z.string().optional(),
    additionalAddress: z.string().optional(),
    orderNumber: z.string().optional(),
    amount: z.string().optional(), // Amount is optional if not collecting cash
  }),
  z.object({
    shallCollectCash: z.literal(true),
    recipientName: z.string().min(1, 'Recipient Name is required'),
    mobileNumber: z.string().min(5).max(15),
    address: z.string().min(1, 'Address is required'),
    floor: z.string().optional(),
    apt: z.string().optional(),
    additionalAddress: z.string().optional(),
    orderNumber: z.string().optional(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .regex(/^[0-9.]+$/, 'Must be a valid amount'), // Amount is required and validated if collecting cash
  }),
]);

// Infer types from schemas for better type safety
type SenderFormData = z.infer<typeof senderFormSchema>;
type RecipientFormData = z.infer<typeof recipientFormSchema>;

export default function ShippingForm() {
  // Use a separate useForm hook for each form to manage their state independently
  const senderForm = useForm<SenderFormData>({
    resolver: zodResolver(senderFormSchema),
    defaultValues: {
      customerName: '',
      paciNumber: '',
      mobileNumber: '',
      address: '',
      floor: '',
      additionalAddress: '',
    },
  });

  const recipientForm = useForm<RecipientFormData>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      recipientName: '',
      mobileNumber: '',
      address: '',
      floor: '',
      apt: '',
      additionalAddress: '',
      orderNumber: '',
      shallCollectCash: false,
      amount: '',
    },
  });

  // Watch the 'shallCollectCash' field to conditionally show the amount input
  const shallCollectCash = recipientForm.watch('shallCollectCash');

  // Handlers for form submission
  const onSenderSubmit = (data: SenderFormData) => {
    console.log('Sender Form Data:', data);
  };

  const onRecipientSubmit = (data: RecipientFormData) => {
    console.log('Recipient Form Data:', data);
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 flex flex-col md:flex-row items-start justify-start gap-10 min-h-screen">
      <div className="flex rounded-md max-w-full md:max-w-[70%] flex-col gap-10 w-full">
        {/* PICK UP FORM */}
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
                        <Input
                          placeholder="House No, Street, City"
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

        {/* DROP OFF FORM */}
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
                  name="recipientName"
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

                {/* Address */}
                <FormField
                  control={recipientForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="House No, Street, City"
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
                  name="apt"
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
                        checked={shallCollectCash === true}
                        onChange={() =>
                          recipientForm.setValue('shallCollectCash', true)
                        }
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
                        checked={shallCollectCash === false}
                        onChange={() =>
                          recipientForm.setValue('shallCollectCash', false)
                        }
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

                {/* Order Number */}
                <FormField
                  control={recipientForm.control}
                  name="orderNumber"
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

        {/* BOTTOM SECTION */}
        <div className="flex items-center justify-between flex-col border rounded-lg p-3 bg-gray-50 gap-6">
          {/* Left Section */}
          <div className="flex items-center gap-4 text-gray-500 text-sm justify-between w-full border p-4 rounded-md ">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>P.... D1</span>
            </div>
            <div className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" />
              <span>0 KM</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span>0 KD</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              className="text-teal-500 border-teal-500 hover:bg-teal-50"
            >
              <Plus className="w-4 h-4 mr-1" />
              Save and add drop off
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled
              className="bg-gray-200 text-gray-400 hover:bg-gray-200"
            >
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
