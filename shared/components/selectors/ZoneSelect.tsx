import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import SearchableSelect from '.';
import { orderService } from '@/shared/services/orders';
import { TypeZoneData } from '@/shared/types/orders';

type Props = {
  value?: string;
  onChangeAction: Dispatch<SetStateAction<string | undefined>>;
};

export default function ZoneSelect({ value, onChangeAction }: Props) {
  const [data, setData] = useState<TypeZoneData[]>();
  useEffect(() => {
    orderService.getZone().then((res) => {
      setData(res.data);
    });
  }, []);

  const options: {
    id: string;
    name: string;
  }[] =
    data?.map((item) => ({
      id: item.id,
      name: item.region_name,
    })) || [];

  return (
    <SearchableSelect
      options={options}
      value={value}
      classNameFroInput="border-none"
      onChangeAction={onChangeAction}
      placeholder="Search zone..."
    />
  );
}
