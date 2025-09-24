import { TypeVendorListItem } from '@/shared/types/vendor';

import { useVendorStore } from '@/store';
import React from 'react';
import SearchableSelect from '.';

type Props = {
  handleChangeVendor: (e: string) => void;
  classNameFroInput?: string;
  selectedVendorValue?: TypeVendorListItem | string;
  type?: 'header';
};

const VendorSelecter: React.FC<Props> = ({
  handleChangeVendor,
  selectedVendorValue,
  classNameFroInput = '',
  type,
}) => {
  const { selectedVendor, vendorList: vendorList, setValue } = useVendorStore();

  const isSelectedVendor =
    type == 'header'
      ? selectedVendor?.id
      : typeof selectedVendorValue === 'string'
        ? selectedVendorValue
        : selectedVendorValue?.id;

  const optionsVendor: {
    id: string;
    name: string;
  }[] =
    vendorList?.map((item) => ({
      id: item.id,
      name: item.name,
    })) || [];

  const handleClickVendor = (e: string) => {
    setValue('isSearchVendorParams', e);
  };

  return (
    <SearchableSelect
      options={optionsVendor}
      value={isSelectedVendor}
      onChangeAction={handleChangeVendor}
      placeholder={'Select Vendor'}
      className="sm:w-auto"
      onChangeValue={handleClickVendor}
      classNameFroInput={classNameFroInput}
    />
  );
};

export default VendorSelecter;
