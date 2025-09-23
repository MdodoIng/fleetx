'use client';

import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

type BinaryValue = 1 | 2;

interface BinaryToggleProps {
  defaultValue?: BinaryValue;
  onChange?: (value: BinaryValue) => void;
  className?: string;
  classNameForThumb?: string;
}

export default function BinaryToggle({
  defaultValue = 1,
  onChange,
  className,
  classNameForThumb,
}: BinaryToggleProps) {
  const [value, setValue] = useState<BinaryValue>(defaultValue);

  const toggle = () => {
    const newValue = value === 1 ? 2 : 1;
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <button
      onClick={toggle}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-300',
        value === 2 ? 'bg-primary-blue' : 'bg-gray-300',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-0.5  h-5 w-5 rounded-full bg-white transition-all duration-300',
          value === 2 ? 'left-[calc(100%-22px)]' : 'left-0.5',
          classNameForThumb
        )}
      />
    </button>
  );
}
