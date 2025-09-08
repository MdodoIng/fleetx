import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useSharedStore, useVenderStore, useWalletStore } from '@/store';
import { useAddCredit } from '../../hooks/useAddCredit';
import { useEffect, useState } from 'react';
import { vendorService } from '@/shared/services/vender';
import { TypeBranch } from '@/shared/types/vender';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import z from 'zod/v3';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addCreditDebitformSchema,
  TypeAddCreditDebitformSchema,
} from '../../validations/paymentForm';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form';

type BranchData = {
  branch: TypeBranch;
  currentAmount: number;
  rechargeAmount: number;
};

const PaymentForm = ({
  amount,
  setAmount,
  recommendations,
  setSelected,
}: {
  amount: number;
  setAmount: (amount: number) => void;
  recommendations: { value: number; label: string; desc: string }[];
  setSelected: (value: number) => void;
}) => {
  const [data, setData] = useState<BranchData[]>();
  const sheredStore = useSharedStore();
  const { submitAddCredit, submitCreditDebitPrepare } = useAddCredit();
  const {
    isCentralWalletEnabled,
    isMultiplePayment,
    isAddCreditDebit,
    setValue,
    prepareMashkor,
  } = useWalletStore();
  const { branchDetails } = useVenderStore();
  const [paymentType, setPaymentType] = useState('');
  const [note, setNote] = useState('');

  const handleRechargeChange = (index: number, value: any) => {
    const updated = data && [...data];
    updated![index].rechargeAmount = value;
    setData(updated);
  };

  const totalRecharge =
    data &&
    data?.reduce((sum, item) => sum + (Number(item.rechargeAmount) || 0), 0);

  const addCreditDebitform = useForm<TypeAddCreditDebitformSchema>({
    resolver: zodResolver(addCreditDebitformSchema),
    defaultValues: {
      paymentType: 'credit',
      amount: 0,
      note: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (!isMultiplePayment) return;
    const fetchData = async () => {
      const isData: BranchData[] = await Promise.all(
        branchDetails?.map(async (item) => {
          const res = await vendorService.getVendorWalletBalance(
            item.vendor.id,
            item.id
          );
          return {
            branch: item,
            currentAmount: Number(res.data.wallet_balance),
            rechargeAmount: 0,
          };
        }) || []
      );
      setData(isData);
    };
    fetchData();
  }, [isMultiplePayment, branchDetails]);
  
  
  console.log(isAddCreditDebit, "isAddCreditDebit")

  return (
    <>
      {isAddCreditDebit ? (
        <>
          <Form {...addCreditDebitform}>
            <div className=" space-y-6 ">
              <FormField
                control={addCreditDebitform.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <Label>Payment Type</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Payment Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addCreditDebitform.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="amount">Amount</Label>
                    <FormControl>
                      <Input
                        id="amount"
                        placeholder="Enter amount"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                        }}
                        onBlur={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value);
                          field.onBlur();
                        }}
                        value={field.value === 0 ? '' : String(field.value)}
                        className="bg-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addCreditDebitform.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="note">Note</Label>
                    <FormControl>
                      <Input
                        id="note"
                        placeholder="You can add some notes here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </>
      ) : (
        <>
          {isMultiplePayment ? (
            <div className="pb-10">
              <h2 className="text-lg font-semibold mb-4">Recharge Summary</h2>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-medium text-gray-700">
                      Branch
                    </th>
                    <th className="py-2 px-3 font-medium text-gray-700">
                      Current Amount
                    </th>
                    <th className="py-2 px-3 font-medium text-gray-700">
                      Recharge Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3">{item.branch.name}</td>
                      <td
                        className={`py-2 px-3 ${item.currentAmount < 0 ? 'text-red-600' : ''}`}
                      >
                        {item.currentAmount}
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.rechargeAmount}
                          onChange={(e) =>
                            handleRechargeChange(idx, e.target.value)
                          }
                          className="w-20 px-2 py-1 border rounded text-right appearance-none"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="py-2 px-3 font-semibold">
                      Total Amount
                    </td>
                    <td className="py-2 px-3 font-semibold">{totalRecharge}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Credit Amount:</label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={String(amount) || '0'}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                    className="flex-1 border-blue-500 focus-visible:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-600">
                    {sheredStore.appConstants?.currency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div hidden={isMultiplePayment || isAddCreditDebit}>
        <p className="flex items-center gap-2 text-sm font-medium mb-3">
          💡 Smart Recharge Recommendation
        </p>
        <div className="grid grid-cols-3 gap-3">
          {recommendations.map((item, idx) => (
            <Card
              key={idx}
              onClick={() => {
                setSelected(item.value);
                setAmount(item.value);
              }}
              className={cn(
                'cursor-pointer border rounded-xl transition-all',
                amount === item.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-blue-400'
              )}
            >
              <CardContent className="p-4 text-center space-y-2">
                <p className="text-sm font-bold">
                  {item.value} {sheredStore.appConstants?.currency}
                </p>
                <p className="text-xs text-gray-600">{item.label}</p>
                <span className="inline-block text-[11px] px-2 py-1 rounded-md bg-gray-100 text-gray-600">
                  {item.desc}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-4 text-sm text-gray-600 flex items-center gap-1 justify-center">
        <span role="img" aria-label="money">
          💰
        </span>
        Delivery Charge: <span className="font-medium">1.50 KD per Order</span>
      </p>

      <Button
        onClick={() =>
          isAddCreditDebit
            ? submitCreditDebitPrepare(addCreditDebitform)
            : submitAddCredit(data || amount)
        }
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 "
      >
        Add Credit
      </Button>
    </>
  );
};

export default PaymentForm;
