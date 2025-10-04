import { Button } from '@/shared/components/ui/button';

import {
  TypeBranch,
  TypeVendor,
  TypeVendorListItem,
} from '@/shared/types/vendor';

import { useVendorStore } from '@/store';
import React, { useEffect, useState } from 'react';
import SearchableSelect, { TypeSearchableSelectOption } from '.';
import { X } from 'lucide-react';
import VendorSelector from './VendorSelector';
import { vendorService } from '@/shared/services/vendor';

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
    if (!isSelectedVendor?.id) return;
    setIsLoading(true);
    vendorService
      .getBranchDetails(isSelectedVendor.id)
      .then((res) => {
        const options: TypeSearchableSelectOption[] =
          res.data.map((item) => ({
            id: item.id,
            name: item.name,
          })) || [];

        setOptionsForBranch(options);
      })
      .finally(() => setIsLoading(true));
  }, [isSelectedVendor?.id]);

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        // <div className="relative z-0  border border-dark-grey/10 rounded-[8px] ">
        <VendorSelector
          handleChangeVendor={handleChangeVendor}
          classNameFroInput={classNameFroInput}
          selectedVendorValue={isSelectedVendor}
          type={type}
        />
        //   <div className="absolute rounded-[8px] px-2  inset-0  w-max  text-dark-grey z-10 bg-white  flex items-center justify-strat gap-4 pointer-events-none">
        //     <Store className="size-5 opacity-50" />
        //     <span className="flex flex-col">
        //       <p className="">{isSelectedVendor?.name ?? 'Select Vendor'}</p>
        //       <small className="text-xs opacity-50">Restaurant Name</small>
        //     </span>
        //   </div>
        // </div>
      )}
      {isBranchAccess && (
        // <div className="relative z-0  border border-dark-grey/10 rounded-[8px] ">
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
        //   <div className="absolute rounded-[8px] px-2  inset-0  w-max  text-dark-grey z-10 bg-white  flex items-center justify-strat gap-4 pointer-events-none">
        //     <Icon
        //       icon="mdi:office-building-location"
        //       className="size-5 opacity-50"
        //     />

        //     <span className="flex flex-col">
        //       <p className="">{isSelectedBranch?.name ?? 'Select Branch'}</p>
        //       <small className="text-xs opacity-50">Branch Name</small>
        //     </span>
        //   </div>
        // </div>
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
