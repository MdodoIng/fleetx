import { Clock } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { cn } from '@/shared/lib/utils';
import main_padding from '@/styles/padding';

export default function AlertMessage() {
  return (
    <div
      className={cn(
        'w-full mx-auto lg:hidden bg-[#FDFDD4] py-3 flex items-center justify-center gap-2',

        main_padding.dashboard.x,
        
      )}
    >
      <Clock className="text-dark-grey/50 w-6 h-6" />
      <div className="flex items-center gap-1">
        <p className=" text-dark-grey/50">Service Hours:</p>
        <p className=" text-dark-grey">7:00 AM – 11:59 PM</p>
      </div>
    </div>
  );
}
