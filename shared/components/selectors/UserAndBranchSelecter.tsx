import { Button } from '@/shared/components/ui/button';

import { TypeBranch, TypeVenderListItem } from '@/shared/types/vender';

import { useAuthStore, useVenderStore } from '@/store';
import React from 'react';
import SearchableSelect from '.';

type Props = {
  handleChangeBranch: (e: string | undefined) => void;
  handleChangeVender: (e: string | undefined) => void;

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
  const { user } = useAuthStore();
  const {
    selectedBranch,

    selectedVendor,
    branchDetails,
    venderList,
  } = useVenderStore();

  let isAccess = false;
  let isVendorAccess = false;
  let isBranchAccess = false;

  if (
    user?.roles.includes('OPERATION_MANAGER') ||
    user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user?.roles.includes('SALES_HEAD') ||
    user?.roles.includes('FINANCE_MANAGER')
  ) {
    isAccess = true;
    isVendorAccess = true;
    isBranchAccess = true;
  } else if (user?.roles.includes('VENDOR_USER')) {
    isVendorAccess = false;

    if (user.user.vendor?.branch_id) {
      isBranchAccess = false;
      isAccess = false;
    } else {
      isBranchAccess = true;
      isAccess = true;
    }
  }

  const isSelectedBranch = selectedBranchValue || selectedBranch;
  const isSelectedVendor = selectedVendorValue || selectedVendor;

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

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        <SearchableSelect
          options={optionsVender}
          value={isSelectedVendor?.id}
          onChangeAction={handleChangeVender}
          placeholder="Select a Vender"
        />
      )}
      {isBranchAccess && (
        <SearchableSelect
          options={optionsBranch}
          value={isSelectedBranch?.id}
          onChangeAction={handleChangeBranch}
          placeholder="Select a Branch"
        />
      )}
      {handleClear && <Button onClick={() => handleClear()}>Clear</Button>}
    </div>
  );
};

export default UserAndBranchSelecter;
