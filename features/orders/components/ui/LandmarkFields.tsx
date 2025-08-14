'use client';

import {
  useState,
  useEffect,
  ChangeEvent,
  Fragment,
  useRef,
  useMemo,
} from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
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
import { TypePickUpSchema } from '../../validations/order';

type AddressItem = {
  id: string | number;
  name_en: string;
  latitude?: number;
  longitude?: number;
  type: 'area' | 'block' | 'street';
  area_id?: string | number;
  block_id?: string | number;
};

interface AddressLandmarkProps {
  form: UseFormReturn<TypePickUpSchema>;
  addressFieldName: string; // e.g., "address"
  landmarkFieldName: 'landmark'; // e.g., "landmark"
  isDisabled?: boolean;
}

export default function AddressLandmarkFields({
  form,
  addressFieldName,
  landmarkFieldName,
  isDisabled = false,
}: AddressLandmarkProps) {
  const { control, register, watch, getValues } = form;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Address state
  const [selectedItems, setSelectedItems] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'area' | 'block' | 'street'>(
    'area'
  );
  const [parentId, setParentId] = useState<string | number | null>(null);
  const [searchData, setSearchData] = useState<TypePickUpSchema['landmark']>(
    []
  );
  const [isInputVals, setIsInputVals] = useState<TypePickUpSchema['landmark']>([
    {
      name_ar: '',
      name_en: '',
      id: undefined,
      latitude: undefined,
      longitude: undefined,
      governorate_id: undefined,
      loc_type: '',
      nhood_id: undefined,
      block_id: undefined,
      area_id: undefined,
    },
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: landmarkFieldName,
  });

  const [widths, setWidths] = useState<string[]>(fields.map(() => 'min-width'));

  const updateWidth = (index: number, value: string) => {
    const chWidth = Math.max(value.length + 1, 2) + 'ch';
    setWidths((prev) => {
      const copy = [...prev];
      copy[index] = chWidth;
      return copy;
    });
  };

  useEffect(() => {
    if (fields.length === 0) append({});
  }, [fields, append]);

  const landmarkValues = watch(landmarkFieldName) || [];
  // useEffect(() => {
  //   const lastValue = landmarkValues[landmarkValues.length - 1];
  //   if (lastValue?.name_en?.trim() && fields.length === landmarkValues.length) {
  //     append({});
  //   }
  // }, [landmarkValues, fields.length, append]);

  useMemo(async () => {
    if (!landmarkValues) return;

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
        .filter((item: AddressItem) =>
          landmarkValues && landmarkValues.length > 0
            ? item.name_en
                .toLocaleLowerCase()
                .includes(
                  landmarkValues[
                    landmarkValues.length - 1
                  ]?.name_en?.toLocaleLowerCase() || ''
                )
            : true
        )
        .map((item: AddressItem) => ({
          value: item.id,
          label: item.name_en,
          ...item,
        }));

      setSearchData(items);
      setLoading(false);
      return items;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [landmarkValues]);

  const handleAddressClick = (selected: any) => {
    if (!selected) return;

    append(selected);
    setIsInputVals((prev) => {
      const newVals = [...prev!, selected];

      return newVals;
    });

    if (selected.type === 'area') {
      setCurrentLevel('block');
      setParentId(selected.id);
    } else if (selected.type === 'block') {
      setCurrentLevel('street');
      setParentId(selected.id);
    }
    setSearchData(undefined);
  };

  const handleRemoveAddress = (removedItem: AddressItem) => {
    const index = selectedItems.findIndex((i) => i.id === removedItem.id);
    if (index !== -1) {
      const newSelection = selectedItems.slice(0, index);
      setSelectedItems(newSelection);

      if (removedItem.type === 'area') {
        setCurrentLevel('area');
        setParentId(null);
      } else if (removedItem.type === 'block') {
        setCurrentLevel('block');
        setParentId(removedItem.area_id || null);
      } else if (removedItem.type === 'street') {
        setCurrentLevel('street');
        setParentId(removedItem.block_id || null);
      }
    }
  };

  const handleEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputs =
        containerRef.current?.querySelectorAll<HTMLInputElement>('input');
      const isDataSame =
        searchData &&
        searchData?.length > 0 &&
        searchData[0].name_en?.toLocaleLowerCase() ===
          isInputVals?.[index].name_en;
      let thatData =
        isDataSame &&
        searchData?.reduce(
          (item) =>
            item.name_en?.toLocaleLowerCase() === isInputVal.toLocaleLowerCase()
        );

      if (!inputs) return;

      if (index === fields.length - 1 && thatData) {
        append(thatData);
        setTimeout(() => {
          const newInputs =
            containerRef.current?.querySelectorAll<HTMLInputElement>('input');
          newInputs?.[newInputs.length - 1]?.focus();
        }, 0);
        setSearchData(undefined);
        thatData = undefined;
      } else {
        inputs[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full col-span-3">
      {/* Address Step Selector */}
      {/*<div>
        <AsyncSelect
          isDisabled={isDisabled}
          isMulti={false}
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          isLoading={loading}
          placeholder={`Select ${currentLevel}...`}
          onChange={handleAddressClick}
        />

        {selectedItems.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                onClick={() => handleRemoveAddress(item)}
              >
                {item.name_en} ✕
              </span>
            ))}
          </div>
        )}
      </div>*/}

      {/* Landmark Inputs */}
      <FormField
        control={control}
        name={landmarkFieldName}
        render={() => (
          <FormItem>
            <FormLabel>Landmarks</FormLabel>
            <FormControl className="relative z-0">
              <div
                ref={containerRef}
                className={cn('flex gap-3 flex-wrap', classForInput)}
              >
                {fields.map((item, index) => (
                  <Fragment key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        remove(
                          [...Array(fields.length - index)].map(
                            (_, i) => index + i
                          )
                        )
                      }
                      className="cursor-pointer text-red-500"
                    >
                      X
                    </button>

                    <input
                      {...register(`${landmarkFieldName}.${index}.name_en`, {
                        onChange: (e: ChangeEvent<HTMLInputElement>) =>
                          updateWidth(index, e.target.value),
                      })}
                      placeholder={`Landmark ${index + 1}`}
                      style={{ width: widths[index] }}
                      className="outline-0 border-none bg-transparent"
                      onKeyDown={(e) => handleEnter(e, index)}
                    />

                    <span className="last:hidden">,</span>
                  </Fragment>
                ))}

                {searchData && searchData?.length > 0 && (
                  <div className=" grid px-10 py-4  gap-2 absolute w-full bg-yellow-300 top-full left-0 ">
                    {searchData.map((item) => (
                      <span
                        key={item.id}
                        className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                        onClick={() => handleAddressClick(item)}
                      >
                        {item.name_en} ✕
                      </span>
                    ))}
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
