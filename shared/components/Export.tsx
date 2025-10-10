import { Download } from 'lucide-react';
import { Button } from './ui/button';
import tableExport, { TableExportProps } from '../lib/hooks/tableExport';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { User, ChevronDown, User as PasswordIcon } from 'lucide-react';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';
import { Icon } from '@iconify/react';
import { Separator } from './ui/separator';
import { routes } from '../constants/routes';
import { useAuthStore } from '@/store';

export default function Export({ data, exclude, title }: TableExportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const { user } = useAuthStore();

  const hideInvoice = user?.roles.some((role) =>
    routes.BILLING_INVOICE.roles?.includes(role)
  );

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'ring-0 focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
          isOpen && 'lg:!bg-primary-blue lg:!text-off-white !bg-off-white/10'
        )}
      >
        <Button className={cn()}>
          <Download className="w-5 h-5" />{' '}
          {t('component.common.export.default')}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white rounded-t-none">
        <DropdownMenuItem
          onClick={() =>
            tableExport({
              data,
              title,
              exclude,
              type: 'xlsx',
            })
          }
          className="flex items-center gap-2 px-2 py-3 cursor-pointer rtl:justify-end"
        >
          <Icon
            icon="hugeicons:xls-01"
            className="text-dark-grey rtl:order-2"
          />
          {t('component.common.export.excel')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            tableExport({
              data,
              title,
              exclude,
              type: 'csv',
            })
          }
          className="flex items-center gap-2 px-2 py-3 cursor-pointer rtl:justify-end"
        >
          <Icon
            icon="hugeicons:csv-02"
            className="text-dark-grey rtl:order-2"
          />
          {t('component.common.export.csv')}
        </DropdownMenuItem>
        <Separator hidden={!hideInvoice} />
        <DropdownMenuItem
          asChild
          hidden={!hideInvoice}
          className="flex items-center gap-2 px-2 py-3 cursor-pointer rtl:justify-end"
        >
          <Link href={routes.BILLING_INVOICE.path}>
            <Icon
              icon="hugeicons:pdf-02"
              className="text-dark-grey rtl:order-2"
            />
            {t('component.common.export.invoice')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
