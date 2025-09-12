import z from 'zod';

export const editUserSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  last_name: z
    .string()
    .regex(/^[^\s].*/, { message: 'Cannot start with space' })
    .optional(),

  phone: z
    .string()
    .min(8, 'Mobile number is required')
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' })
    .max(8),
  password: z.string().min(6, 'Password must be at least 8 characters'),
  email: z.string().email('Invalid email address'),
});

export type TypeEditUserSchema = z.infer<typeof editUserSchema>;
