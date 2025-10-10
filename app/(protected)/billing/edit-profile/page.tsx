'use client';

import useEditProfile from '@/features/billing/hooks/useEditProfile';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import { useTranslations } from 'next-intl';

const EditProfilePage = () => {
  const { form, onSubmit } = useEditProfile();

  const t = useTranslations('component.features.billing.edit-profile');

  return (
    <Dashboard className="h-full ">
      <DashboardHeader>
        <DashboardHeaderRight />
      </DashboardHeader>

      <DashboardContent className="grid md:grid-cols-2 grid-cols-1  w-full ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full w-full flex flex-col gap-6"
          >
            <Card className="rounded-[8px] bg-white h-full flex flex-col w-full">
              <CardHeader className="">
                <CardTitle className="text-lg font-medium">
                  {t('title')}
                </CardTitle>
                <CardDescription>{t('subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-x-8 gap-y-6">
                {/* Company Legal Name */}
                <FormField
                  control={form.control}
                  name="companyLegalName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {t('form.company-legal-name.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.company-legal-name.placeholder')}
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company Address */}
                <FormField
                  control={form.control}
                  name="companyAddress"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel> {t('form.company-address.label')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('form.company-legal-name.placeholder')}
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TIN */}
                <FormField
                  control={form.control}
                  name="taxIdentificationNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        {t('form.tax-identification-number.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'form.tax-identification-number.placeholder'
                          )}
                          maxLength={100}
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
                  disabled={
                    form.formState.isSubmitting || !form.formState.isValid
                  }
                  className="w-full"
                >
                  {t('form.save-changes')}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DashboardContent>
    </Dashboard>
  );
};

export default EditProfilePage;
