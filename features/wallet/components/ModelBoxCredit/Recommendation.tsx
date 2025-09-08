import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useSharedStore, useWalletStore } from '@/store';

interface RecommendationOption {
  value: number;
  label: string;
  desc: string;
  label2?: string;
  lebal2?: string;
}

interface RecommendationProps {
  recommendations: RecommendationOption[];

  setIsOpen: (isOpen: number) => void;
  setAmount: (amount: number) => void;
}

export default function Recommendation({
  recommendations,

  setIsOpen,
  setAmount,
}: RecommendationProps) {
  const { appConstants } = useSharedStore();
  const walletStore = useWalletStore();
  return (
    <>
      {/* Options */}
      <div className="space-y-3">
        {recommendations.map((opt, i) => (
          <Card
            key={i}
            className="border border-yellow-300 p-3  hover:shadow-md transition cursor-pointer"
          >
            <CardContent className="flex justify-between items-center p-0">
              <div>
                <p className="text-base font-semibold">
                  {opt.value} {appConstants?.currency}
                </p>
                <p className="text-sm text-gray-500">
                  {opt.label} {opt.label2}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  walletStore.isDisableAddCredit && setIsOpen(2);
                  setAmount(opt.value);
                }}
                className="bg-yellow-50 border-yellow-300 text-gray-700 text-xs"
              >
                {opt.desc}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Note */}
      <p className="mt-4 text-sm text-gray-600 flex items-center gap-1 justify-center">
        <span role="img" aria-label="money">
          💰
        </span>
        Delivery Charge: <span className="font-medium">1.50 KD per Order</span>
      </p>
    </>
  );
}
