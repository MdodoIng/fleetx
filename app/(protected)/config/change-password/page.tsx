'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  changePasswordSchema,
  TypeChangePasswordForm,
} from '@/features/config/validations/changePpassword';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useAuthStore } from '@/store';
import userService from '@/shared/services/user';
import { TypeChangePasswordRequest } from '@/shared/types/user';
import { toast, Toaster } from 'sonner';

export default function ChangePasswordPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TypeChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmPassword: '',
      oldPassword: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const { handleSubmit, watch } = form;

  console.log(user?.user_id, '');
  const onSubmit = async (data: TypeChangePasswordForm) => {
    setSubmitted(true);

    try {
      const request: TypeChangePasswordRequest = {
        new_password: data.password,
        confirm_new_password: data.confirmPassword,
        current_password: data.oldPassword,
        user_id: user?.user_id,
      };

      const res = await userService.changePassword(request);

      console.log(res);
      toast(res.data);
      // logout();
    } catch (err: any) {
      toast.error(err);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Card className="w-[400px] max-w-full mx-auto mt-10">
      <CardContent className="space-y-6 py-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input eyeBtnHide type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitted || !form.formState.isValid}
              className="w-full"
            >
              Change Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
