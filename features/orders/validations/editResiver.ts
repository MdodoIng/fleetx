import z from 'zod/v3';

export const addressSchema = z.object({
  address: z.string().min(3),
  area: z.string().optional(),
  area_id: z.number().optional(),
  block: z.string().optional(),
  block_id: z.number().optional(),
  building: z.string().optional(),
  building_id: z.number().optional(),
  floor: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.any(),
  longitude: z.any(),
  room_number: z.string().optional(),
  street: z.string().optional(),
  street_id: z.number().optional(),
});

export type TypeAddressSchemaSchema = z.infer<typeof addressSchema>;
