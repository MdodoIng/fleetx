import z from 'zod/v3';

export const addressSchema = z.object({
  address: z
    .string({
      invalid_type_error: 'Address must be a string',
      required_error: 'Address is required',
    })
    .min(3, { message: 'Address must be at least 3 characters long' }),
  area: z
    .string({
      invalid_type_error: 'Area must be a string',
    })
    .optional(),
  area_id: z
    .number({
      invalid_type_error: 'Area ID must be a number',
    })
    .optional(),
  block: z
    .string({
      invalid_type_error: 'Block must be a string',
    })
    .optional(),
  block_id: z
    .number({
      invalid_type_error: 'Block ID must be a number',
    })
    .optional(),
  building: z
    .string({
      invalid_type_error: 'Building must be a string',
    })
    .optional(),
  building_id: z
    .number({
      invalid_type_error: 'Building ID must be a number',
    })
    .optional(),
  floor: z
    .string({
      invalid_type_error: 'Floor must be a string',
    })
    .optional(),
  landmark: z
    .string({
      invalid_type_error: 'Landmark must be a string',
    })
    .optional(),
  latitude: z.any(),
  longitude: z.any(),
  room_number: z
    .string({
      invalid_type_error: 'Room number must be a string',
    })
    .optional(),
  street: z
    .string({
      invalid_type_error: 'Street must be a string',
    })
    .optional(),
  street_id: z
    .number({
      invalid_type_error: 'Street ID must be a number',
    })
    .optional(),
});

export type TypeAddressSchema = z.infer<typeof addressSchema>;
