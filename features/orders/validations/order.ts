import z from 'zod';

export const pickUpSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  paciNumber: z
    .string()
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' })
    .optional(),
  floor: z.string().optional(),
  landmark: z.array(z.string()).optional(),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  latitude: z.string().min(1, 'Latitude is required').optional(),
  longitude: z.string().min(1, 'Longitude is required').optional(),
});

export const dropOffSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  floor: z.string().optional(),
  roomNumber: z.string().optional(),
  paymentType: z.string().min(1, 'Payment type is required'),
  landmark: z.string().optional(),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')

    .optional(),
  amount: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === null ||
        val === '' ||
        /^(?=.*[0-9])(?:[0-9]\d*\.?|0?\.)\d*$/.test(val),
      {
        message: 'Invalid amount',
      }
    )
    .optional(),
  latitude: z.string().min(1, 'Latitude is required').optional(),
  longitude: z.string().min(1, 'Longitude is required').optional(),
  vendorOrderNumber: z.string().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
