import { Card, CardContent, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

export default function FunnelChart({
  data,
}: {
  data: {
    title: string;
    count: string | number;
    percentage?: string | number;
  }[];
}) {
  return (
    <Card className="flex items-center justify-center h-full">
      <CardContent className="space-y-6 flex flex-col items-center justify-center ">
        {data.map((step, idx) => (
          <Card
            key={idx}
            style={{
              width: `calc(100% - ${idx * 100}px)`,
            }}
            className={cn(
              `relative h-20  mx-auto text-white !rounded-full bg-primary-blue px-10 py-2 flex flex-col items-center justify-between gap-0 `
            )}
          >
            <div className="uppercase text-xs tracking-widest font-medium flex justify-between w-full">
              <CardTitle className={cn('text-sm')}>{step.title}</CardTitle>
              <div className=" font-bold text-center">{step.count}</div>
            </div>
            {step.percentage && (
              <div
                style={{
                  transform: `translateX(${Math.min(parseFloat(step.percentage as string), 90)}%)`,
                }}
                className="text-opacity-50 font-bold text-start w-full"
              >
                {step.percentage}
              </div>
            )}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
