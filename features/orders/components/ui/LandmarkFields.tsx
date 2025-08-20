'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { getArea, getBlock, getStreet } from '@/store/sharedStore';
import LandmarkInput from './LandmarkInput';

// import MyMap from '@/shared/components/MyMap/Map';

const MyMap = dynamic(() => import('@/shared/components/MyMap/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

import { makeLoc } from '@/shared/lib/helpers';
import dynamic from 'next/dynamic';
import { TypePickUpSchema } from '../../validations/order';
import SearchResults from './searchList';

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

  const landmarkValues: TypePickUpSchema = watch() || [];
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
    if (!landmarkValues.area || once.current) return;

    const items: Locs[] = [];
    let newCurrentLevel:typeof currentLevel = 'block';
    let newParentId = landmarkValues.area_id;

    if (landmarkValues.area && landmarkValues.area_id) {
      items.push(
        makeLoc('area', landmarkValues.area, landmarkValues.area_id, {
          latitude: Number(landmarkValues.latitude) || 0,
          longitude: Number(landmarkValues.longitude) || 0,
        })
      );
    }
    if (landmarkValues.block && landmarkValues.block_id) {
      items.push(
        makeLoc('block', landmarkValues.block, landmarkValues.block_id, {
          latitude: Number(landmarkValues.latitude) || 0,
          longitude: Number(landmarkValues.longitude) || 0,
        })
      );
      newCurrentLevel = 'street';
      newParentId = landmarkValues.block_id;
    }
    if (landmarkValues.street && landmarkValues.street_id) {
      items.push(
        makeLoc('street', landmarkValues.street, landmarkValues.street_id, {
          latitude: Number(landmarkValues.latitude) || 0,
          longitude: Number(landmarkValues.longitude) || 0,
        })
      );
      newCurrentLevel = 'street';
      newParentId = landmarkValues.street_id;
    }

    // Batch all state updates
    setSelcectItems(items);
    setCurrentLevel(newCurrentLevel);
    setParentId(newParentId);
    once.current = true;
  }, [landmarkValues]);

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
    if (!isMap || !selctedItems) return;

    const last = selctedItems[selctedItems.length - 1];

    const center = {
      lat: last?.latitude,
      lng: last?.longitude,
    };

    setMapValues(center);
  }, [selctedItems, isMap]);

  const updateFormData = (data: Locs) => {
    const key = data.loc_type as 'area' | 'block' | 'street';

    setValue(`${key}`, data.name_en);
    setValue(`${key}_id`, data.id);
    setValue('latitude', data.latitude);
    setValue('longitude', data.longitude);

    setParentId(data.id);
    setIsInputVal('');
    setSearchData(undefined);
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
    console.log(removed);
    setSelcectItems(selctedItems?.slice(0, index));
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
      setValue(`${key}`, '');
      // @ts-ignore
      setValue(`${key}_id`, undefined);
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

  return (
    <>
      <div className="flex flex-col gap-4 w-full col-span-2 relative">
        {/* Landmark Inputs */}
        <LandmarkInput
          control={control}
          fieldName={landmarkFieldName}
          handleAddressClick={handleAddressClick}
          handleEnter={handleEnter}
          handleRemoveAddress={handleRemoveAddress}
          isInputVal={isInputVal}
          landmarkValues={landmarkValues}
          loading={loading}
          searchData={searchData}
          selctedItems={selctedItems}
          setIsInputBlur={setIsInputBlur}
          setIsInputVal={setIsInputVal}
          setIsMapOpen={setIsMapOpen}
          isInputBlur={isInputBlur}
          isMapOpen={false}
          isMap={isMap}
          formLabel="Landmark"
        />
        {searchData && isInputBlur && !isMapOpen && searchData?.length > 0 && (
          <SearchResults
            handleAddressClick={handleAddressClick}
            loading={loading}
            searchData={searchData}
          />
        )}
      </div>

      {isMapOpen && (
        <div className="fixed w-full h-full m-auto bg-black/25 z-50 inset-0 flex items-center justify-center ">
          <div className="w-[max(400px,50%)] flex flex-col  bg-white rounded-lg relative z-0 ">
            {/* Landmark Inputs */}
            <LandmarkInput
              control={control}
              fieldName={landmarkFieldName}
              handleAddressClick={handleAddressClick}
              handleEnter={handleEnter}
              handleRemoveAddress={handleRemoveAddress}
              isInputVal={isInputVal}
              landmarkValues={landmarkValues}
              loading={loading}
              searchData={searchData}
              selctedItems={selctedItems}
              setIsInputBlur={setIsInputBlur}
              setIsInputVal={setIsInputVal}
              setIsMapOpen={setIsMapOpen}
              isInputBlur={isInputBlur}
              isMapOpen={isMapOpen}
              isMap={isMap}
            />

            {searchData && isInputBlur && searchData?.length > 0 && (
              <SearchResults
                handleAddressClick={handleAddressClick}
                loading={loading}
                searchData={searchData}
              />
            )}

            <MyMap center={mapValues} />
          </div>
        </div>
      )}
    </>
  );
}
