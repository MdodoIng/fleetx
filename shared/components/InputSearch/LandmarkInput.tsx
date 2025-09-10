'use client';
import { Button } from '../ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { classForInput } from '../ui/input';
import { cn } from '@/shared/lib/utils';
import { Icon } from '@iconify/react/dist/iconify.js';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEvent } from 'react';
import { Control } from 'react-hook-form';



const LandmarkInput = ({
  control,
  fieldName,
  landmarkValues,
  searchData,
  loading,
  isInputVal,
  isInputBlur,
  isMapOpen,
  isMap,
  handleEnter,
  handleAddressClick,
  handleRemoveAddress,
  setIsMapOpen,
  setIsInputBlur,
  setIsInputVal,
  fieldPlaceholder,

  selectedItems,
  location,
}: {
  control: Control<any, any, any>;
  fieldName: string;
  fieldPlaceholder: string;
  setIsInputBlur: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: Locs[] | undefined;
  handleRemoveAddress: (removed: any) => void;
  setIsInputVal: React.Dispatch<React.SetStateAction<string>>;
  isInputVal: string;
  landmarkValues: any;
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchData: Locs[] | undefined;
  loading: boolean;
  handleAddressClick: (selected: any) => void;
  isInputBlur: boolean;
  isMapOpen: boolean;
  isMap: boolean;

  location?: string;
}) => {
  const selectedItem = [
    {
      name_en: location
        ? landmarkValues?.[location as keyof typeof landmarkValues]?.area
        : landmarkValues?.area,
      loc_type: 'area',
    },
    {
      name_en: location
        ? landmarkValues?.[location as keyof typeof landmarkValues]?.block
        : landmarkValues?.block,
      loc_type: 'block',
    },
    {
      name_en: location
        ? landmarkValues?.[location as keyof typeof landmarkValues]?.street
        : landmarkValues?.street,
      loc_type: 'street',
    },
    {
      name_en:
        landmarkValues && location
          ? landmarkValues?.[
            location?.replace('.', '') as keyof typeof landmarkValues
          ]?.building
          : landmarkValues?.building,
      loc_type: 'building',
    },
  ];

  const t = useTranslations('component.common.inputSearch');
  const placeholderInput = t(
    landmarkValues.building
      ? 'empty'
      : landmarkValues.street
        ? 'empty'
        : landmarkValues.block
          ? 'placeholderBlock'
          : landmarkValues.area
            ? 'placeholderArea'
            : 'placeholder'
  );

  return (
    <FormItem
      id="landmark-input-container"
      className={
        isMapOpen
          ? 'w-[calc(100%-20px)] mx-auto absolute top-0 z-50 bg-white'
          : ''
      }
      onFocus={() => setIsInputBlur(true)}
      onClick={() => setIsInputBlur(true)}
    >
      {!isMapOpen && <FormLabel>{fieldName || t('label')}</FormLabel>}
      <FormControl className="relative z-0">
        <div className={cn('flex gap-3 items-center ', classForInput)}>
          {selectedItem.map((item, key) => {
            if (!item.name_en) return null;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRemoveAddress(item)}
                className="cursor-pointer text-dark-grey shrink-0 flex items-center gap-1 border border-[#9D9E9E] rounded-full pl-3 pr-1 py-1 text-sm  bg-off-white group hover:border-red-400 duration-100"
              >
                {item.name_en}
                <Icon
                  icon="carbon:close-outline"
                  className="size-4 group-hover:text-red-400 duration-100"
                />
              </button>
            );
          })}
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIsInputVal(e.target.value);
            }}
            value={isInputVal}
            disabled={landmarkValues.building ? true : false}
            placeholder={fieldPlaceholder || placeholderInput}
            className="outline-0 border-none  w-full flex disabled:hidden"
            onKeyDown={(e) => handleEnter(e)}
          />

          {isMap && (
            <Button
              onClick={() => setIsMapOpen(!isMapOpen)}
              variant={isMapOpen ? 'default' : 'ghost'}
              className="absolute right-0 top-0 "
            >
              {isMapOpen ? 'submit' : <MapPin />}
            </Button>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default LandmarkInput;
