import {
  paymentSchema,
  TypepaymentSchema,
} from '@/features/orders/validations/editPayment';

import AddressLandmarkFields from '@/shared/components/InputSearch';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { hasValue } from '@/shared/lib/helpers';
import { orderService } from '@/shared/services/orders';
import {
  TypeOrderHistoryList,
  TypeUpdateAddressReq,
  TypeUpdatePaymentReq,
} from '@/shared/types/orders';
import { zodResolver } from '@hookform/resolvers/zod';
import { Value } from '@radix-ui/react-select';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import z from 'zod';

const EditPayment = ({
  data,
  fetchOrderDetails,
}: {
  data: TypeOrderHistoryList;
  fetchOrderDetails: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TypepaymentSchema>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount_to_collect: data.amount_collected!,
      payment_type: data.payment_type as 1 | 2,
    },
  });

  const validateFormsAsync = async (): Promise<boolean> => {
    const paymentType = form.getValues('payment_type');
    if (paymentType !== 1) return true;

    try {
      return await form.trigger(['payment_type', 'amount_to_collect']);
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const formValues = form.watch();
  const paymentType = form.watch('payment_type');
  const isCOD = paymentType === 1;

  const handleSumbitAction = async () => {
    const isValid = await validateFormsAsync();
    if (!isValid) {
      console.log('not valid');
      return;
    }
    const requst: TypeUpdatePaymentReq = {
      payment_type: formValues.payment_type,
      amount_to_collect: Number(formValues.amount_to_collect),
    };

    try {
      const res = await orderService.updatePayment(
        requst,
        data.fleetx_order_number
      );
      console.log('Address updated successfully:', res);
      await fetchOrderDetails();
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <form>
        <DialogTrigger asChild>
          <Button className="absolute !p-1 h-auto top-2 right-2">
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-fit">
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
          </DialogHeader>
          <hr />
          <Form {...form}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="grid gap-6 md:grid-cols-2"
            >
              <RadioGroup
                onValueChange={(val) =>
                  form.setValue(
                    'payment_type',
                    val ? (parseInt(val, 10) as 1 | 2) : 1
                  )
                }
                defaultValue={String(form.getValues('payment_type'))}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center">
                  <RadioGroupItem value="1" id="1" />
                  <Label htmlFor="1" className="ml-2">
                    COD
                  </Label>
                </div>

                <div className="flex items-center">
                  <RadioGroupItem value="2" id="2" />
                  <Label htmlFor="2" className="ml-2">
                    KEKT
                  </Label>
                </div>
              </RadioGroup>

              <FormField
                control={form.control}
                name="amount_to_collect"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Amount"
                        {...field}
                        disabled={!isCOD}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <hr />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={async () => await handleSumbitAction()}
              type="submit"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EditPayment;
