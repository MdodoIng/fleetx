import { z } from 'zod';

export const signUpFormSchema = z.object({
  businessName: z.string().min(2),
  businessType: z.number().min(1, 'Please select a business type'),
  fullName: z.string().min(2),
  phone: z.string().min(7).max(7),
  address: z.string().min(5),
  landmark: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(6, 'Confirm Password must be at least 8 characters'),
  area: z.string(),
  area_id: z.any(),
  block: z.string(),
  block_id: z.any(),
  street: z.string(),
  street_id: z.any(),
  building: z.string(),
  building_id: z.any(),
});

export type TypeSignUpForm = z.infer<typeof signUpFormSchema>;
