import Image from 'next/image';

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

export default function ZoneGrowthTable({ data }) {
  if (!data.length) {
    return (
      <div className="text-center mt-12">
        <Image
          src="/images/nodata.png"
          alt="No data"
          width={120}
          height={120}
        />
        <p className="mt-4 text-gray-500">Whoops! no data found</p>
      </div>
    );
  }

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
          {data.map((row, idx) => (
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
