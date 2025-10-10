import { z } from 'zod';

export const signUpFormSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters'),
  businessType: z.number().min(1, 'Please select a business type'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^\d+$/, 'Only numbers are allowed')
    .min(8, 'Phone number must be at least 7 digits')
    .max(8, 'Phone number cannot exceed 15 digits'),

  address: z.string().min(5, 'Address must be at least 5 characters'),
  landmark: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(8, 'Confirm Password must be at least 8 characters'),
  area: z.string().min(2, 'Area must be at least 2 characters'),
  area_id: z.any(),
  block: z.string().min(2, 'Block must be at least 2 characters'),
  block_id: z.any(),
  street: z.string().min(2, 'Street must be at least 2 characters'),
  street_id: z.any(),
  building: z.string().min(2, 'Building must be at least 2 characters'),
  building_id: z.any(),
  latitude: z.any(),
  longitude: z.any(),
});

export type TypeSignUpForm = z.infer<typeof signUpFormSchema>;
