import z from 'zod/v3';

export const addCreditDebitformSchema = z.object({
  paymentType: z.enum(['credit', 'debit'], {
    required_error: 'Payment Mode Required',
  }),
  amount: z.number().min(1),
  note: z.string().optional(),
});

export type TypeAddCreditDebitformSchema = z.infer<
  typeof addCreditDebitformSchema
>;
