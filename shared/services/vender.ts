import { useVenderStore } from '@/store';
import { storageKeys } from '../lib/storageKeys';
import { apiFetch } from '../lib/utils';
import {
  RootTypeBranch,
  RootTypeBranchByBranchId,
  TypeBranch,
  TypeVender,
  TypeVenderList,
  TypeVenderListRes,
  TypeWalletResponce,
} from '../types/vender';
import { configService } from './app-config';

export const vendorService = {
  create: (vendor: any) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/create`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    }),

  update: (vendor: any) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/update/${vendor.id}`, {
      method: 'PUT',
      body: JSON.stringify(vendor),
    }),

  getVendorDetails: (id: string): Promise<TypeVender> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/details?id=${id}`),

  getVendorInfo: (id: string): Promise<{ data: TypeBranch['vendor'] }> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/vendor-info/${id}`),

  setVendorListurl: (
    perPage: number | null,
    searchVendor?: string | null,
    NEXT_SET_ITEMS_TOKEN?: string[] | null
  ) => {
    const { getVendorAccoutManagerId, selectedAccountManager } =
      useVenderStore.getState();
    getVendorAccoutManagerId();
    let url = '/vendors-list?';
    url = perPage ? url + 'page_size=' + perPage : url;
    url = searchVendor ? url + '&search=' + searchVendor : url;
    NEXT_SET_ITEMS_TOKEN?.forEach((element) => {
      url = url + '&NEXT_SET_ITEMS_TOKEN=' + element;
    });
    if (selectedAccountManager) {
      url = url + '&account_manager=' + selectedAccountManager;
    }
    return url;
  },

  getVendorList: (url: string): Promise<TypeVenderListRes> =>
    apiFetch(`${configService.vendorServiceApiUrl()}${url}`),

  getBranchDetails: (id: string): Promise<RootTypeBranch> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details?id=${id}`),

  getBranchDetailByBranchId: (
    branch: {
      vendor_id: string;
      branch_id: string;
    },
    options?: any
  ): Promise<RootTypeBranchByBranchId> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details-branchid`, {
      method: 'POST',
      body: JSON.stringify(branch),
      ...options,
    }),

  createVendorUser: (user: any) =>
    apiFetch(`${configService.userServiceApiUrl()}/vendor-user-register`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  getAddressByMobile: (vendorId: string, branchId: string, mobile: string) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/customers/addresses/${vendorId}/branch/${branchId}?mobile_number=${mobile}`
    ),

  getVendorWalletBalance: (
    vendorId: string,
    branchId?: string
  ): Promise<TypeWalletResponce> => {
    let url = `/${vendorId}`;
    if (branchId) url += `/branch/${branchId}`;
    return apiFetch(
      `${configService.vendorServiceApiUrl()}${url}/wallet/balance`
    );
  },

  getAllVendorBranches: () =>
    apiFetch(`${configService.vendorServiceApiUrl()}/vendor-branches`),

  getAllVendors: () =>
    apiFetch(`${configService.vendorServiceApiUrl()}/vendors`),

  updateVendorBulkUploadMapping: (request: any) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/mapping/bulk-upload-template/add`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    ),

  getVendorBulkUploadMapping: (vendorId: string) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/mapping/bulk-upload-template/get/${vendorId}`
    ),

  downloadVendorList: (url: string) =>
    apiFetch(`${configService.vendorServiceApiUrl()}${url}`),

  getVendorPricingRule: (vendorId: string, branchId: string) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/pricing/delivery-fee/vendor/${vendorId}/branch/${branchId}`
    ),

  updateVendorAddress: (vendorId: string, address: any) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/branch/location/edit/${vendorId}`,
      {
        method: 'PUT',
        body: JSON.stringify(address),
      }
    ),

  getAffiliationList: () =>
    apiFetch(`${configService.vendorServiceApiUrl()}/affiliation/list/`),

  activateAffiliation: (request: any) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/affiliation/subscribe`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  deactivateAffiliation: (request: any) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/affiliation/unsubscribe`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getVendorListExportUrlJson: (search?: string, accountManager?: string) => {
    let url = '/list/json-download';
    if (search) url += `?search=${search}`;
    if (accountManager)
      url += search
        ? `&account_manager=${accountManager}`
        : `?account_manager=${accountManager}`;
    return url;
  },

  getVendorUserList: (
    perPage: number,
    search?: string,
    vendorId?: string,
    branchId?: string,
    nextSetItemTotal?: string[]
  ) => {
    let url = `/vendor/users?page_size=${perPage}`;
    if (search) url += `&search=${search}`;
    if (vendorId) url += `&vendor_id=${vendorId}`;
    if (branchId) url += `&branch_id=${branchId}`;
    nextSetItemTotal?.forEach((el) => {
      url += `&NEXT_SET_ITEMS_TOKEN=${el}`;
    });
    return apiFetch(`${configService.userServiceApiUrl()}${url}`);
  },

  updateVendorUser: (userId: string, request: any) =>
    apiFetch(
      `${configService.userServiceApiUrl()}/vendor/user/update/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    ),

  getCompanyBilling: (vendorId: string) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/company/billing/get/${vendorId}`
    ),

  updateCompanyBilling: (vendorId: string, request: any) =>
    apiFetch(
      `${configService.vendorServiceApiUrl()}/company/billing/update/${vendorId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    ),

  getAffiliation: () =>
    apiFetch(`${configService.vendorServiceApiUrl()}/affiliation/get-all`),

  getOpsFinUser: () =>
    apiFetch(`${configService.vendorServiceApiUrl()}/ops-fin-user`),
};
