// src/features/config/validations/changePassword.ts
import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, 'Current password must be at least 8 characters')
      .max(50, 'Current password must be at most 50 characters')
      .regex(
        /^[^\s].*[^\s]$/,
        'Current password cannot start or end with a space'
      ),
    password: z
      .string()
      .min(6, 'New password must be at least 8 characters')
      .max(50, 'New password must be at most 50 characters')
      .regex(/^[^\s].*[^\s]$/, 'New password cannot start or end with a space'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 8 characters')
      .max(50, 'Confirm password must be at most 50 characters')
      .regex(
        /^[^\s].*[^\s]$/,
        'Confirm password cannot start or end with a space'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const resetPasswordSchema = changePasswordSchema
  .pick({ password: true, confirmPassword: true })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type TypeChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type TypeResetPasswordForm = z.infer<typeof resetPasswordSchema>;
