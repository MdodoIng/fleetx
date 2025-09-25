'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input, InputPhone } from '@/shared/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import z from 'zod';
import { toast } from 'sonner';
import { Pencil, Plus } from 'lucide-react';
import { Separator } from '@/shared/components/ui/separator';
import {
  addEditAccountManagerSchema,
  TypeAddEditAccountManagerSchema,
} from '../validations/addEditAccountManagerForm';
import userService from '@/shared/services/user';

export function AddEditAccountManagerForm({
  editDetails,
  onSave,
}: {
  editDetails?: any;
  onSave: () => void;
}) {
  const isEditMode = !!editDetails;
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TypeAddEditAccountManagerSchema>({
    resolver: zodResolver(addEditAccountManagerSchema),
    defaultValues: {
      first_name: editDetails?.first_name || '',
      last_name: editDetails?.last_name || '',
      email: editDetails?.email || '',
      phone: editDetails?.phone || '',
      password: '',
    },
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const onSubmit = async (values: TypeAddEditAccountManagerSchema) => {
    try {
      if (isEditMode) {
        await userService.updateAccountManager(values, editDetails.id);
        toast.success('Account manager updated successfully.');
      } else {
        await userService.createAccountManager(values);
        toast.success('Account manager saved successfully.');
      }
      onSave(); // Call the parent function to refresh the table
      // Close the dialog, assuming the component is within a Dialog component
      document.getElementById('dialog-close-button')?.click();
    } catch (error: any) {
      toast.error('Error', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEditMode ? 'outline' : 'default'}
          className={isEditMode ? 'h-auto w-full mt-2' : ''}
        >
          {isEditMode ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Account Manager
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]  text-dark-grey">
        <DialogHeader className="flex justify-start">
          <DialogTitle className="text-lg font-bold ">
            {isEditMode ? 'Edit Account Manager' : 'Add Account Manager'}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* First Name */}
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Muhammed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Ali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. muhammed@fleetx.com"
                      {...field}
                      disabled={isEditMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <InputPhone {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password (only for add mode) */}
            {!isEditMode && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="e.g. fleetx123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-none bg-[#6750A414] text-[#1D1B20]"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
