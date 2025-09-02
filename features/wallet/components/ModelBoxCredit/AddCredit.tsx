import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { useSharedStore, useVenderStore, useWalletStore } from '@/store';
import { useAddCredit } from '../../hooks/useAddCredit';
import { useEffect, useState } from 'react';
import { vendorService } from '@/shared/services/vender';

type BranchData = {
  branch: string;
  currentAmount: number;
  rechargeAmount: any;
};

const AddCredit = ({
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
  const { submitAddCredit } = useAddCredit();
  const { isCentralWalletEnabled, isMultiplePayment, isAddCreditDebit } =
    useWalletStore();
  const { branchDetails } = useVenderStore();

  const handleRechargeChange = (index: number, value: any) => {
    const updated = data && [...data];
    updated![index].rechargeAmount = value;
    setData(updated);
  };

  const totalRecharge =
    data && data.reduce((sum, item) => sum + item.rechargeAmount, 0);

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
            branch: item.name,
            currentAmount: Number(res.data.wallet_balance),
            rechargeAmount: 0,
          };
        }) || []
      );
      setData(isData);
    };
    fetchData();
  }, [isMultiplePayment, branchDetails]);

  return (
    <>
      {isAddCreditDebit ? (
        <></>
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
                      <td className="py-2 px-3">{item.branch}</td>
                      <td
                        className={`py-2 px-3 ${item.currentAmount < 0 ? 'text-red-600' : ''}`}
                      >
                        {item.currentAmount}
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          value={String(item.rechargeAmount)}
                          onChange={(e) =>
                            handleRechargeChange(idx, Number(e.target.value))
                          }
                          className="w-20 px-2 py-1 border rounded text-right"
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
      <div hidden={isMultiplePayment}>
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
        onClick={() => submitAddCredit(amount)}
        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 "
      >
        Add Credit
      </Button>
    </>
  );
};

export default AddCredit;
