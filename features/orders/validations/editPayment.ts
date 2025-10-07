import z from 'zod/v3';

export const paymentSchema = z
  .object({
    payment_type: z.union([z.literal(1), z.literal(2)]),
    amount_to_collect: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.payment_type === 1) {
        return !!data.amount_to_collect;
      }
      return true;
    },
    {
      message: 'Amount is required for COD',
      path: ['amount_to_collect'],
    }
  );

export type TypePaymentSchema = z.infer<typeof paymentSchema>;
