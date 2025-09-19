import { useOrderStore, useVenderStore } from '@/store';
import { useCallback, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useTranslations } from 'next-intl';
import { fleetService } from '@/shared/services/fleet';

interface TypeFleetDriverResponse {
  data: {
    agents: {
      fleet_id: number;
      name: string;
    }[];
  };
}

function DriverSelect() {
  const { driverId, setValue } = useOrderStore();
  const { showDriversFilter } = useVenderStore();
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

  return (
    <div className="flex items-center justify-center gap-1.5  max-sm:w-full">
      <Select
        value={String(driverId)}
        onValueChange={(value) => {
          if (value === 'null') {
            setValue('driverId', null);
          } else {
            setValue('driverId', Number(value));
          }
        }}
      >
        <SelectTrigger className="sm:w-[180px]  max-sm:w-full bg-white border-none">
          <SelectValue
            placeholder={t('component.features.orders.live.search.driver')}
          >
            {driverId !== null && driverId !== undefined
              ? (driverLists?.agents.find((item) => item.fleet_id === driverId)
                  ?.name ?? t('component.features.orders.live.search.driver'))
              : t('component.features.orders.live.search.driver')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">All Driver</SelectItem>
          {driverLists?.agents.map((item, idx) => (
            <SelectItem key={idx} value={String(item.fleet_id)}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DriverSelect;
