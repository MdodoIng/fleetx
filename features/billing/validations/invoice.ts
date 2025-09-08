import z from 'zod';

export const invoiceFormSchema = z.object({
  year: z
    .string({ error: 'Please select a year.' })
    .min(1, 'Please select a year.'),
  month: z
    .string({ error: 'Please select a month.' })
    .min(1, 'Please select a month.'),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
