'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { InvoiceFormData, invoiceFormSchema } from '../validations/invoice';
import { reportService } from '@/shared/services/report';
import { useVendorStore } from '@/store';

export function useInvoiceForm() {
  const { branchId, selectedBranch, vendorId, selectedVendor } =
    useVendorStore();
  const currentDate = new Date();
  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    values: {
      month: (currentDate.getMonth() + 1).toString(),
      year: currentDate.getFullYear().toString(),
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: InvoiceFormData) => {
    const { year, month } = data;
    const selectedYear = parseInt(year, 10);
    const selectedMonth = parseInt(month, 10);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const vendorIdToUse = vendorId || selectedVendor?.id;
    const branchIdToUse = branchId || selectedBranch?.id;

    if (!vendorIdToUse || !branchIdToUse) {
      toast.warning('Please select a branch and a vendor before downloading.');
      return;
    }

    if (selectedYear > currentYear) {
      toast.warning('Selected year cannot be in the future.');
      return;
    }
    if (selectedYear === currentYear && selectedMonth > currentMonth) {
      toast.warning('Selected month cannot be in the future.');
      return;
    }

    const promise = reportService.downloadInvoiceReport(
      vendorIdToUse,
      branchIdToUse,
      selectedMonth,
      selectedYear
    );

    toast.promise(promise, {
      loading: 'Downloading...',
      success: (res) => {
        if (res.data?.invoice_file) {
          window.open(res.data.invoice_file, '_blank');
        }
        return 'Invoice download link opened successfully!';
      },
    });
  };

  return { form, onSubmit };
}
