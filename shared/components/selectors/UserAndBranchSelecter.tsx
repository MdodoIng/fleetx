import { Button } from '@/shared/components/ui/button';

import { TypeBranch, TypeVenderListItem } from '@/shared/types/vender';

import { useAuthStore, useVenderStore } from '@/store';
import React from 'react';
import SearchableSelect from '.';
import { Store, X } from 'lucide-react';
import { Icon } from '@iconify/react';

type Props = {
  handleChangeBranch: (e: string) => void;
  handleChangeVender: (e: string) => void;

  handleClear?: () => void;
  selectedVendorValue?: TypeVenderListItem;
  selectedBranchValue?: TypeBranch;
};

const UserAndBranchSelecter: React.FC<Props> = ({
  handleChangeBranch,
  handleChangeVender,
  handleClear,
  selectedVendorValue,
  selectedBranchValue,
}) => {
  const {
    selectedBranch,
    isBranchAccess,
    isVendorAccess,
    selectedVendor,
    branchDetails,
    venderList,
    setValue,
  } = useVenderStore();

  const isSelectedBranch = selectedBranchValue || selectedBranch;
  const isSelectedVendor = selectedVendorValue || selectedVendor;
  const isAccess = isVendorAccess || isBranchAccess;

  const optionsVender: {
    id: string;
    name: string;
  }[] =
    venderList?.map((item) => ({
      id: item.id,
      name: item.name,
    })) || [];

  const optionsBranch: {
    id: string;
    name: string;
  }[] =
    branchDetails?.map((item) => ({
      id: item.id,
      name: item.name,
    })) || [];

  const handleClickVender = (e: string) => {
    setValue('isSearchVenderParams', e);
  };

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        // <div className="relative z-0  border border-dark-grey/20 rounded-[8px] ">
        <SearchableSelect
          options={optionsVender}
          value={isSelectedVendor?.id}
          onChangeAction={handleChangeVender}
          placeholder={'Select Vendor'}
          className="sm:w-auto"
          onChangeValue={handleClickVender}
          // classNameFroInput="border-none"
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
        // <div className="relative z-0  border border-dark-grey/20 rounded-[8px] ">
        <SearchableSelect
          options={optionsBranch}
          value={isSelectedBranch?.id}
          onChangeAction={handleChangeBranch}
          placeholder={'Select Branch'}
          className="sm:w-auto"
          // classNameFroInput="border-none"
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

export default UserAndBranchSelecter;
