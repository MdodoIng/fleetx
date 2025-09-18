'use client';
import { environment } from '@/environments/environment';
import { useAuthStore, useSharedStore, useVenderStore } from '@/store';
import { useOrderStore } from '@/store/useOrderStore';
import { vendorService } from './vender';
import { StoreApi, UseBoundStore } from 'zustand';
import { SharedActions, SharedState } from '@/store/useSharedStore';
import { VenderActions, VenderState } from '@/store/useVenderStore';
import { ca } from 'zod/v4/locales';
import { useJsApiLoader } from '@react-google-maps/api';
import { notificationService } from './notification';
import { useNotificationStore } from '@/store/useNotificationStore';
import { interval } from 'date-fns';

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
  const { selectedAccountManager, getVendorAccountManagerId, setValue } =
    useVenderStore.getState();
  const { user } = useAuthStore.getState();
  getVendorAccountManagerId();
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
  if (venderStore.vendorId) {
    try {
      const res = await vendorService.getVendorDetails(venderStore.vendorId!);

      console.log(res, 'afd2222');

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

  const { setValue: setVendorValue, branchName } = useVenderStore.getState();

  if (!user) return;

  // Trigger operational setup
  getOperationalHours();
  activateBusyMode();
  readAppConstants();
  getWarningMessage();

  if (environment.LOCAL_ADDRESS_ENABLED) {
    getFleetZonePickUpTrend();

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
      const res = await vendorService.getVendorDetails(
        user.user.vendor?.vendor_id
      );
      const branches = res?.data?.branches ?? [];

      const branch = branches.find(
        (b: any) => b.id === user.user.vendor?.branch_id
      );

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
      } else {
        setVendorValue('branchName', undefined);
        setSharedValue('currentZoneId', undefined);
        setSharedValue('defaultZoneId', undefined);

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
