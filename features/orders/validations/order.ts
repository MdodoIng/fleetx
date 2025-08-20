import z from 'zod';

export const pickUpSchema = z.object({
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),

  mobile_number: z
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
  apartment_no: z.string(),
  floor: z.string(),
  additional_address: z.string(),
  latitude: z.string(),
  longitude: z.string(),
});

export const dropOffSchema = z.object({
  order_index: z.string(),
  customer_name: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  mobile_number: z
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
  apartment_no: z.string(),
  floor: z.string(),
  additional_address: z.string(),
  amount_to_collect: z.string().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
