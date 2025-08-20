'use clinet';
import { Button } from '@/shared/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { classForInput } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';
import { MapPin } from 'lucide-react';
import { ChangeEvent } from 'react';
import { Control } from 'react-hook-form';
import SearchResults from './searchList';
import { TypePickUpSchema } from '../../validations/order';

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
  formLabel,
  selectedItems,
}: {
  control: Control<any, any, any>;
  fieldName: 'address';
  setIsInputBlur: React.Dispatch<React.SetStateAction<boolean>>;
  selectedItems: Locs[] | undefined;
  handleRemoveAddress: (removed: any) => void;
  setIsInputVal: React.Dispatch<React.SetStateAction<string>>;
  isInputVal: string;
  landmarkValues: TypePickUpSchema;
  handleEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setIsMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchData: Locs[] | undefined;
  loading: boolean;
  handleAddressClick: (selected: any) => void;
  isInputBlur: boolean;
  isMapOpen: boolean;
  isMap: boolean;
  formLabel?: string;
}) => {
  const selectedItem = [
    {
      name_en: landmarkValues?.area!,
      loc_type: 'area',
    },
    {
      name_en: landmarkValues?.block!,
      loc_type: 'block',
    },
    {
      name_en: landmarkValues?.street!,
      loc_type: 'street',
    },
    {
      name_en: landmarkValues?.building!,
      loc_type: 'building',
    },
  ];

  return (
    <FormItem
      className={
        isMapOpen
          ? 'w-[calc(100%-20px)] mx-auto absolute top-0 z-50 bg-white'
          : ''
      }
      onBlur={() => setTimeout(() => setIsInputBlur(false), 1000)}
      // onMouseLeave={() => setTimeout(() => setIsInputBlur(false), 1000)}
      onFocus={() => setIsInputBlur(true)}
    >
      {!isMapOpen && <FormLabel>{formLabel}</FormLabel>}
      <FormControl className="relative z-0">
        <div className={cn('flex gap-3 items-center ', classForInput)}>
          {selectedItem.map((item, key) => {
            if (!item.name_en) return null;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleRemoveAddress(item)}
                className="cursor-pointer text-red-500 shrink-0 flex items-center gap-1 border border-red-300 rounded-full px-2 py-1 text-sm hover:bg-red-100"
              >
                <span className="font-bold">×</span> {item.name_en}
              </button>
            );
          })}
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIsInputVal(e.target.value);
            }}
            value={isInputVal}
            disabled={landmarkValues.building ? true : false}
            placeholder={`Landmark`}
            className="outline-0 border-none bg-yellow-500 w-full flex disabled:hidden"
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
