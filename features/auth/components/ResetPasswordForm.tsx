'use client';
import logo from '@/assets/images/logo.webp';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/store';
import main_padding from '@/styles/padding';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  resetPasswordSchema,
  TypeResetPasswordForm,
} from '../validations/changePassword';
import { useRouter } from 'next/navigation';

const ResetPasswordForm = () => {
  const { isLoading, resetPassword, getDecodedAccessToken } = useAuthStore();
  const { push } = useRouter();

  const form = useForm<TypeResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: TypeResetPasswordForm) => {
    const token = getDecodedAccessToken();
    try {
      if (!token?.userId) return;
      const success = await resetPassword(
        data.password,
        data.confirmPassword,
        token.userId
      );
      if (success) {
        toast.success('Password reset successful!', {});
        push('/auth/login');
      } else {
        toast.error('An unexpected error occurred. Please try again.', {});
      }
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred.',
        {}
      );
    } finally {
    }
  };

  const t = useTranslations('auth');

  return (
    <div
      className={cn(
        'w-full flex flex-col items-start h-auto justify-start gap-7 overflow-y-auto hide-scrollbar',
        main_padding.x,
        main_padding.y
      )}
    >
      <Image
        src={logo}
        alt="logo"
        priority
        className="h-[60px] w-auto object-contain"
      />
      <div className="flex flex-col">
        <h2 className="font-medium text-2xl">{t('login.title')}</h2>
        <h4 className="">{t('login.subtitle')}</h4>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="h-full w-full flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t('businessForm.fields.password.label')}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={'password'}
                      placeholder={t(
                        'businessForm.fields.password.placeholder'
                      )}
                      className="text-sm pr-10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger('confirmPassword');
                      }}
                    />
                  </div>
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
                <FormLabel>
                  {t('businessForm.fields.confirmPassword.label')}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={'password'}
                      placeholder={t(
                        'businessForm.fields.confirmPassword.placeholder'
                      )}
                      className="text-sm pr-10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger('confirmPassword'); // Revalidate on change
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="rounded-full">
            {t(isLoading ? 'login.loading' : 'login.change-password')}
          </Button>
        </form>
      </Form>

      <Separator />

      <div className="flex flex-col w-full items-center text-center gap-2">
        <p className="font-medium text-sm text-dark-grey">
          {t('business.cta')}
        </p>
        <Button variant={'outline'} asChild className="w-full">
          <Link href="/auth/signup"> {t('business.button')}</Link>
        </Button>
        <p className="text-xs">{t('business.promo')}</p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
