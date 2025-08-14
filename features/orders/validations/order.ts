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
  landmark: z
    .array(
      z.object({
        name_ar: z.string().optional(),
        name_en: z.string().optional(),
        id: z.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        governorate_id: z.number().optional(),
        loc_type: z.string().optional(),
        nhood_id: z.number().optional(),
        block_id: z.number().optional(),
        area_id: z.number().optional(),
      })
    )
    .optional(),
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
  landmark: z
    .array(
      z.object({
        name_ar: z.string().optional(),
        name_en: z.string().optional(),
        id: z.number().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        governorate_id: z.number().optional(),
        loc_type: z.string().optional(),
        nhood_id: z.number().optional(),
        block_id: z.number().optional(),
        area_id: z.number().optional(),
      })
    )
    .optional(),

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
export type TypeLandMarkScema = TypePickUpSchema['landmark'];
