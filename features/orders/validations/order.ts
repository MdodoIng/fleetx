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
  apartment_no: z.string().min(1,"is required"),
  floor: z.string().min(1,"is required"),
  additional_address: z.string(),
  latitude: z.any(),
  longitude: z.any(),
});

export const dropOffSchema = z.object({
  order_index: z.string().min(2),
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
  latitude: z.any(),
  longitude: z.any(),
  apartment_no: z.string().min(2),
  floor: z.string().min(2),
  additional_address: z.string().optional(),
  amount_to_collect: z.any().optional(),
});

export type TypePickUpSchema = z.infer<typeof pickUpSchema>;
export type TypeDropOffSchema = z.infer<typeof dropOffSchema>;
