import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAuthStore, useVenderStore } from '@/store';
import React, { use } from 'react';

const UserAndBranchSelecter: React.FC = () => {
  const { user } = useAuthStore();
  const {
    vendorId,
    branchDetails,
    selectedBranch,
    setValue,
    branchId,
    selectedVendor,
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

  const handleChangeBranch = (e: string) => {
    const branch = branchDetails?.find((r) => r.id === e);
    setValue('selectedBranch', branch);
    setValue('branchId', e);
  };
  const handleChangeVender = (e: string) => {
    const vender = venderList?.find((r) => r.id === e);
    setValue('selectedVendor', vender);
    setValue('vendorId', e);
  };

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2">
      {isVendorAccess && (
        <Select
          onValueChange={handleChangeVender}
          defaultValue={selectedVendor?.id}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Vender" />
          </SelectTrigger>
          <SelectContent>
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
        <Select onValueChange={handleChangeBranch} defaultValue={branchId!}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Branch</SelectLabel>
              {branchDetails?.map((item, key) => (
                <SelectItem key={key} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default UserAndBranchSelecter;
