'use client';

import { Download } from 'lucide-react';

import { useInvoiceForm } from '@/features/billing/hooks/useInvoiceForm';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

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
                  {t('screens.invoice.hereYouCanDownloadTheInvoice')}
                </CardTitle>
                <CardDescription>
                  {' '}
                  {t(
                    'screens.invoice.downloadInvoiceBasedOnTheMonthAndYearFilter'
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-x-8 gap-y-6 w-full">
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
                        <FormControl className="w-full">
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
                        <FormControl className="w-full">
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Download className="mr-2 h-4 w-4" />
                  {form.formState.isSubmitting
                    ? t('screens.common.downloading')
                    : t('screens.common.download')}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DashboardContent>
    </Dashboard>
  );
};

export default InvoicePage;
