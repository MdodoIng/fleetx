'use client';
import { environment } from '@/environments/environment';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { vendorService } from './vender';
import { useNotificationStore } from '@/store/useNotificationStore';

export const setBranchDetails = async () => {
  const venderStore = useVenderStore.getState();

  try {
    const res = await vendorService.getBranchDetails(venderStore.vendorId!);

    venderStore.setValue('branchDetails', res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getVendorList = async () => {
  const {
    getVendorAccountManagerId,
    setValue,
    isSearchVenderParams,
    venderList,
  } = useVenderStore.getState();
  const { user } = useAuthStore.getState();

  getVendorAccountManagerId();
  if (
    user?.roles.includes('OPERATION_MANAGER') ||
    user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user?.roles.includes('SALES_HEAD') ||
    user?.roles.includes('FINANCE_MANAGER')
  ) {
    const url = vendorService.setVendorListurl(
      null,
      isSearchVenderParams,
      null
    );

    try {
      const res = await vendorService.getVendorList(url);

      const existingIds = new Set(venderList?.map((item) => item.id) || []);
      const newVendors = res.data.filter(
        (vendor) => !existingIds.has(vendor.id)
      );
      const updatedVenderList = [...(venderList || []), ...newVendors];

      setValue('venderList', updatedVenderList);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
};

export const setVenderDetails = async () => {
  const venderStore = useVenderStore.getState();
  if (venderStore.vendorId) {
    try {
      const res = await vendorService.getVendorDetails(venderStore.vendorId!);

      venderStore.setValue('selectedVendor', res.data);
    } catch (error) {
      console.log(error);
    }
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

export async function setHeadingForVendorBranch() {
  const { user } = useAuthStore.getState();
  const {
    getOperationalHours,
    activateBusyMode,
    getOperationalHoursTimer,
    getWarningMessage,
  } = useNotificationStore.getState();

  const {
    getFleetZonePickUpTrend,
    getAllFreeBuddiesOnLoad,
    readAppConstants,
    setValue: setSharedValue,
  } = useSharedStore.getState();

  const { setValue: setVendorValue, branchDetails } = useVenderStore.getState();

  if (!user) return;

  // Trigger operational setup
  getOperationalHours();
  activateBusyMode();
  readAppConstants();
  getWarningMessage();

  if (environment.LOCAL_ADDRESS_ENABLED) {
    // getFleetZonePickUpTrend();

    // Run every 12 hours
    setInterval(
      () => {
        getOperationalHoursTimer();
      },
      12 * 60 * 60 * 1000
    );
  }

  const fullName = `${user.user.first_name} ${user.user.last_name ?? ''}`;
  const userMeta = {
    name: fullName,
    picture: '',
  };

  if (
    user.roles.includes('OPERATION_MANAGER') ||
    user.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user.roles.includes('SALES_HEAD') ||
    user.roles.includes('FINANCE_MANAGER')
  ) {
    if (environment.LOCAL_ADDRESS_ENABLED) {
      getAllFreeBuddiesOnLoad();
    }
    setSharedValue('showLanguage', false);
    setVendorValue('isEditDetails', true);
    setVendorValue('showDriversFilter', true);
    setVendorValue('isBranchAccess', true);
    setVendorValue('isVendorAccess', true);
    if (
      user.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
      user.roles.includes('SALES_HEAD')
    ) {
      setVendorValue('isEditDetails', false);
    }
  }

  if (user.roles.includes('VENDOR_USER')) {
    setSharedValue('showLanguage', true);

    try {
      const branches = branchDetails ?? [];

      const branch = branches.find((b) => b.id === user.user.vendor?.branch_id);

      if (branch) {
        setSharedValue(
          'currentZoneId',
          branch.branch_zone.length > 0
            ? parseInt(branch.branch_zone[0].tookan_region?.region_id)
            : undefined
        );
        setSharedValue(
          'defaultZoneId',
          branch.branch_zone.length > 0
            ? parseInt(branch.branch_zone[0].tookan_region?.region_id)
            : undefined
        );

        if (environment.LOCAL_ADDRESS_ENABLED) {
          getAllFreeBuddiesOnLoad();
        }

        setVendorValue('branchName', branch.name);
        setVendorValue('selectedBranch', branch);
      } else {
        setVendorValue('branchName', undefined);
        setSharedValue('currentZoneId', undefined);
        setSharedValue('defaultZoneId', undefined);
        setVendorValue('isBranchAccess', true);

        const mainBranch = branches.find((b: any) => b.main_branch === true);
        if (mainBranch) {
          setVendorValue('branchName', mainBranch.name);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vendor details:', err);
    }
  }

  return userMeta;
}
