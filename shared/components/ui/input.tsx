import { cn } from '@/shared/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { ComponentProps, useState } from 'react';

export const classForInput = [
  'file:text-foreground placeholder:text-dark-grey/50  dark:bg-input/30  flex h-12 w-full min-w-0 px-3 py-4 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-dark-grey/25 rounded-[8px] border bg-white',
  '!ring-0',
  '',
];

function Input({
  className,
  type,
  eyeBtnHide = false,
  ...props
}: ComponentProps<'input'> & { eyeBtnHide?: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password' && !eyeBtnHide;
  return (
    <>
      {' '}
      {!isPassword ? (
        <input
          type={type}
          data-slot="input"
          className={cn(classForInput, className)}
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

export { Input };
