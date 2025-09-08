'use client';

import { Toaster } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form';
import useEditProfile from '@/features/billing/hooks/useEditProfile';

const EditProfilePage = () => {
  const { form, onSubmit } = useEditProfile();

  return (
    <>
      <Toaster position="top-right" richColors />
      <Card className="w-full  mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-[#30d9c4] text-xl font-extrabold text-center">
            Here you can edit your billing profile
          </CardTitle>
          <div className="mt-2 text-sm font-semibold text-[#2d5a76] text-center space-y-1">
            <p>Please add/update your company billing information below.</p>
            <p>The below details will be reflected in the generated invoice.</p>
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
              {/* Company Legal Name */}
              <FormField
                control={form.control}
                name="companyLegalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Legal Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Legal Name"
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
                  <FormItem>
                    <FormLabel>Company Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Address"
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
                  <FormItem>
                    <FormLabel>Tax Identification Number</FormLabel>
                    <FormControl>
                      <Input placeholder="TIN" maxLength={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="justify-center pt-4">
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                className="w-48"
              >
                {form.formState.isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
};

export default EditProfilePage;
