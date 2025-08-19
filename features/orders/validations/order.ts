import z from 'zod';

export const pickUpSchema = z.object({
  senderName: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),

  phone: z
    .string()
    .min(7, 'Mobile number is required')
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' }),
  area: z.string(),
  area_id: z.string(),
  block: z.string(),
  block_id: z.string(),
  street: z.string(),
  street_id: z.string(),
  building: z.string(),
  building_id: z.string(),
  apartmentNo: z.string(),
  floor: z.string(),
  additionalAddress: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const dropOffSchema = z.object({
  orderNumber: z.string(),
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  phone: z
    .string()
    .min(7, 'Mobile number is required')
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' }),
  area: z.string(),
  area_id: z.string(),
  block: z.string(),
  block_id: z.string(),
  street: z.string(),
  street_id: z.string(),
  building: z.string(),
  building_id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  apartmentNo: z.string(),
  floor: z.string(),
  additionalAddress: z.string(),
  amount: z.string().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
