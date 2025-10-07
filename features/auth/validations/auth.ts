import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type TypeLoginSchema = z.infer<typeof loginSchema>;
