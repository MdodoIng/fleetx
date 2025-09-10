'use client';

import { cn } from "@/shared/lib/utils";
interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps = 3,
}: ProgressBarProps) {
  return (
    <div className="flex gap-2 w-full">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'flex-1 h-1 rounded-full transition-colors duration-300',
            index <= currentStep ? 'bg-primary-blue' : 'bg-[#E5EDFE]'
          )}
        />
      ))}
    </div>
  );
}
