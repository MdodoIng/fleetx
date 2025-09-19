import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { TypeBranch, TypeVenderListItem } from '@/shared/types/vender';

import { useAuthStore, useVenderStore } from '@/store';
import React from 'react';

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

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        <Select
          onValueChange={handleChangeVender}
          defaultValue={isSelectedVendor?.id}
        >
          <SelectTrigger
            className={cn(
              'w-[180px] ',
              !isSelectedVendor && '!text-dark-grey/70'
            )}
          >
            <SelectValue placeholder="Select a Vender">
              {isSelectedVendor ? isSelectedVendor?.name : 'Select a Vender'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectLabel>Vender</SelectLabel>
              {venderList?.map((item, key) => (
                <SelectItem key={key} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {isBranchAccess && (
        <Select
          onValueChange={handleChangeBranch}
          defaultValue={isSelectedBranch?.id}
        >
          <SelectTrigger
            className={cn(
              'w-[180px] ',
              !isSelectedBranch && '!text-dark-grey/70'
            )}
          >
            <SelectValue className="" placeholder="Select a Branch">
              {isSelectedBranch ? isSelectedBranch.name : 'Select a Branch'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {branchDetails && (
              <SelectGroup>
                <SelectLabel>Branch</SelectLabel>
                {branchDetails.map((item, key) => (
                  <SelectItem key={key} value={item.id}>
                    {item.name}
                    {item.main_branch && (
                      <span className="rounded-full bg-gray-300 text-xs px-2.5 leading-0 py-2 pb-3 mr-auto">
                        main Branch
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      )}
      {handleClear && <Button onClick={() => handleClear()}>Clear</Button>}
    </div>
  );
};

export default UserAndBranchSelecter;
