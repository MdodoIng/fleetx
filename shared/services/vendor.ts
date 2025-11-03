import { useAuthStore, useSharedStore, useVendorStore } from '@/store';
import { storageKeys } from '../lib/storageKeys';
import { apiFetch } from '../lib/utils';
import {
  RootTypeBranchByBranchId,
  TypeAddVendorReq,
  TypeAffiliationLisResponse,
  TypeBranch,
  TypeCreateVendorUserReq,
  TypeEditVendorReq,
  TypeGetCompanyBillingResponse,
  TypeOpsFinUserResponse,
  TypeUpdateCompanyBillingRequest,
  TypeUpdateVendorUserReq,
  TypeVendor,
  TypeVendorList,
  TypeVendorListRes,
  TypeVendorRes,
  TypeVendorUserListRes,
  TypeWalletResponse,
} from '../types/vendor';
import { TypeAddressByMobileResponse } from '../types/orders';
import { appConfig } from './app-config';
import { TypeVendorPricingRuleRes } from '../types';

export const vendorService = {
  create: (vendor: TypeAddVendorReq) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/create`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    }),

  update: (req: TypeEditVendorReq) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/update/${req.id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    }),

  getVendorDetails: (id: string): Promise<TypeVendorRes> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/details?id=${id}`),

  getVendorInfo: (id: string): Promise<{ data: TypeVendor }> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/vendor-info/${id}`),

  setVendorListUrl: (
    perPage: number | null,
    searchVendor?: string | null,
    NEXT_SET_ITEMS_TOKEN?: string[] | null
  ) => {
    const { getVendorAccountManagerId, selectedAccountManager } =
      useVendorStore.getState();
    getVendorAccountManagerId();
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

  getVendorList: (url: string): Promise<TypeVendorListRes> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}${url}`),

  getBranchDetails: (id: string): Promise<{ data: TypeBranch[] }> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/branch-details?id=${id}`, {
      method: 'GET',
    }),

  getBranchDetailByBranchId: (branch: {
    vendor_id: string;
    branch_id: string;
  }): Promise<RootTypeBranchByBranchId> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/branch-details-branchid`, {
      method: 'POST',
      body: JSON.stringify(branch),
    }),

  getAddressByMobile: (
    vendorId: string,
    branchId: string,
    mobile: string
  ): Promise<TypeAddressByMobileResponse> =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/customers/addresses/${vendorId}/branch/${branchId}?mobile_number=${mobile}`
    ),

  getVendorWalletBalance: (
    vendorId: string,
    branchId?: string
  ): Promise<TypeWalletResponse> => {
    let url = `/${vendorId}`;
    if (branchId) url += `/branch/${branchId}`;
    return apiFetch(`${appConfig.vendorServiceApiUrl()}${url}/wallet/balance`);
  },

  getAllVendorBranches: () =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/vendor-branches`),

  getAllVendors: () => apiFetch(`${appConfig.vendorServiceApiUrl()}/vendors`),

  updateVendorBulkUploadMapping: (request: any) =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/mapping/bulk-upload-template/add`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    ),

  getVendorBulkUploadMapping: (vendorId: string) =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/mapping/bulk-upload-template/get/${vendorId}`
    ),

  downloadVendorList: (url: string) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}${url}`),

  getVendorPricingRule: (
    vendorId: string,
    branchId: string
  ): Promise<TypeVendorPricingRuleRes> =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/pricing/delivery-fee/vendor/${vendorId}/branch/${branchId}`
    ),

  updateVendorAddress: (vendorId: string, address: any) =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/branch/location/edit/${vendorId}`,
      {
        method: 'PUT',
        body: JSON.stringify(address),
      }
    ),

  getAffiliationList: (): Promise<TypeAffiliationLisResponse> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/affiliation/list/`),

  activateAffiliation: (request: any) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/affiliation/subscribe`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  deactivateAffiliation: (request: any) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/affiliation/unsubscribe`, {
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
    search?: string | null,
    vendorId?: string,
    branchId?: string,
    nextSetItemTotal?: string[] | null
  ): Promise<TypeVendorUserListRes> => {
    let url = `/vendor/users?page_size=${perPage}`;
    if (search) url += `&search=${search}`;
    if (vendorId) url += `&vendor_id=${vendorId}`;
    if (branchId) url += `&branch_id=${branchId}`;
    nextSetItemTotal?.forEach((el) => {
      url += `&NEXT_SET_ITEMS_TOKEN=${el}`;
    });
    return apiFetch(`${appConfig.userServiceApiUrl()}${url}`);
  },

  updateVendorUser: (userId: string, request: TypeUpdateVendorUserReq) =>
    apiFetch(`${appConfig.userServiceApiUrl()}/vendor/user/update/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }),

  createVendorUser: (user: TypeCreateVendorUserReq): Promise<any> =>
    apiFetch(`${appConfig.userServiceApiUrl()}/vendor-user-register`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  getAffiliation: (): Promise<any> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/affiliation/get-all`, {
      method: 'GET',
    }),

  getOpsFinUser: (): Promise<TypeOpsFinUserResponse> =>
    apiFetch(`${appConfig.userServiceApiUrl()}/all-ops-fin/users`),

  getCompanyBilling(vendorId: string): Promise<TypeGetCompanyBillingResponse> {
    return apiFetch(
      `${appConfig.vendorServiceApiUrl()}/company/billing/get/${vendorId}`,
      {
        method: 'GET',
      }
    );
  },

  updateCompanyBilling(
    vendorId: string,
    request: TypeUpdateCompanyBillingRequest
  ): Promise<any> {
    return apiFetch(
      `${appConfig.vendorServiceApiUrl()}/company/billing/update/${vendorId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  },
};
