import { TypeZoneGrowth } from '@/shared/types/report';
import Image from 'next/image';
import NoData from '../user_referrals/NoData';

const monthNames = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function ZoneGrowthTable({ data }: { data: TypeZoneGrowth[] }) {
  if (!data?.length) {
    return <NoData />;
  }

  const orderData = data.sort((a, b) => a.month - b.month);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Month</th>
            <th className="p-3 text-left">Total Branches</th>
            <th className="p-3 text-left">Retained</th>
            <th className="p-3 text-left">Non Retained</th>
            <th className="p-3 text-left">Not Ordered</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((row, idx) => (
            <tr
              key={row.month}
              className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
            >
              <td className="p-3">{monthNames[row.month]}</td>
              <td className="p-3">{row.all_branches_count}</td>
              <td className="p-3">{row.active_branches_count}</td>
              <td className="p-3">{row.inactive_branches_count}</td>
              <td className="p-3">{row.not_ordered_branches_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
