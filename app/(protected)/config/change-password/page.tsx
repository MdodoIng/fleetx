'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  changePasswordSchema,
  TypeChangePasswordForm,
} from '@/features/config/validations/changePassword';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card';
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderRight,
} from '@/shared/components/ui/dashboard';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import userService from '@/shared/services/user';
import { TypeChangePasswordRequest } from '@/shared/types/user';
import { useAuthStore } from '@/store';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ChangePasswordPage() {
  const { user } = useAuthStore();
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

  const { handleSubmit } = form;

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
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitted(false);
    }
  };

  const t = useTranslations('component.features.config.change-password');

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>

      <DashboardContent className="grid md:grid-cols-2 grid-cols-1  w-full ">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-full w-full flex flex-col gap-6"
          >
            <Card className="rounded-[8px] bg-white h-full flex flex-col w-full">
              <CardContent className="mt-2 grid gap-x-8 gap-y-6">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>{t('oldPassword.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('oldPassword.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel> {t('newPassword.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('newPassword.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel> {t('changePassword')}</FormLabel>
                      <FormControl>
                        <Input
                          eyeBtnHide
                          type="password"
                          placeholder={t('confirmPassword.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end w-full ">
                <Button
                  type="submit"
                  disabled={submitted || !form.formState.isValid}
                  className="w-full"
                >
                  {t('changePassword')}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DashboardContent>
    </Dashboard>
  );
}
