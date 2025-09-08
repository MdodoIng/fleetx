import { format } from 'date-fns';
import clsx from 'clsx';

export default function ReferralRow({ item, index }: { item: any; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={clsx(
        'flex py-2 px-2 rounded-md',
        isEven ? 'bg-[#fbfcfc]' : 'bg-gradient-to-l from-white to-[#dee7ed]'
      )}
    >
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">{item.refBonusTo}</div>
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">
        {format(new Date(item.orderDate), 'dd MMM yyyy hh:mm a')}
      </div>
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">{item.orderNumber}</div>
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">{item.vendorName}</div>
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">{item.branchName}</div>
      <div className="flex-1 text-center text-sm text-[#2d5a76] font-semibold">
        {item.fee?.toFixed(2)}
      </div>
    </div>
  );
}
