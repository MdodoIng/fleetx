import { AlertSettings } from '@/features/wallet/components/AlertSettings';
import { RecentTransactions } from '@/features/wallet/components/RecentTransactions';
import { WalletBalance } from '@/features/wallet/components/WalletBalance';

export default function WalletPage() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2">
      <WalletBalance />
      <RecentTransactions />
      <AlertSettings />
    </div>
  );
}
