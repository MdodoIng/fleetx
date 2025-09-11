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

const MyMap = dynamic(() => import('@/shared/components/InputSearch/Map'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

import dynamic from 'next/dynamic';

import { useOrderStore } from '@/store/useOrderStore';
import LandmarkInput from './LandmarkInput';
import SearchResults from './searchList';
import { TypePickUpSchema } from '@/features/orders/validations/order';
import { getArea, getBlock, getBuildings, getStreet } from '@/shared/services';

interface AddressLandmarkProps {
  form: UseFormReturn<any>;
  landmarkFieldName: string;
  isDisabled?: boolean;
  landmarkFieldPlaceholder?: string;
  isMap?: boolean;
  location?: string;
}

export default function AddressLandmarkFields({
  form,
  landmarkFieldName,
  landmarkFieldPlaceholder,
  isMap = false,
  location,
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
  const [selectedItems, setSelcectItems] = useState<Locs[]>();
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [mapValues, setMapValues] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0,
  });

  const [searchData, setSearchData] = useState<Locs[] | undefined>(undefined);
  const [isInputVal, setIsInputVal] = useState<string>('');
  const [isInputBlur, setIsInputBlur] = useState<boolean>(false);

  const formVaues = form.watch();

  useEffect(() => {
    if (watch(location ? `${location}.street` : 'street')) {
      setCurrentLevel('building');
    } else if (watch(location ? `${location}.block` : 'block')) {
      setCurrentLevel('street');
    } else if (watch(location ? `${location}.area` : 'area')) {
      setCurrentLevel('block');
    } else {
      setCurrentLevel('area');
    }
  }, [formVaues, location, watch]);

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

      setSearchData(items);
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
      lat: Number(
        location
          ? landmarkValues?.[
              location?.replace('.', '') as keyof typeof landmarkValues
            ]?.latitude
          : landmarkValues?.latitude
      ),
      lng: Number(
        location
          ? landmarkValues?.[
              location?.replace('.', '') as keyof typeof landmarkValues
            ]?.longitude
          : landmarkValues?.longitude
      ),
    };

    setMapValues(center);
  }, [landmarkValues.latitude, landmarkValues.longitude, isMap]);

  const updateFormData = (data: Locs) => {
    const key = data.loc_type as 'area' | 'block' | 'street' | 'building';

    setValue(location ? `${location}.${key}` : key, data.name_en);
    setValue(location ? `${location}.${key}_id` : `${key}_id`, data.id);
    setValue(location ? `${location}.latitude` : 'latitude', data.latitude);
    setValue(location ? `${location}.longitude` : 'longitude', data.longitude);

    setParentId(data.id);
    setIsInputVal('');
    setSearchData(undefined);
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
      setValue(location ? `${location}.${key}` : key, '');
      setValue(location ? `${location}.${key}_id` : `${key}_id`, undefined);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const containers = document.querySelectorAll('#landmark-input-container');

      let clickedInsideAny = false;

      containers.forEach((el) => {
        if (el.contains(target)) {
          clickedInsideAny = true;
        }
      });

      if (!clickedInsideAny) {
        console.log('sadaafa');
        setIsInputBlur(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        id="landmark-input-container"
        className="flex flex-col gap-4 w-full col-span-2 relative"
      >
        {/* Landmark Inputs */}
        <LandmarkInput
          control={control}
          location={location}
          fieldName={landmarkFieldName}
          fieldPlaceholder={landmarkFieldPlaceholder!}
          handleAddressClick={handleAddressClick}
          handleEnter={handleEnter}
          handleRemoveAddress={handleRemoveAddress}
          isInputVal={isInputVal}
          landmarkValues={landmarkValues}
          loading={loading}
          searchData={searchData}
          selectedItems={selectedItems}
          setIsInputBlur={setIsInputBlur}
          setIsInputVal={setIsInputVal}
          setIsMapOpen={setIsMapOpen}
          isInputBlur={isInputBlur}
          isMapOpen={false}
          isMap={isMap}
        />
        {searchData && !isMapOpen && searchData?.length > 0 && isInputBlur && (
          <SearchResults
            handleAddressClick={handleAddressClick}
            loading={loading}
            searchData={searchData}
            isMapOpen={false}
          />
        )}
      </div>

      {isMapOpen && (
        <div className="fixed w-full h-full m-auto bg-black/25 z-50 inset-0 flex items-center justify-center ">
          <div className="w-[max(400px,50%)] flex flex-col  bg-white rounded-lg relative z-0 ">
            {/* Landmark Inputs */}
            <LandmarkInput
              control={control}
              location={location}
              fieldName={landmarkFieldName}
              fieldPlaceholder={landmarkFieldPlaceholder!}
              handleAddressClick={handleAddressClick}
              handleEnter={handleEnter}
              handleRemoveAddress={handleRemoveAddress}
              isInputVal={isInputVal}
              landmarkValues={landmarkValues}
              loading={loading}
              searchData={searchData}
              selectedItems={selectedItems}
              setIsInputBlur={setIsInputBlur}
              setIsInputVal={setIsInputVal}
              setIsMapOpen={setIsMapOpen}
              isInputBlur={isInputBlur}
              isMapOpen={isMapOpen}
              isMap={isMap}
            />

            {searchData &&
              isInputBlur &&
              searchData?.length > 0 &&
              isInputBlur && (
                <SearchResults
                  handleAddressClick={handleAddressClick}
                  loading={loading}
                  searchData={searchData}
                  isMapOpen={isMapOpen}
                />
              )}

            <MyMap center={mapValues} />
          </div>
        </div>
      )}
    </>
  );
}
