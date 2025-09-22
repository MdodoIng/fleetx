'use client';

import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/shared/lib/utils';
import { ChevronUp, X } from 'lucide-react';

export type TypeSearchableSelectOption = {
  id: string;
  name: string;
};

type Props = ComponentProps<'div'> & {
  options: TypeSearchableSelectOption[] | undefined;
  value?: string;
  onChangeAction: (e: string | undefined) => void;
  placeholder?: string;
  classNameFroInput?: string;
};

export default function SearchableSelect({
  options,
  value,
  onChangeAction,
  placeholder = 'Select...',
  classNameFroInput,
  className,
  ...props
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options?.find((opt) => opt.id === value);

  const filtered = query
    ? options?.filter((opt) =>
        opt.name.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!filtered) return;

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        'relative sm:w-[180px]  max-sm:w-full   rounded-[8px] text-dark-grey',
        className
      )}
    >
      <Input
        value={selected?.name ?? query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          onChangeAction(undefined);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={cn('pr-10', selected && '', classNameFroInput)}
        readOnly={!!selected}
      />

      {selected && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-[80%] text-dark-grey/20 aspect-square w-auto"
          onClick={() => {
            onChangeAction(undefined);
            setQuery('');
          }}
        >
          <X />
        </Button>
      )}
      {!selected && (
        <ChevronUp
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 size-5 text-dark-grey/20',
            open ? 'rotate-180' : 'rotate-0'
          )}
        />
      )}

      {open && filtered?.length > 0 && (
        <div className="absolute z-10 mt-1 left-1/2 -translate-x-1/2 rounded-md border border-dark-grey/20 shadow bg-white p-2 w-max max-h-[300px] snap-x snap-mandatory min-w-full overflow-auto">
          {filtered?.map((opt) => (
            <div
              key={opt.id}
              onClick={() => {
                onChangeAction(opt.id);
                setQuery('');
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-muted rounded-[6px] text-sm"
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
