import z from 'zod/v3';

export const addCreditDebitformSchema = z.object({
  paymentType: z.enum(['credit', 'debit'], {
    required_error: 'Payment Mode Required',
  }),
  amount: z
    .number({ required_error: 'Amount is required' })
    .min(1, { message: 'Amount must be at least 1' }),
  note: z.string({ invalid_type_error: 'Note must be a string' }).optional(),
});

export type TypeAddCreditDebitformSchema = z.infer<
  typeof addCreditDebitformSchema
>;
