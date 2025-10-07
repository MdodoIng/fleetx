import z from 'zod';

export const addEditAccountManagerSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .regex(/^[^\s].*/, 'Invalid format'),
  last_name: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val: any) => val === '' || /^[^\s].*/.test(val), {
      message: 'Invalid format',
    }),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\d{9,15}$/, 'Invalid phone number'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be at most 20 characters')
    .regex(/^[^\s].+[^\s]$/, 'Invalid password format')
    .optional(),
});

export type TypeAddEditAccountManagerSchema = z.infer<
  typeof addEditAccountManagerSchema
>;
