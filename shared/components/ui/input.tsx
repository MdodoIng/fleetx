import { cn } from '@/shared/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { FormControl } from './form';
import { useTranslations } from 'next-intl';

export const classForInput = [
  'placeholder:text-dark-grey/50  dark:bg-input/30 h-12  flex  w-full min-w-0 px-3 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex  file:border-0 file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-dark-grey/20 rounded-[8px] border bg-white file:mr-4 file:py-2 file:px-4 file:rounded  file:text-sm file:font-semibold file:bg-primary-blue/20 file:text-primary-blue hover:file:bg-blue-100',
  '!ring-0',
];

function Input({
  className,
  type,
  eyeBtnHide = false,
  ...props
}: ComponentProps<'input'> & { eyeBtnHide?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password' && !eyeBtnHide;
  const isFile = type === 'file';
  return (
    <>
      {' '}
      {!isPassword ? (
        <input
          type={type}
          data-slot="input"
          className={cn(classForInput, className, isFile && 'h-auto')}
          {...props}
        />
      ) : (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            data-slot="input"
            className={cn(classForInput, className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-grey"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      )}
    </>
  );
}

function InputPhone({
  className,
  ...props
}: ComponentProps<'input'> & { eyeBtnHide?: boolean }) {
  const t = useTranslations();
  return (
    <>
      <div className={cn('grid grid-cols-[80px_1fr] gap-2 w-full ', className)}>
        <Input
          disabled
          defaultValue={t(
            'component.features.orders.create.form.phone.placeholder1'
          )}
          placeholder={t(
            'component.features.orders.create.form.phone.placeholder1'
          )}
          className=""
        />
        <Input
          placeholder={t(
            'component.features.orders.create.form.phone.placeholder2'
          )}
          {...props}
          className="w-full"
        />
      </div>
    </>
  );
}

export { Input, InputPhone };
