'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
  getArea,
  getBlock,
  getBuildings,
  getStreet,
} from '@/store/sharedStore';
import LandmarkInput from './LandmarkInput';

const MyMap = dynamic(() => import('@/shared/components/MyMap/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

import { makeLoc } from '@/shared/lib/helpers';
import dynamic from 'next/dynamic';
import { TypePickUpSchema } from '../../validations/order';
import SearchResults from './searchList';
import { useOrderStore } from '@/store/useOrderStore';

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
    'area' | 'block' | 'street' | 'building'
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
  const { isChangedForm } = useOrderStore();

  // const updateSelectedItems = useCallback(() => {
  //   // Early returns for performance
  //   if (!landmarkValues) return;

  //   const items: Locs[] = [];
  //   let newCurrentLevel: 'area' | 'block' | 'street' | 'building' = 'area';
  //   let newParentId: string | undefined;

  //   // Create coordinate object once
  //   const coordinates = {
  //     latitude: Number(landmarkValues.latitude) || 0,
  //     longitude: Number(landmarkValues.longitude) || 0,
  //   };

  //   // Process levels in order using a more efficient approach
  //   const levels = [
  //     {
  //       type: 'area' as const,
  //       name: landmarkValues.area,
  //       id: landmarkValues.area_id,
  //       nextLevel: 'block' as const,
  //     },
  //     {
  //       type: 'block' as const,
  //       name: landmarkValues.block,
  //       id: landmarkValues.block_id,
  //       nextLevel: 'street' as const,
  //     },
  //     {
  //       type: 'street' as const,
  //       name: landmarkValues.street,
  //       id: landmarkValues.street_id,
  //       nextLevel: 'building' as const,
  //     },
  //     {
  //       type: 'building' as const,
  //       name: landmarkValues.building,
  //       id: landmarkValues.building_id,
  //       nextLevel: 'building' as const, // Stay at building level
  //     },
  //   ];

  //   // Process each level
  //   for (const level of levels) {
  //     if (level.name && level.id) {
  //       // @ts-ignore
  //       items.push(makeLoc(level.type, level.name, level.id, coordinates));
  //       newCurrentLevel = level.nextLevel;
  //       newParentId = level.id;
  //     }
  //   }

  //   // Batch state updates to prevent multiple re-renders
  //   const updateState = () => {
  //     useOrderStore.setState({ isChangedForm: false });
  //     setSelcectItems(items);
  //     setCurrentLevel(newCurrentLevel);
  //     setParentId(newParentId);
  //   };

  //   // Use requestAnimationFrame for better performance than setTimeout
  //   if (items.length > 0) {
  //     requestAnimationFrame(updateState);
  //   } else {
  //     return null;
  //   }
  // }, [
  //   isChangedForm,
  //   setSelcectItems,
  //   setCurrentLevel,
  //   setParentId,
  //   landmarkValues?.area,
  //   landmarkValues?.area_id,
  //   landmarkValues?.block,
  //   landmarkValues?.block_id,
  //   landmarkValues?.street,
  //   landmarkValues?.street_id,
  //   landmarkValues?.building,
  //   landmarkValues?.building_id,
  //   landmarkValues?.latitude,
  //   landmarkValues?.longitude,
  // ]);

  // useMemo(() => {
  //   updateSelectedItems();
  // }, [updateSelectedItems]);

  // console.log(selctedItems, 'd');

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
        case 'building':
          if (parentId) {
            data = await getBuildings(String(parentId));
          }
          break;
      }

      if (!data?.data) {
        setSearchData([]);
        return;
      }

      const items = data.data
        .map((el: any) => ({
          ...el,
          name_en:
            currentLevel === 'block' ? `Block-${el.name_en}` : el.name_en,
          type: currentLevel,
        }))
        .filter((item: Locs) =>
          item.name_en?.toLowerCase().includes(isInputVal.toLowerCase())
        )
        .map((item: Locs) => ({
          ...item,
          value: item.id!,
          label: item.name_en!,
        }));

      setTimeout(() => {
        setSearchData(items);
      }, 50);
    } catch (err) {
      console.error('Error fetching location data:', err);
      setSearchData([]);
    } finally {
      setLoading(false);
    }
  }, [isInputVal, currentLevel, isInputBlur, parentId]);

  // console.log(selctedItems, 'afsgf    d');

  useMemo(() => {
    if (!isMap) return;

    const center = {
      lat: landmarkValues.latitude,
      lng: landmarkValues.longitude,
    };

    setMapValues(center);
  }, [landmarkValues.latitude, landmarkValues.longitude, isMap]);

  const updateFormData = (data: Locs) => {
    const key = data.loc_type as 'area' | 'block' | 'street' | 'building';

    setValue(`${key}`, data.name_en);
    setValue(`${key}_id`, data.id);
    setValue('latitude', data.latitude);
    setValue('longitude', data.longitude);

    setParentId(data.id);
    setIsInputVal('');
    setSearchData(undefined);
    // setSelcectItems((prev) => (prev ? [...prev, data] : [data]));

    if (key === 'area') setCurrentLevel('block');
    if (key === 'block') setCurrentLevel('street');
    if (key === 'street') setCurrentLevel('building');
  };

  const handleAddressClick = (selected: any) => {
    if (!selected) return;

    if (selected) {
      updateFormData(selected);
      setIsInputVal('');
      setSearchData(undefined);
    }
  };

  const handleRemoveAddress = (removed: { loc_type: string }) => {
    // setSelcectItems(selctedItems?.slice(0, index));
    if (removed.loc_type === 'area') {
      clearValues(['area', 'block', 'street', 'building']);
      setCurrentLevel('area');
    } else if (removed.loc_type === 'block') {
      clearValues(['block', 'street', 'building']);
      setParentId(landmarkValues.area_id);
      setCurrentLevel('block');
    } else if (removed.loc_type === 'street') {
      clearValues(['street', 'building']);
      setParentId(landmarkValues.block_id);
      setCurrentLevel('street');
    } else if (removed.loc_type === 'building') {
      clearValues(['street', 'building']);
      setParentId(landmarkValues.street_id);
      setCurrentLevel('building');
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
          selectedItems={selctedItems}
          setIsInputBlur={setIsInputBlur}
          setIsInputVal={setIsInputVal}
          setIsMapOpen={setIsMapOpen}
          isInputBlur={isInputBlur}
          isMapOpen={false}
          isMap={isMap}
          formLabel="Landmark"
        />
        {searchData && !isMapOpen && searchData?.length > 0 && (
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
              selectedItems={selctedItems}
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
