import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { classForInput } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

export function LandmarkFields({ name, form }: { name: string; form: any }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { register, control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const inputs =
    containerRef.current?.querySelectorAll<HTMLInputElement>('input');

  const [widths, setWidths] = useState<string[]>(fields.map(() => 'min-width'));

  const updateWidth = (index: number, value: string) => {
    
    const chWidth = Math.max(value.length + 1, 2) + 'ch';
    setWidths((prev) => {
      const copy = [...prev];
      copy[index] = chWidth;
      return copy;
    });
  };

  const landmarkValues = watch('landmark');
  useEffect(() => {
    if (fields.length === 0) {
      append(''); // always show one input
    }
  }, [fields, append]);
  useEffect(() => {
    if (landmarkValues && landmarkValues.length > 0) {
      const lastValue = landmarkValues[landmarkValues.length - 1];
      if (lastValue?.trim() && fields.length === landmarkValues.length) {
        append('');
      }
    }
  }, [landmarkValues, fields.length, append]);

  return (
    <FormField
      control={control}
      name="landmark"
      render={() => (
        <FormItem className="col-span-1 md:col-span-2 lg:col-span-3">
          <FormLabel>Address</FormLabel>
          <FormControl>
            <div className={cn('flex gap-3', classForInput)} ref={containerRef}>
              {fields.map((item, index) => (
                <Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const removeCount = fields.length - index;
                      remove([...Array(removeCount)].map((_, i) => index + i));
                    }}
                    className="cursor-pointer"
                  >
                    X
                  </button>

                  <input
                    {...register(`${name}.${index}`, {
                      onChange: (e: ChangeEvent<HTMLInputElement>) =>
                        updateWidth(index, e.target.value),
                    })}
                    placeholder={`Landmark ${index + 1}`}
                    style={{ width: widths[index] }}
                    className="outline-0 border-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();

                        if (!inputs) return;

                        if (index === fields.length - 1) {
                          append('');
                          setTimeout(() => {
                            const newInputs =
                              containerRef.current?.querySelectorAll<HTMLInputElement>(
                                'input'
                              );
                            newInputs?.[newInputs.length - 1]?.focus();
                          }, 0);
                        } else {
                          inputs[index + 1]?.focus();
                        }
                      }
                    }}
                  />

                  <span className="last:hidden">,</span>
                </Fragment>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
