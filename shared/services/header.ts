'use client';

import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { vendorService } from './vendor';
import { useNotificationStore } from '@/store/useNotificationStore';

export const setBranchDetails = async () => {
  const vendorStore = useVendorStore.getState();

  try {
    const res = await vendorService.getBranchDetails(vendorStore.vendorId!);

    vendorStore.setValue('branchDetails', res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getVendorList = async () => {
  const {
    getVendorAccountManagerId,
    setValue,
    isSearchVendorParams: isSearchVendorParams,
    vendorList: vendorList,
  } = useVendorStore.getState();
  const { user } = useAuthStore.getState();

  getVendorAccountManagerId();
  if (
    user?.roles.includes('OPERATION_MANAGER') ||
    user?.roles.includes('VENDOR_ACCOUNT_MANAGER') ||
    user?.roles.includes('SALES_HEAD') ||
    user?.roles.includes('FINANCE_MANAGER')
  ) {
    const url = vendorService.setVendorListUrl(
      null,
      isSearchVendorParams,
      null
    );

    try {
      const res = await vendorService.getVendorList(url);

      const existingIds = new Set(vendorList?.map((item) => item.id) || []);
      const newVendors = res.data.filter(
        (vendor) => !existingIds.has(vendor.id)
      );
      const updatedVendorList = [...(vendorList || []), ...newVendors];

      setValue('vendorList', updatedVendorList);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
};

export const setVendorDetails = async () => {
  const vendorStore = useVendorStore.getState();
  if (vendorStore.vendorId) {
    try {
      const res = await vendorService.getVendorDetails(vendorStore.vendorId!);

      vendorStore.setValue('selectedVendor', res.data);
    } catch (error) {
      console.log(error);
    }
  }
};

export async function updateZoneAndSome() {
  const { branchDetails, branchId, selectedBranch, selectedVendor, setValue } =
    useVendorStore.getState();
  const sharedStore = useSharedStore.getState();
  await getVendorList();

  if (!branchDetails) {
    await setBranchDetails();
  }
  if (!selectedVendor) {
    await setVendorDetails();
  }

  const selectedBranchId = selectedBranch?.id || branchId;
  if (selectedBranchId && process.env.LOCAL_ADDRESS_ENABLED) {
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

  const { readAppConstants, setValue: setSharedValue } =
    useSharedStore.getState();

  const { setValue: setVendorValue, branchDetails } = useVendorStore.getState();

  if (!user) return;

  // Trigger operational setup
  getOperationalHours();
  activateBusyMode();
  readAppConstants();
  getWarningMessage();

  if (process.env.LOCAL_ADDRESS_ENABLED) {
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
    setSharedValue('showLanguage', false);
    setVendorValue('isEditDetails', true);
    setVendorValue('showDriversFilter', true);
    setVendorValue('isBranchAccess', true);
    setVendorValue('isVendorAccess', true);
    if (user.roles.includes('VENDOR_ACCOUNT_MANAGER')) {
      setVendorValue('isEditDetails', false);
    }
  }

  if (user.roles.includes('VENDOR_USER')) {
    setSharedValue('showLanguage', true);

    try {
      const branches = branchDetails ?? [];

      const branch = branches.find((b) => b.id === user.user.vendor?.branch_id);
      setVendorValue('vendorId', user.user.vendor?.vendor_id);

      if (branch) {
        setSharedValue(
          'currentZoneId',
          branch.branch_zone.length > 0
            ? parseInt(branch.branch_zone[0].tookan_region?.region_id ?? '0')
            : undefined
        );
        setSharedValue(
          'defaultZoneId',
          branch.branch_zone.length > 0
            ? parseInt(branch.branch_zone[0].tookan_region?.region_id ?? '0')
            : undefined
        );

        setVendorValue('branchName', branch.name);
        setVendorValue('selectedBranch', branch);
        setVendorValue('branchId', branch.id);
        setVendorValue('isBranchAccess', false);
      } else {
        setVendorValue('isBranchAccess', true);
        // setVendorValue('branchName', undefined);
        // setSharedValue('currentZoneId', undefined);
        // setSharedValue('defaultZoneId', undefined);
        // const mainBranch = branches.find((b: any) => b.main_branch === true);
        // if (mainBranch) {
        //   setVendorValue('branchName', mainBranch.name);
        //   setVendorValue('selectedBranch', mainBranch);
        //   setVendorValue('branchId', mainBranch.id);
        // }
      }
    } catch (err) {
      console.error('Failed to fetch vendor details:', err);
    }
  }

  return userMeta;
}
