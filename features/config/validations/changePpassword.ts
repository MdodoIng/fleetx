import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Too short').max(32),
    password: z
      .string()
      .min(6)
      .max(32)
      .regex(/^[^\s].+[^\s]$/, 'No leading/trailing spaces'),
    confirmPassword: z.string().min(6).max(32),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TypeChangePasswordForm = z.infer<typeof changePasswordSchema>;
