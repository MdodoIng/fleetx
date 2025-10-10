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
import { Input, InputPhone } from '@/shared/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { FormEvent, useState } from 'react';
import { useForm } from 'react-hook-form';

import AddressLandmarkFields from '@/shared/components/selectors/InputSearch';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { businessTypes } from '@/shared/constants/storageConstants';
import { TypeSingUpRequest } from '@/shared/types/user';
import main_padding from '@/styles/padding';
import Image from 'next/image';
import Link from 'next/link';

import ProgressBar from '@/features/auth/components/ProgressBar';
import {
  signUpFormSchema,
  TypeSignUpForm,
} from '@/features/auth/validations/signUp';
import { cn } from '@/shared/lib/utils';
import userService from '@/shared/services/user';
import { useAuthStore } from '@/store';
import { toast } from 'sonner';

const steps = ['Business Info', 'Personal Info', 'Location Info'];
export default function SignUp() {
  const [step, setStep] = useState(0);
  const { login } = useAuthStore();

  const form = useForm<TypeSignUpForm>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      businessName: '',
      fullName: '',
      phone: '',
      businessType: 1,
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = form.getValues();

    const request: TypeSingUpRequest = {
      business_name: data.businessName,
      full_name: data.fullName,
      is_business: undefined,
      reference: undefined,
      aff_ref_code: undefined,
      business_type: data.businessType,
      email: data.email,
      name: data.fullName,
      password: data.password,
      confirm_password: data.confirmPassword,
      branches: {
        mobile_number: data.phone,
        name: data.fullName,
        address: {
          area: data.area,
          landmark: data?.landmark || '',
          area_id: data.area_id || 0,
          block: data.block || '',
          block_id: data.block_id || 0,
          street: data.street || '',
          street_id: data.street_id || 0,
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          building_id: data.building_id || 0,
          building: data.building || '',
          paci_number: '',
        },
      },
    };

    try {
      await userService.signUp(request).then(async () => {
        await login(data.email, data.password);
        toast.info(
          'Sign up successful! Please check your email to verify your account.'
        );
      });
    } catch (error: any) {
      toast.error(
        error.message || 'An unexpected error occurred during sign up.'
      );
    }
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
          onSubmit={(e) => e.preventDefault()}
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
                        <FormControl>
                          <InputPhone {...field} />
                        </FormControl>
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
                      <FormControl>
                        <Input
                          type={'password'}
                          placeholder={t('fields.password.placeholder')}
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
                    <FormItem>
                      <FormLabel>{t('fields.confirmPassword.label')}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          eyeBtnHide
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
                  render={() => (
                    <AddressLandmarkFields
                      form={form}
                      isMap
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
              variant="ghost"
              className={cn(
                'cursor-pointer bg-[#6750A414] text-[#1D1B20]',
                step === 0 && 'hidden'
              )}
              onClick={() => setStep((s) => s - 1)}
            >
              {t('back')}
            </Button>

            <Button
              type={'button'}
              className="flex-1 rounded-full"
              onClick={step < steps.length - 1 ? nextStep : (e) => onSubmit(e)}
            >
              {t(step < steps.length - 1 ? 'continue' : 'submit')}
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
