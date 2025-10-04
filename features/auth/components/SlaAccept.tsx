'use client';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { useAuthStore } from '@/store';

import { useTranslations } from 'next-intl';

import { toast } from 'sonner';

const SlaAccept = () => {
  const { tokenForRest, setValue, handleAcceptSla } = useAuthStore();
  const redirectToHome = useRedirectToHome();

  const t = useTranslations('auth.terms');

  const ternsData = [
    {
      title: t('sections.cod.heading'),
      items: [t('sections.cod.rule1'), t('sections.cod.rule2')],
    },
    {
      title: t('sections.waitTime.heading'),
      items: [t('sections.waitTime.rule1'), t('sections.waitTime.rule2')],
    },
  ];

  const handleClickAcceptSla = () => {
    handleAcceptSla().then(() => {
      redirectToHome();
    });
  };

  return (
    <Dialog
      open={tokenForRest}
      onOpenChange={(value) => setValue('tokenForRest', value)}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-off-white rounded-[15px] space-y-2 "
      >
        <DialogHeader className="items-baseline">
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="max-sm:text-start">
            {' '}
            {t('subtitle')}
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-4 text-sm  pl-4 font-medium text-dark-grey">
          {ternsData.map((section, index) => (
            <li key={index} className="list-decimal">
              <p className="font-medium">{section.title}</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="secondary"
              className="cursor-pointer bg-[#1D1B20]/10 text-[#1D1B20]"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => handleClickAcceptSla()}
            className="cursor-pointer"
          >
            Access My Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlaAccept;
