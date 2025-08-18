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
  address: z.object({
    area: z.string().optional(),
    block: z.string().optional(),
    street: z.string().optional(),
    area_id: z.number().optional(),
    block_id: z.number().optional(),
    building: z.string().optional(),
    landmark: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    street_id: z.number().optional(),
    building_id: z.number().optional(),
    paci_number: z.string().optional(),
  }),
  mobileNumber: z.string().min(1, 'Mobile number is required'),
  additionalAddress: z.string().optional(),
});

export const dropOffSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  floor: z.string().optional(),
  roomNumber: z.string().optional(),
  paymentType: z.string().min(1, 'Payment type is required'),
  address: z.object({
    area: z.string().optional(),
    block: z.string().optional(),
    street: z.string().optional(),
    area_id: z.number().optional(),
    block_id: z.number().optional(),
    building: z.string().optional(),
    landmark: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    street_id: z.number().optional(),
    building_id: z.number().optional(),
    paci_number: z.string().optional(),
  }),

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
  additionalAddress: z.string().optional(),

  vendorOrderNumber: z.string().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
export type TypeLandMarkScema = TypePickUpSchema['address'];
