import { Button } from '@/shared/components/ui/button';

import {
  TypeBranch,
  TypeVendor,
  TypeVendorListItem,
} from '@/shared/types/vendor';

import { vendorService } from '@/shared/services/vendor';
import { useVendorStore } from '@/store';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SearchableSelect, { TypeSearchableSelectOption } from '.';
import VendorSelector from './VendorSelector';

type Props = {
  handleChangeBranch: (e: string) => void;
  handleChangeVendor: (e: string) => void;
  classNameFroInput?: string;
  handleClear?: () => void;
  selectedVendorValue?: TypeVendorListItem | TypeVendor;
  selectedBranchValue?: TypeBranch;
  type?: 'header' | undefined;
};

const UserAndBranchSelector: React.FC<Props> = ({
  handleChangeBranch,
  handleChangeVendor,
  handleClear,
  selectedVendorValue,
  selectedBranchValue,
  classNameFroInput = '',
  type,
}) => {
  const { selectedBranch, isBranchAccess, isVendorAccess, selectedVendor } =
    useVendorStore();
  const [optionsForBranch, setOptionsForBranch] =
    useState<TypeSearchableSelectOption[]>();

  const [isLoading, setIsLoading] = useState(false);

  const isSelectedBranch = selectedBranchValue || selectedBranch;
  const isSelectedVendor = selectedVendorValue || selectedVendor;
  const isAccess = isVendorAccess || isBranchAccess;

  useEffect(() => {
    if (!isSelectedVendor?.id) {
      setOptionsForBranch(undefined);
      return;
    } else setIsLoading(true);
    setOptionsForBranch(undefined);
    vendorService.getBranchDetails(isSelectedVendor.id).then((res) => {
      const options: TypeSearchableSelectOption[] =
        res.data.map((item) => ({
          id: item.id,
          name: item.name,
        })) || [];

      setOptionsForBranch(options);
      setIsLoading(false);
    });
  }, [isSelectedVendor?.id]);

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        <VendorSelector
          handleChangeVendor={handleChangeVendor}
          classNameFroInput={classNameFroInput}
          selectedVendorValue={isSelectedVendor}
          type={type}
        />
      )}
      {isBranchAccess && (
        <SearchableSelect
          options={optionsForBranch}
          value={isSelectedBranch?.id}
          onChangeAction={handleChangeBranch}
          placeholder={'Select Branch'}
          className="sm:w-auto"
          classNameFroInput={classNameFroInput}
          loading={isLoading}
          isHideWhenNotHaveData={false}
        />
      )}
      {handleClear && (
        <Button
          variant={'link'}
          className="underline"
          onClick={() => handleClear()}
        >
          <X /> Clear Filters
        </Button>
      )}
    </div>
  );
};

export default UserAndBranchSelector;
