'use client';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { LocateFixed, PlusCircle } from 'lucide-react';
import DropOffForm from '../create/DropOffForm';
import { TypeDropOffs } from '@/shared/types/orders';
import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { TypeDropOffSchema } from '../../validations/order';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useOrderStore } from '@/store';

type Props = {
  index?: number;
  isDropIndex: number;
  item?: TypeDropOffs;

  dropOffForm: UseFormReturn<TypeDropOffSchema>;
  isCOD: 1 | 2;
  setIsCOD: Dispatch<SetStateAction<1 | 2>>;
  functionsDropOffs: (
    type: 'addOneDropOff' | 'editDropOffWithSave' | 'deleteDropOff',
    index?: any
  ) => Promise<void>;
};

const DropOffFormSection = ({
  index,
  isDropIndex,
  item,
  dropOffForm,
  isCOD,
  setIsCOD,
  functionsDropOffs,
}: Props) => {
  const isSingle = !index && !item;
  const t = useTranslations('component.features.orders.create');

  const orderStore = useOrderStore();


  return (
    <Card
      key={index}
      className="rounded-[8px] bg-white h-full border-[#2828281A] flex "
    >
      <CardHeader className="flex w-full justify-between items-center flex-wrap gap-4">
        <div className="flex  gap-2  text-dark-grey">
          <CardIcon>
            <LocateFixed className="!text-[#48B64F] " />
          </CardIcon>
          <div className="flex flex-col  items-start justify-center">
            <CardTitle>
              {t.rich('dropOffForm.title', {
                index: (chunks) => <>{chunks}</>,
                value: index! + 1 || 1,
              })}
            </CardTitle>
            <CardDescription
              hidden={isDropIndex !== index && !isSingle}
              className="text-sm font-medium opacity-50"
            >
              {t('dropOffForm.subtitle')}
            </CardDescription>
          </div>
        </div>
        {isSingle || index === isDropIndex ? (
          <Button
            variant={'ghost'}
            className="cursor-pointer text-primary-blue gap-1"
            onClick={() => functionsDropOffs('addOneDropOff')}
          >
            <PlusCircle className="" />{' '}
            {t.rich('dropOffForm.add-dropoff', {
              index: (chunks) => <>{chunks}</>,
              value: orderStore.dropOffs.length + 1,
            })}
          </Button>
        ) : (
          <div className="grid-cols-2 grid gap-3">
            <button
              onClick={() => functionsDropOffs('deleteDropOff', index!)}
              className="cursor-pointer"
            >
              <Icon
                icon={'uiw:delete'}
                className="text-dark-grey size-6 shrink-0"
              />
            </button>
            <button
              onClick={() => functionsDropOffs('editDropOffWithSave', index!)}
              className="cursor-pointer"
            >
              <Icon
                icon={'iconamoon:edit'}
                className="text-dark-grey size-6 shrink-0"
              />
            </button>
          </div>
        )}
      </CardHeader>

      {isSingle ? (
        <>
          <DropOffForm
            recipientForm={dropOffForm}
            isCOD={isCOD}
            setIsCOD={setIsCOD}
            orderIndex={orderStore.dropOffs.length + 1}
          />
        </>
      ) : (
        isDropIndex === index && (
          <DropOffForm
            recipientForm={dropOffForm}
            isCOD={isCOD}
            setIsCOD={setIsCOD}
            orderIndex={index! + 1}
          />
        )
      )}
    </Card>
  );
};

export default DropOffFormSection;
