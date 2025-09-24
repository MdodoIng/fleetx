import z from 'zod';

export const editVendorNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  name_ar: z.string().optional(),

  cod_counter_type: z.number(),
});

export const editVendorBranchSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .regex(/^[^\s].*/, { message: 'Cannot start with space' }),
  name_ar: z.any().optional(),

  mobile_number: z
    .string()
    .min(8, 'Mobile number is required')
    .regex(/^[0-9]*$/, { message: 'Only numbers allowed' })
    .max(8),
  main_branch: z.any(),
  address: z.object({
    address: z.any().optional(),
    area: z.string(),
    area_id: z.any(),
    block: z.string(),
    block_id: z.any(),
    street: z.string(),
    street_id: z.any(),
    building: z.string().optional(),
    building_id: z.any().optional(),
    floor: z.string().optional(),
    room_number: z.string().optional(),
    landmark: z.any().optional(),
    latitude: z.any(),
    longitude: z.any(),
    paci_number: z.any().optional(),
  }),
});

export type TypeEditVendorNameSchema = z.infer<typeof editVendorNameSchema>;
export type TypeEditVendorBranchSchema = z.infer<typeof editVendorBranchSchema>;
