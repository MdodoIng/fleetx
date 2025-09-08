'use client';

import { Download } from 'lucide-react';
import { Toaster } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { useInvoiceForm } from '@/features/billing/hooks/useInvoiceForm';

const months = [
  { id: '1', name: 'Jan' },
  { id: '2', name: 'Feb' },
  { id: '3', name: 'Mar' },
  { id: '4', name: 'Apr' },
  { id: '5', name: 'May' },
  { id: '6', name: 'Jun' },
  { id: '7', name: 'Jul' },
  { id: '8', name: 'Aug' },
  { id: '9', name: 'Sep' },
  { id: '10', name: 'Oct' },
  { id: '11', name: 'Nov' },
  { id: '12', name: 'Dec' },
];

const years = Array.from({ length: 11 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { id: year.toString(), name: year.toString() };
});

const t = (key: string) => {
  const translations: { [key: string]: string } = {
    'screens.invoice.hereYouCanDownloadTheInvoice':
      'Here you can download the invoice',
    'screens.invoice.downloadInvoiceBasedOnTheMonthAndYearFilter':
      'Download invoice based on the month and year filter.',
    'screens.invoice.year': 'Year',
    'screens.invoice.month': 'Month',
    'screens.common.download': 'Download',
    'screens.common.downloading': 'Downloading...',
  };
  return translations[key] || key;
};

const InvoicePage = () => {
  const { form, onSubmit } = useInvoiceForm();

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex justify-center items-start p-4">
        <Card className="w-full ">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-extrabold text-[#30d9c4]">
              {t('screens.invoice.hereYouCanDownloadTheInvoice')}
            </CardTitle>
            <CardDescription className="!mt-4 text-sm font-semibold text-[#2d5a76]">
              {t('screens.invoice.downloadInvoiceBasedOnTheMonthAndYearFilter')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 flex flex-col items-center"
              >
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm">
                  {/* Year Select */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t('screens.invoice.year')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((y) => (
                              <SelectItem key={y.id} value={y.id}>
                                {y.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Month Select */}
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t('screens.invoice.month')}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-48 bg-[#19c6b1] hover:bg-[#15a594]"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting
                    ? t('screens.common.downloading')
                    : t('screens.common.download')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InvoicePage;
