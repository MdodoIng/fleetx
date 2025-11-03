import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
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

import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import {
  forgotPasswordSchema,
  ForgotPasswordValues,
} from '../validations/auth';

const ForgotPassword = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    userService
      .forgotPassword({ email: data.email })
      .then((res) => {
        setIsOpen(false);
      })
      .catch((err) => {
        toast.error(err.message);
        // console.error(err);
      });
  };

  const t = useTranslations('auth');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-primary-blue  text-sm ms-auto outline-none border-none flex mt-2 cursor-pointer"
        >
          {t('login.forgotPassword')}
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-off-white rounded-[20px] "
      >
        <DialogHeader className="items-baseline">
          <DialogTitle>{t('passwordReset.heading')}</DialogTitle>
          <DialogDescription className="max-sm:text-start">
            {' '}
            {t('passwordReset.subheading')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('passwordReset.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t('passwordReset.emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-start ">
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                className="rounded-full w-full"
              >
                {t('passwordReset.submitButton')}
              </Button>
            </DialogFooter>
            <DialogClose className="p-0 absolute top-2 cursor-pointer inset-x-2 flex justify-end ">
              <Icon
                icon="carbon:close-outline"
                className="text-dark-grey/30 size-7"
              />
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
