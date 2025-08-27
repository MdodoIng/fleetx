'use clinet';
import { environment } from '@/environments/environment';
import { useSharedStore, useVenderStore } from '@/store';
import { useOrderStore } from '@/store/useOrderStore';
import { VendorService } from './vender';
import { StoreApi, UseBoundStore } from 'zustand';
import { SharedActions, SharedState } from '@/store/sharedStore';
import { VenderActions, VenderState } from '@/store/useVenderStore';

const setBranchDetails = async (
  branchId: any,
  venderStore: VenderState & VenderActions
) => {
  try {
    const res = await VendorService.getBranchDetails(branchId!);

    venderStore.setValue('branchDetails', res.data);
  } catch (error) {
    console.log(error);
  }
};

export async function updateZoneAndSome({
  sharedStore,
  venderStore,
}: {
  sharedStore: SharedState & SharedActions;
  venderStore: VenderState & VenderActions;
}) {
  const { branchDetails, branchId, selectedBranch, setValue } = venderStore;

  if (!branchDetails) {
    await setBranchDetails(branchId, venderStore);
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
      venderStore.setValue('selectedVendorName', branch.name);

      // onBranchSelectionCheckZoneBusyModeIsActive(branch.address);
    }
  }
}
