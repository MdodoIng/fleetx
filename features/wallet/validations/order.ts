import z from 'zod';

export const alertSchema = z.object({
  'mobile-number': z.string().min(8, 'Mobile number is required').max(8),
});
export type TypeAlertSchema = z.infer<typeof alertSchema>;
