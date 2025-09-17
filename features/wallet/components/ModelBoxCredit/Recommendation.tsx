import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useSharedStore, useWalletStore } from '@/store';
import { useTranslations } from 'next-intl';

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

  const t = useTranslations('component.features.wallet');
  return (
    <>
      {/* Options */}
      <div className="space-y-3">
        {recommendations.map((opt, i) => (
          <Card
            key={i}
            className="border-[#DEEF03] bg-[#FEFEE3] text-dark-grey"
          >
            <CardContent className="flex justify-between gap-10">
              <div>
                <p className="text-base font-semibold">
                  {opt.value} {appConstants?.currency}
                </p>
                <p className=" opacity-70 max-w-[40ch]">
                  {opt.label} {opt.label2}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (walletStore.isDisableAddCredit) {
                    setIsOpen(2);
                    setAmount(opt.value);
                  }
                }}
                className="bg-white/70 border-none text-dark-grey text-xs"
              >
                {opt.desc}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Note */}
      <p className="mt-4 text-sm text-dark-grey/70 text-center">
        {t.rich('deliveryCharge', {
          value: appConstants?.currency,
        })}
      </p>
    </>
  );
}
