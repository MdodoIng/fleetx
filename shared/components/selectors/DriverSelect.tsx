import { useVendorStore } from '@/store';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useTranslations } from 'next-intl';
import { fleetService } from '@/shared/services/fleet';
import SearchableSelect from '.';

type Props = {
  value?: string;
  onChangeAction: Dispatch<SetStateAction<string | undefined>>;
};

function DriverSelect({ value, onChangeAction }: Props) {
  const { showDriversFilter } = useVendorStore();
  const t = useTranslations();

  const [driverLists, setDriverLists] = useState<
    TypeFleetDriverResponse['data'] | undefined
  >(undefined);

  const fetchDriverData = useCallback(async () => {
    if (!showDriversFilter) return;
    try {
      const driverResult = await fleetService.getDriver();
      if (driverResult.data) {
        setDriverLists(driverResult.data);
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  }, [showDriversFilter]);

  useEffect(() => {
    fetchDriverData();
  }, [fetchDriverData]);

  if (!showDriversFilter) return;

  const options: {
    id: string;
    name: string;
  }[] =
    driverLists?.agents.map((item) => ({
      id: item.fleet_id.toString(),
      name: item.name,
    })) || [];

  return (
    <SearchableSelect
      options={options}
      value={value}
      classNameFroInput="border-none"
      onChangeAction={onChangeAction}
      placeholder={t('component.features.orders.live.search.driver')}
    />
  );
}

export default DriverSelect;
