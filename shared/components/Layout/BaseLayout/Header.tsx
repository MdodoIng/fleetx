'use client';

import { cn } from '@/shared/lib/utils';
import LocaleSwitcher from '../LocaleSwitcher';
import main_padding from '@/styles/padding';

const Header: React.FC = () => {
  return (
    <nav
      className={cn(
        'absolute top-0 py-4 w-full  wrapper flex justify-end z-10 inset-x-0',
        main_padding.x
      )}
    >
      <LocaleSwitcher />
    </nav>
  );
};

export default Header;
