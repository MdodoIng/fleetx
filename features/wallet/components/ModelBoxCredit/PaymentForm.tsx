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
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

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

  const t = useTranslations();

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
                    <Label>{t('component.features.wallet.paymentType')}</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'component.features.wallet.selectPaymentType'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit">
                          {t('component.features.wallet.creditCard')}
                        </SelectItem>
                        <SelectItem value="debit">
                          {t('component.features.wallet.debitCard')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    PaymentForm
                  </FormItem>
                )}
              />

              <FormField
                control={addCreditDebitform.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="amount">
                      {t('component.features.orders.create.form.amount.label')}
                    </Label>
                    <FormControl>
                      <Input
                        id="amount"
                        placeholder={t.rich(
                          'component.features.orders.create.form.amount.placeholder',
                          {
                            value: sheredStore.appConstants?.currency,
                          }
                        )}
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
                    <Label htmlFor="note">
                      {t('component.features.wallet.note')}
                    </Label>
                    <FormControl>
                      <Input
                        id="note"
                        placeholder={t(
                          'component.features.wallet.addNotesHere'
                        )}
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
              <h2 className="text-lg font-semibold mb-4">
                {t('component.features.wallet.recharge-summary')}
              </h2>

              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow className="text-dark-grey ">
                    <TableHead className="px-3 pr-10 py-2 ">
                      {' '}
                      {t('component.features.wallet.branch')}
                    </TableHead>
                    <TableHead className="px-3 py-2 ">
                      {' '}
                      {t('component.features.wallet.currentAmount')}
                    </TableHead>
                    <TableHead className="px-3 py-2 ">
                      {t('component.features.wallet.rechargeAmount')}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-gray-50">
                      <TableCell className="px-3 py-2">
                        {item.branch.name}
                      </TableCell>
                      <TableCell
                        className={`px-3 py-2 ${item.currentAmount < 0 ? 'text-red-600' : ''}`}
                      >
                        {item.currentAmount}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <Input
                          type="number"
                          value={item.rechargeAmount}
                          onChange={(e) =>
                            handleRechargeChange(idx, e.target.value)
                          }
                          className="w-auto px-2 py-1 text-right "
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} className="px-3 py-2 font-semibold">
                      {t('component.features.wallet.totalAmount')}
                    </TableCell>
                    <TableCell className="px-3 py-2 font-semibold">
                      {totalRecharge} {sheredStore.appConstants?.currency}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">
                  {' '}
                  {t('component.features.wallet.creditAmount')}:
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={String(amount) || '0'}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder={t.rich(
                      'component.features.orders.create.form.amount.placeholder',
                      {
                        value: sheredStore.appConstants?.currency,
                      }
                    )}
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
          {t('component.features.wallet.smartRecommendations')}
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
                'cursor-pointer bg-[#FEFEE3] ',
                amount === item.value
                  ? 'border-primary-blue'
                  : 'border-[#DEEF03]'
              )}
            >
              <CardContent className="p-4 text-center space-y-2">
                <p className="text-sm font-bold">
                  {item.value} {sheredStore.appConstants?.currency}
                </p>
                <p className="text-xs">{item.label}</p>
                <span className="inline-block text-[11px] px-4 py-1 rounded-[8px] bg-white">
                  {item.desc}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-4 text-sm text-dark-grey/70 text-center">
        {t.rich('component.features.wallet.deliveryCharge', {
          value: sheredStore.appConstants?.currency,
        })}
      </p>

      <Button
        onClick={() =>
          isAddCreditDebit
            ? submitCreditDebitPrepare(addCreditDebitform)
            : submitAddCredit(data || amount)
        }
      >
        {t('component.features.wallet.addCredit')}
      </Button>
    </>
  );
};

export default PaymentForm;
