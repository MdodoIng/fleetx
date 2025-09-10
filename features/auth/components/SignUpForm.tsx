'use client';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import logo from '@/assets/images/logo.webp';


import main_padding from '@/styles/padding';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import Link from 'next/link';
import ProgressBar from './ProgressBar';
import { Eye, EyeOff } from 'lucide-react';
import AddressLandmarkFields from '@/shared/components/InputSearch';
import { businessTypes } from '@/shared/constants/storageConstants';
import { TypeSingUpRequest } from '@/shared/types/user';

import userService from '@/shared/services/user';
import { cn } from '@/shared/lib/utils';
import { signUpFormSchema, TypeSignUpForm } from '../validations/signUp';

const steps = ['Business Info', 'Personal Info', 'Location Info'];

export default function SignUpForm() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TypeSignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      fullName: '',
      phone: '',
      businessType: undefined,
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      landmark: '',
      area: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const nextStep = async () => {
    if (step === 2) return;
    const fields: (keyof TypeSignUpForm)[] =
      step === 0
        ? ['businessName', 'businessType', 'fullName', 'phone']
        : step === 1
          ? ['email', 'password', 'confirmPassword']
          : ['address', 'landmark'];

    const isValid = await form.trigger(fields);

    let passwordsMatch = true;
    if (step === 1) {
      const password = form.getValues('password');
      const confirmPassword = form.getValues('confirmPassword');
      if (password !== confirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        });
        passwordsMatch = false;
      }
    }

    if (isValid && passwordsMatch) {
      setStep((s) => s + 1);
    }
  };

  const onSubmit = async (data: TypeSignUpForm) => {
    console.log('Submitted:', data, form.formState.errors);
    const request: TypeSingUpRequest = {
      business_name: data.businessName,
      full_name: data.fullName,
      business_type: data.businessType,
      email: data.email,
      name: data.fullName,
      password: data.password,
      confirm_password: data.confirmPassword,
      branches: {
        mobile_number: data.phone,
        name: data.fullName,
        address: { ...data },
      },
    };

    userService
      .signUp(request)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const t = useTranslations('auth.businessForm');
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
        <h2 className="font-medium text-2xl">{t(('title' + step) as any)}</h2>
        <h4 className="">{t(('tagline' + step) as any)}</h4>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.businessName.label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('fields.businessName.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.fullName.label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('fields.fullName.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.phone.label')}</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-[80px_1fr] gap-2 w-full ">
                          <Input
                            disabled
                            defaultValue={t('fields.phone.placeholder1')}
                            placeholder={t('fields.phone.placeholder1')}
                            className=""
                          />
                          <Input
                            placeholder={t('fields.phone.placeholder2')}
                            {...field}
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.businessType.label')}</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            form.setValue('businessType', Number(value))
                          }
                          defaultValue={String(field.value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={t('fields.businessType.placeholder')}
                            />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectGroup>
                              {businessTypes.map((item, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={String(item.id)}
                                  className="font-english"
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.email.label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('fields.email.placeholder')}
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
                    <FormItem>
                      <FormLabel>{t('fields.password.label')}</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('fields.password.placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.confirmPassword.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t('fields.confirmPassword.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <AddressLandmarkFields
                      form={form}
                      landmarkFieldName={t('fields.address.label')}
                    />
                  )}
                />

                <FormField
                  control={form.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fields.landmark.label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('fields.landmark.placeholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 w-full gap-3">
            <Button
              type="button"
              variant="outline"
              className={cn(
                ' rounded-full overflow-hidden duration-300 px-10',
                step === 0 && 'w-0 px-0 border-0'
              )}
              onClick={() => setStep((s) => s - 1)}
            >
              {t('back')}
            </Button>

            <Button
              type={step < steps.length - 1 ? 'button' : 'submit'}
              className="flex-1 rounded-full"
              onClick={
                step < steps.length - 1 ? nextStep : form.handleSubmit(onSubmit)
              }
            >
              {t(step < steps.length - 1 ? 'continue' : 'submit')}
            </Button>

            <Button
              type={'submit'}
              className="flex-1 rounded-full"
              onClick={() => form.handleSubmit(onSubmit)}
            >
              {t('submit')}
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center w-full text-dark-grey">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/auth/login" className="text-primary-blue">
          {' '}
          {t('loginHere')}{' '}
        </Link>
      </div>

      <div className="w-[50%] mx-auto ">
        <ProgressBar currentStep={step} />
      </div>
    </div>
  );
}
