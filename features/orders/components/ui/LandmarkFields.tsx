'use client';

import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { classForInput } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { getArea, getBlock, getStreet } from '@/store/sharedStore';
import { TypeLandMarkScema, TypePickUpSchema } from '../../validations/order';

interface AddressLandmarkProps {
  form: UseFormReturn<any>;
  landmarkFieldName: 'landmark';
  isDisabled?: boolean;
}

export default function AddressLandmarkFields({
  form,
  landmarkFieldName,
}: AddressLandmarkProps) {
  const { control, watch } = form;
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: landmarkFieldName,
  });

  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'area' | 'block' | 'street'>(
    'area'
  );
  const [parentId, setParentId] = useState<string | number | undefined>(
    undefined
  );
  type TypeSearchData = NonNullable<TypePickUpSchema['landmark']>[number] & {
    value: string;
    label: string;
    type: typeof currentLevel;
  };
  const [searchData, setSearchData] = useState<TypeSearchData[] | undefined>(
    undefined
  );
  const [isInputVal, setIsInputVal] = useState<string>('');
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const landmarkValues: TypeLandMarkScema = watch(landmarkFieldName) || [];

  useMemo(async () => {
    if (!isInputBlur) return;

    try {
      setLoading(true);
      let data: any = null;
      switch (currentLevel) {
        case 'area':
          data = await getArea();
          break;
        case 'block':
          if (parentId) {
            data = await getBlock(String(parentId));
          }
          break;
        case 'street':
          if (parentId) {
            data = await getStreet(String(parentId));
          }
          break;
      }

      if (!data) return [];
      const items = data.data
        .map((el: any) => ({
          ...el,
          name_en:
            currentLevel === 'block' ? `Block-${el.name_en}` : el.name_en,
          type: currentLevel,
        }))
        .filter((item: TypeSearchData) =>
          item.name_en
            ?.toLocaleLowerCase()
            .includes(isInputVal.toLocaleLowerCase())
        )
        .map((item: TypeSearchData) => ({
          ...item,
          value: item.id!,
          label: item.name_en!,
        }));

      setSearchData(items);

      return items;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isInputVal, currentLevel, isInputBlur]);

  const updateFormData = (data: TypeSearchData) => {
    switch (data.type) {
      case 'area':
        setCurrentLevel('block');
        update(0, data);
        append({});
        setParentId(data.id);
        break;
      case 'block':
        setCurrentLevel('street');
        update(1, data);
        append({});
        setParentId(data.id);
        break;
      case 'street':
        update(2, data);
        break;
      default:
        break;
    }
  };

  const handleAddressClick = (selected: any) => {
    if (!selected) return;

    if (selected) {
      updateFormData(selected);
      setIsInputVal('');
      setSearchData(undefined);
    }
  };

  const handleRemoveAddress = (removedItem: TypeSearchData, index: number) => {
    remove([...Array(fields.length - index).keys()].map((_, i) => index + i));

    if (removedItem.type === 'area') {
      setCurrentLevel('area');
      setParentId(undefined);
    } else if (removedItem.type === 'block') {
      setCurrentLevel('block');
      setParentId(removedItem.area_id || undefined);
    } else if (removedItem.type === 'street') {
      setCurrentLevel('street');
      setParentId(removedItem.block_id || undefined);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const isDataSame = searchData && searchData?.length > 0;
      const thatData =
        isDataSame &&
        searchData?.find(
          (item) =>
            item.name_en?.toLocaleLowerCase() === isInputVal.toLocaleLowerCase()
        );

      if (thatData) {
        updateFormData(thatData);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full col-span-3">
      {/* Landmark Inputs */}
      <FormField
        control={control}
        name={landmarkFieldName}
        render={() => (
          <FormItem
            onBlur={() => setTimeout(() => setIsInputBlur(false), 1000)}
            onFocus={() => setIsInputBlur(true)}
          >
            <FormLabel>Landmarks</FormLabel>
            <FormControl className="relative z-0">
              <div className={cn('flex gap-3 items-center ', classForInput)}>
                {typeof landmarkValues !== 'undefined' &&
                  landmarkValues.map((item, index) => (
                    <button
                      hidden={!item?.name_en}
                      key={index}
                      type="button"
                      onClick={() =>
                        handleRemoveAddress(item as TypeSearchData, index)
                      }
                      className="cursor-pointer text-red-500 shrink-0"
                    >
                      X, {item.name_en}
                    </button>
                  ))}
                <input
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setIsInputVal(e.target.value);
                  }}
                  value={isInputVal}
                  disabled={
                    typeof landmarkValues !== 'undefined' &&
                    landmarkValues.length === 3
                      ? landmarkValues[2].name_en
                        ? true
                        : false
                      : false
                  }
                  placeholder={`Landmark `}
                  className="outline-0 border-none bg-yellow-500 w-full flex disabled:hidden"
                  onKeyDown={(e) => handleEnter(e)}
                />

                {searchData && isInputBlur && searchData?.length > 0 && (
                  <div className="mt-2 grid px-10 py-4 gap-2 absolute w-full bg-yellow-300 top-full left-0 ">
                    {' '}
                    {loading ? (
                      '...'
                    ) : (
                      <>
                        {searchData.map((item) => (
                          <span
                            key={item.id}
                            className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                            onClick={() => handleAddressClick(item)}
                          >
                            {item.name_en}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
