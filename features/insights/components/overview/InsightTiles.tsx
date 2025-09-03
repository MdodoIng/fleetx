export default function InsightTiles({
  metrics,
}: {
  metrics: {
    title: string;
    count: any;
    highlight?: boolean;
  }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map(({ title, count, highlight }, idx) => (
        <div
          key={idx}
          className={`rounded-xl shadow-md p-6 text-center ${
            highlight ? 'bg-[#ff8e6e] text-white' : 'bg-white'
          }`}
        >
          <div className="text-4xl font-bold">{count}</div>
          <div className="text-sm font-semibold mt-2">{title}</div>
        </div>
      ))}
    </div>
  );
}
