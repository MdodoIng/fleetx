'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { vendorService } from '@/shared/services/vendor';
import { useVendorStore } from '@/store';
import { TypeUpdateCompanyBillingRequest } from '@/shared/types/vendor';

export const billingProfileSchema = z.object({
  companyLegalName: z
    .string()
    .min(1, 'Company Legal Name is required')
    .max(100),
  companyAddress: z.string().min(1, 'Company Address is required').max(100),
  taxIdentificationNumber: z.string().min(1, 'TIN is required').max(100),
});

export type BillingProfileFormData = z.infer<typeof billingProfileSchema>;

export default function useEditProfile() {
  const { vendorId, selectedVendor } = useVendorStore();

  const form = useForm<BillingProfileFormData>({
    resolver: zodResolver(billingProfileSchema),
    mode: 'onChange',
    defaultValues: {
      companyLegalName: '',
      companyAddress: '',
      taxIdentificationNumber: '',
    },
  });

  // 🔹 Fetch vendor billing info
  useEffect(() => {
    document.title = 'Edit Profile';

    const fetchBillingInfo = async () => {
      try {
        const vendorIdToUse = vendorId || selectedVendor?.id;
        if (!vendorIdToUse) return;

        const res = await vendorService.getCompanyBilling(vendorIdToUse);
        if (res.data) {
          form.reset({
            companyLegalName: res.data.company_legal_name || '',
            companyAddress: res.data.company_legal_address || '',
            taxIdentificationNumber: res.data.tin || '',
          });
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch billing information.');
      }
    };

    fetchBillingInfo();
  }, [vendorId, selectedVendor]);

  // 🔹 Handle submit
  const onSubmit = async (data: BillingProfileFormData) => {
    const payload: TypeUpdateCompanyBillingRequest = {
      company_legal_name: data.companyLegalName.trim(),
      company_legal_address: data.companyAddress.trim(),
      tin: data.taxIdentificationNumber.trim(),
    };

    try {
      const vendorIdToUse = vendorId || selectedVendor?.id;
      if (!vendorIdToUse) return;

      await vendorService.updateCompanyBilling(vendorIdToUse, payload);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred.');
    }
  };

  return {
    form,
    onSubmit,
  };
}
