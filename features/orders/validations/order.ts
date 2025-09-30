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
  area_id: z.any(),
  block: z.string(),
  block_id: z.any(),
  street: z.string(),
  street_id: z.any(),
  building: z.string(),
  building_id: z.any(),
  apartment_no: z.any().optional(),
  floor: z.string().optional(),
  additional_address: z.string().optional(),
  latitude: z.any(),
  longitude: z.any(),
});

export const dropOffSchema = z.object({
  order_index: z.any().optional(),
  customer_name: z
    .string()
    .min(1, 'Customer name is required')

    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  mobile_number: z
    .string()
    .min(7, 'Mobile number is required')
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' }),
  area: z.string(),
  area_id: z.any(),
  block: z.string(),
  block_id: z.any(),
  street: z.string(),
  street_id: z.any(),
  building: z.string().optional(),
  building_id: z.any().optional(),
  latitude: z.any(),
  longitude: z.any(),
  apartment_no: z.any().optional(),
  floor: z.any().optional(),
  additional_address: z.string().optional(),
  amount_to_collect: z.any().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
