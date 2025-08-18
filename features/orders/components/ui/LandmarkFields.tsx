'use client';

import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UseFormReturn } from 'react-hook-form';

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
import { getArea, getBlock, getStreet } from '@/store/sharedStore';
import { MapPin } from 'lucide-react';
import { TypeLandMarkScema } from '../../validations/order';
import SearchResults from './searchList';
const MyMap = React.lazy(() => import('@/shared/components/MyMap/Map'));

interface AddressLandmarkProps {
  form: UseFormReturn<any>;
  landmarkFieldName: 'address';
  isDisabled?: boolean;
  isMap?: boolean;
}

export default function AddressLandmarkFields({
  form,
  landmarkFieldName,
  isMap = false,
}: AddressLandmarkProps) {
  const { control, watch, setValue } = form;

  const landmarkValues: TypeLandMarkScema = watch(landmarkFieldName) || [];
  const [loading, setLoading] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<
    'area' | 'block' | 'street' | 'bulding'
  >('area');
  const [parentId, setParentId] = useState<string | number | undefined>(
    undefined
  );
  const [selctedItems, setSelcectItems] = useState<Locs[]>();
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<{
    lat: number | undefined;
    lng: number | undefined;
  }>({
    lat: undefined,
    lng: undefined,
  });

  const [searchData, setSearchData] = useState<Locs[] | undefined>(undefined);
  const [isInputVal, setIsInputVal] = useState<string>('');
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);
  const once = useRef(false);

  useEffect(() => {
    if (!landmarkValues && !once.current) return;

    const items: Locs[] = [];

    if (landmarkValues.area && landmarkValues.area_id) {
      items.push({
        id: landmarkValues.area_id,
        name_ar: landmarkValues.area,
        name_en: landmarkValues.area,
        latitude: Number(landmarkValues.latitude) || 0,
        longitude: Number(landmarkValues.longitude) || 0,
        governorate_id: 0,
        loc_type: 'area',
      });
    }

    if (landmarkValues.block && landmarkValues.block_id) {
      items.push({
        id: landmarkValues.block_id,
        name_ar: landmarkValues.block,
        name_en: landmarkValues.block,
        latitude: Number(landmarkValues.latitude) || 0,
        longitude: Number(landmarkValues.longitude) || 0,
        governorate_id: 0,
        loc_type: 'block',
      });
    }

    if (landmarkValues.street && landmarkValues.street_id) {
      items.push({
        id: landmarkValues.street_id,
        name_ar: landmarkValues.street,
        name_en: landmarkValues.street,
        latitude: Number(landmarkValues.latitude) || 0,
        longitude: Number(landmarkValues.longitude) || 0,
        governorate_id: 0,
        loc_type: 'street',
      });
    }

    setSelcectItems(items);
    once.current = true;
  }, [landmarkValues, once]);

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
        .filter((item: Locs) =>
          item.name_en
            ?.toLocaleLowerCase()
            .includes(isInputVal.toLocaleLowerCase())
        )
        .map((item: Locs) => ({
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

  useMemo(() => {
    if (!isMapOpen || !selctedItems || selctedItems.length === 0) return;

    const last = selctedItems[selctedItems.length - 1];

    const center = {
      lat: last?.latitude,
      lng: last?.longitude,
    };

    setMapValues(center);
  }, [selctedItems, isMapOpen]);

  const updateFormData = (data: Locs) => {
    const key = data.loc_type as 'area' | 'block' | 'street';

    setValue(`address.${key}`, data.name_en);
    setValue(`address.${key}_id`, data.id);
    setValue('address.latitude', data.latitude);
    setValue('address.longitude', data.longitude);

    setParentId(data.id);

    setSelcectItems((prev) => (prev ? [...prev, data] : [data]));

    if (key === 'area') setCurrentLevel('block');
    if (key === 'block') setCurrentLevel('street');
  };

  const handleAddressClick = (selected: any) => {
    if (!selected) return;

    if (selected) {
      updateFormData(selected);
      setIsInputVal('');
      setSearchData(undefined);
    }
  };

  const handleRemoveAddress = (removed: Locs, index: number) => {
    setSelcectItems(selctedItems?.filter((_, key) => key < index));
    if (removed.loc_type === 'area') {
      clearValues(['area', 'block', 'street']);
      setCurrentLevel('area');
    } else if (removed.loc_type === 'block') {
      clearValues(['block', 'street']);
      setParentId(landmarkValues.area_id);
      setCurrentLevel('block');
    } else if (removed.loc_type === 'street') {
      clearValues(['street']);
      setParentId(landmarkValues.block_id);
      setCurrentLevel('street');
    }
  };

  function clearValues(keys: any[]) {
    keys.forEach((key) => {
      // @ts-ignore
      setValue(`address.${key}`, '');
      // @ts-ignore
      setValue(`address.${key}_id`, undefined);
    });
  }

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

  console.log(selctedItems);

  return (
    <>
      <div className="flex flex-col gap-4 w-full col-span-3">
        {/* Landmark Inputs */}
        <FormField
          control={control}
          name={landmarkFieldName}
          render={() => (
            <FormItem
              onBlur={() => setTimeout(() => setIsInputBlur(false), 1000)}
              // onMouseLeave={() => setTimeout(() => setIsInputBlur(false), 1000)}
              onFocus={() => setIsInputBlur(true)}
            >
              <FormLabel>Landmarks</FormLabel>
              <FormControl className="relative z-0">
                <div className={cn('flex gap-3 items-center ', classForInput)}>
                  {selctedItems &&
                    selctedItems.map((item, key) => {
                      if (!item) return null;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleRemoveAddress(item, key)}
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
                    disabled={landmarkValues.street ? true : false}
                    placeholder={`Landmark `}
                    className="outline-0 border-none bg-yellow-500 w-full flex disabled:hidden"
                    onKeyDown={(e) => handleEnter(e)}
                  />
                  {isMap && (
                    <Button
                      onClick={() => setIsMapOpen(!isMapOpen)}
                      variant="ghost"
                      className="absolute right-0 top-0 bg-white"
                    >
                      <MapPin />
                    </Button>
                  )}

                  {searchData &&
                    isInputBlur &&
                    !isMapOpen &&
                    searchData?.length > 0 && (
                      <SearchResults
                        handleAddressClick={handleAddressClick}
                        loading={loading}
                        searchData={searchData}
                      />
                    )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {isMapOpen && (
        <div className="fixed w-full h-full m-auto bg-black/25 z-50 inset-0 flex items-center justify-center">
          <div className="w-[max(400px,50%)] flex flex-col  bg-white rounded-lg relative z-0 ">
            {/* Landmark Inputs */}
            <FormField
              control={control}
              name={landmarkFieldName}
              render={() => (
                <FormItem
                  className="w-[calc(100%-20px)] mx-auto absolute top-0 z-50 bg-white"
                  onBlur={() => setTimeout(() => setIsInputBlur(false), 1000)}
                  // onMouseLeave={() => setTimeout(() => setIsInputBlur(false), 1000)}
                  onFocus={() => setIsInputBlur(true)}
                >
                  <FormControl className="relative z-0">
                    <div
                      className={cn('flex gap-3 items-center ', classForInput)}
                    >
                      {selctedItems &&
                        selctedItems.map((item, key) => {
                          if (!item) return null;

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleRemoveAddress(item, key)}
                              className="cursor-pointer text-red-500 shrink-0 flex items-center gap-1 border border-red-300 rounded-full px-2 py-1 text-sm hover:bg-red-100"
                            >
                              <span className="font-bold">×</span>{' '}
                              {item.name_en}
                            </button>
                          );
                        })}
                      <input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setIsInputVal(e.target.value);
                        }}
                        value={isInputVal}
                        disabled={landmarkValues.street ? true : false}
                        placeholder={`Landmark `}
                        className="outline-0 border-none bg-yellow-500 w-full flex disabled:hidden"
                        onKeyDown={(e) => handleEnter(e)}
                      />

                      <Button
                        onClick={() => setIsMapOpen(!isMapOpen)}
                        variant="default"
                        className="absolute right-0 top-0 "
                      >
                        submit
                      </Button>

                      {searchData && isInputBlur && searchData?.length > 0 && (
                        <SearchResults
                          handleAddressClick={handleAddressClick}
                          loading={loading}
                          searchData={searchData}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MyMap center={mapValues} />
          </div>
        </div>
      )}
    </>
  );
}
