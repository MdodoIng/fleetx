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
import { TypePickUpSchema } from '../../../wallet/validations/order';
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

      const generateDisplayName = (item: any): string => {
        switch (currentLevel) {
          case 'area':
            return item.name_en || item.area_name_en || `Area ${item.id}`;

          case 'block':
            return item.name_en ? `Block-${item.name_en}` : `Block ${item.id}`;

          case 'street':
            return item.name_en || item.street_name_en || `Street ${item.id}`;

          case 'building':
            const buildingName = item.building_name_en || item.name_en;
            const houseNumber = item.house_en || item.house_ar;
            const unitInfo = item.unit_no ? ` - Unit ${item.unit_no}` : '';
            const floorInfo = item.floor_no ? ` - Floor ${item.floor_no}` : '';

            if (buildingName && buildingName !== '0') {
              return `${buildingName}${unitInfo}${floorInfo}`;
            } else if (houseNumber && houseNumber !== '0') {
              return `House ${houseNumber}${unitInfo}${floorInfo}`;
            } else {
              return `Building ${item.id}${unitInfo}${floorInfo}`;
            }

          default:
            return item.name_en || `Item ${item.id}`;
        }
      };

      const matchesSearch = (
        item: any,
        displayName: string,
        searchTerm: string
      ): boolean => {
        if (!searchTerm.trim()) return true;

        const lowerSearchTerm = searchTerm.toLowerCase();
        const lowerDisplayName = displayName.toLowerCase();

        if (lowerDisplayName.includes(lowerSearchTerm)) return true;

        if (currentLevel === 'building') {
          const searchableFields = [
            item.house_en,
            item.house_ar,
            item.unit_no,
            item.floor_no,
            item.building_name_en,
            item.building_name_ar,
          ].filter(Boolean); // Remove null/undefined values

          return searchableFields.some((field) =>
            field.toString().toLowerCase().includes(lowerSearchTerm)
          );
        }

        return false;
      };

      const items = data.data
        .map((item: any) => {
          const displayName = generateDisplayName(item);
          return {
            ...item,
            name_en: displayName,
            type: currentLevel,
          };
        })
        .filter((item: any) => matchesSearch(item, item.name_en, isInputVal))
        .map((item: any) => ({
          ...item,
          value: item.id,
          label: item.name_en,
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

  useMemo(() => {
    if (!isMap) return;

    const center = {
      lat: Number(landmarkValues.latitude),
      lng: Number(landmarkValues.longitude),
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
