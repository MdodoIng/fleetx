'use clinet';
import { environment } from '@/environments/environment';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { useOrderStore } from '@/store/useOrderStore';
import { vendorService } from './vender';
import { StoreApi, UseBoundStore } from 'zustand';
import { SharedActions, SharedState } from '@/store/sharedStore';
import { VenderActions, VenderState } from '@/store/useVenderStore';
import { ca } from 'zod/v4/locales';

export const setBranchDetails = async () => {
  const venderStore = useVenderStore.getState();
  try {
    const res = await vendorService.getBranchDetails(venderStore.vendorId!);

    console.log(res, 'afd');

    venderStore.setValue('branchDetails', res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getVendorList = async () => {
  const { selectedAccountManager, getVendorAccoutManagerId, setValue } =
    useVenderStore.getState();
  const { user } = useAuthStore.getState();
  getVendorAccoutManagerId();
  if (
    user?.roles.includes('OPERATION_MANAGER') ||
    user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user?.roles.includes('SALES_HEAD') ||
    user?.roles.includes('FINANCE_MANAGER')
  ) {
    const url = vendorService.setVendorListurl(null, null, null);

    try {
      const res = await vendorService.getVendorList(url);

      setValue('venderList', res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
};

export const setVenderDetails = async () => {
  const venderStore = useVenderStore.getState();
  try {
    const res = await vendorService.getVendorDetails(venderStore.vendorId!);

    console.log(res, 'afd2222');

    venderStore.setValue('selectedVendor', res.data);
  } catch (error) {
    console.log(error);
  }
};

export async function updateZoneAndSome() {
  const { branchDetails, branchId, selectedBranch, selectedVendor, setValue } =
    useVenderStore.getState();
  const sharedStore = useSharedStore.getState();
  await getVendorList();

  if (!branchDetails) {
    await setBranchDetails();
  }
  if (!selectedVendor) {
    await setVenderDetails();
  }

  const selectedBranchId = selectedBranch?.id || branchId;
  if (selectedBranchId && environment.LOCAL_ADDRESS_ENABLED) {
    const branch = branchDetails?.find((x) => x.id === selectedBranchId);
    if (branch) {
      sharedStore.setValue(
        'currentZoneId',
        branch.branch_zone.length > 0
          ? // @ts-ignore
            parseInt(branch.branch_zone[0].tookan_region?.region_id as any)
          : undefined
      );
      sharedStore.setValue('defaultZoneId', sharedStore.currentZoneId);
      setValue('selectedVendorName', branch.name);

      // onBranchSelectionCheckZoneBusyModeIsActive(branch.address);
    }
  }
}
