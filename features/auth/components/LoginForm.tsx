import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import logo from '@/assets/images/logo.webp';
import { Input } from '@/shared/components/ui/input';
import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { cn } from '@/shared/lib/utils';
import { useAuthStore } from '@/store';
import main_padding from '@/styles/padding';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import ForgotPassword from './ForgotPassword';
import { loginSchema, TypeLoginSchema } from '../validations/auth';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const { isAuthenticated, isLoading, login } =
    useAuthStore();
  const redirectToHome = useRedirectToHome();

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: TypeLoginSchema) {
    const success = await login(values.email, values.password);

    if (success) {
      redirectToHome();
    } else {
      toast.error('Invalid email or password', {});
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, redirectToHome]);

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
          className="flex flex-col gap-6 w-full"
        >
          <div className="flex flex-col gap-4 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="font-medium">
                    {t('login.emailLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="text-sm"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.passwordLabel')}</FormLabel>

                    <FormControl>
                      <Input
                        type={'password'}
                        placeholder={t('login.passwordPlaceholder')}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <ForgotPassword />
            </div>
          </div>
          <Button type="submit" className="rounded-full">
            {t(isLoading ? 'login.loading' : 'login.submit')}
          </Button>
        </form>
      </Form>

      <span className="bg-black/50 w-full h-[1px] " />

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

export default LoginForm;
