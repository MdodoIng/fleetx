import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

export default function InsightTiles({
  metrics,
}: {
  metrics: {
    title: string;
    count: string | number;
    highlight?: boolean;
  }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map(({ title, count, highlight }, idx) => (
        <Card
          key={idx}
          className={cn(
            'py-4',
            highlight ? 'bg-primary-blue text-white' : 'bg-white'
          )}
        >
          <CardContent className="gap-6 flex flex-col px-4 h-full">
            <div className="flex items-center justify-between gap-2">
              <CardTitle
                className={cn(
                  'text-sm opacity-70',
                  highlight && 'text-white opacity-100'
                )}
              >
                {title}
              </CardTitle>
            </div>
            <CardContent className="px-0 mt-auto">
              <CardDescription
                className={cn(
                  'text-2xl font-medium',
                  highlight && 'text-white  opacity-70'
                )}
              >
                {count}
              </CardDescription>
            </CardContent>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
