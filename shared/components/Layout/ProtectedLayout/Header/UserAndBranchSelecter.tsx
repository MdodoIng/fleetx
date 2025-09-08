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
import {
  TypeBranch,
  TypeVender,
  TypeVenderListItem,
} from '@/shared/types/vender';
import { useAuthStore, useVenderStore } from '@/store';
import React, { use } from 'react';

type Props = {
  handleChangeBranch: (e: string) => void;
  handleChangeVender: (e: string) => void;
  branchs: TypeBranch[] | undefined;
  handleClear?: () => void;
  selectedVendorValue?: TypeVenderListItem;
  selectedBranchValue?: TypeBranch;
};

const UserAndBranchSelecter: React.FC<Props> = ({
  handleChangeBranch,
  handleChangeVender,
  branchs,
  handleClear,
  selectedVendorValue,
  selectedBranchValue,
}) => {
  const { user } = useAuthStore();
  const {
    vendorId,
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

  return (
    <div hidden={!isAccess} className="flex items-center justify-center gap-2 ">
      {isVendorAccess && (
        <Select
          onValueChange={handleChangeVender}
          defaultValue={selectedVendorValue?.id ?? selectedVendor?.id}
        >
          <SelectTrigger className="w-[180px] ">
            <SelectValue placeholder="Select a Vender" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {/*<SelectItem value={' '}>All Vender</SelectItem>*/}
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
          defaultValue={selectedBranchValue?.id ?? selectedBranch?.id}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Branch" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              {branchs && (
                <>
                  {/*<SelectItem value={'null'}>All Branchs</SelectItem>*/}

                  <SelectLabel>Branch</SelectLabel>
                  {branchs?.map((item, key) => (
                    <SelectItem key={key} value={item.id}>
                      {item.name}{' '}
                      {item.main_branch && (
                        <span className="rounded-full bg-gray-300 text-xs px-2.5 leading-0 py-2 pb-3 mr-auto">
                          main Barnch
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      {handleClear && <Button onClick={() => handleClear()}>Clear</Button>}
    </div>
  );
};

export default UserAndBranchSelecter;
