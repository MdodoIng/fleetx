import z from 'zod';

export const billingProfileSchema = z.object({
  companyLegalName: z
    .string()
    .min(1, 'Company Legal Name is required')
    .max(100),
  companyAddress: z.string().min(1, 'Company Address is required').max(100),
  taxIdentificationNumber: z.string().min(1, 'TIN is required').max(100),
});

export type BillingProfileFormData = z.infer<typeof billingProfileSchema>;
