export default function FunnelChart({
  data,
}: {
  data: {
    title: string;
    count: any;
    percentage?: any;
  }[];
}) {
  return (
    <div className="bg-white rounded-xl p-6 text-center h-[90vh] flex flex-col justify-center items-center">
      <div className="w-[500px] space-y-6">
        {data.map((step, idx) => (
          <div
            key={idx}
            className={`relative h-24 mx-auto border-t-[76px] border-transparent border-t-[#30d9c4] rounded-[48px] ${
              idx === 1 ? 'mx-[60px]' : idx === 2 ? 'mx-[115px]' : ''
            }`}
          >
            <div className="absolute top-[-50px] w-full text-white">
              <div className="uppercase text-xs tracking-widest font-medium">
                {step.title}
              </div>
              {step.percentage && (
                <div className="text-white text-opacity-50 text-lg font-bold text-left">
                  {step.percentage}
                </div>
              )}
              <div className="text-lg font-bold text-center">{step.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
