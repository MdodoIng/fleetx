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
import userService from '@/shared/services/user';
import { User } from '@/features/orders/types/useSalesFunnel';

type Props = {
  value?: string;
  onChangeAction: Dispatch<SetStateAction<string | undefined>>;
};

export default function AccountManagerSelect({ value, onChangeAction }: Props) {
  const [managers, setManagers] = useState<User[]>();

  useEffect(() => {
    userService
      .getAccountManagerList(1, 1000, null)
      .then((res) => setManagers(res.data));
  }, []);

  console.log(managers);

  if (!managers || managers.length <= 1) return;

  const options: {
    id: string;
    name: string;
  }[] =
    managers?.map((item) => ({
      id: item.id.toString(),
      name: item.first_name,
    })) || [];

  return (
    <SearchableSelect
      options={options}
      value={value}
      classNameFroInput="border-none"
      onChangeAction={onChangeAction}
      placeholder="Select an account manager"
    />
  );
}
