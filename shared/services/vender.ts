import { useVenderStore } from '@/store';
import { storageKeys } from '../lib/storageKeys';
import { apiFetch } from '../lib/utils';
import {
  TypeAddVenderReq,
  TypeBranch,
  TypeCreateVendorUserReq,
  TypeEditVenderReq,
  TypeGetCompanyBillingResponse,
  TypeOpsFinUserResponce,
  TypeUpdateCompanyBillingRequest,
  TypeUpdateVendorUserReq,
  TypeVender,
  TypeVenderList,
  TypeVenderListRes,
  TypeVenderRes,
  TypeVendorUserListRes,
  TypeWalletResponce,
} from '../types/vender';
import { appConfig } from './app-config';
import { TypeVendorPricingRuleRes } from '../types/index,d';

export const vendorService = {
  create: (vendor: TypeAddVenderReq) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/create`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    }),

  update: (req: TypeEditVenderReq) =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/update/${req.id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    }),

  getVendorDetails: (id: string): Promise<TypeVenderRes> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/details?id=${id}`),

  getVendorInfo: (id: string): Promise<{ data: TypeVender }> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/vendor-info/${id}`),

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
    apiFetch(`${appConfig.vendorServiceApiUrl()}${url}`),

  getBranchDetails: (id: string): Promise<{ data: TypeBranch[] }> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/branch-details?id=${id}`),

  getBranchDetailByBranchId: (
    branch: {
      vendor_id: string;
      branch_id: string;
    },
    options?: any
  ): Promise<any> =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/branch-details-branchid`, {
      method: 'POST',
      body: JSON.stringify(branch),
      ...options,
    }),

  getAddressByMobile: (vendorId: string, branchId: string, mobile: string) =>
    apiFetch(
      `${appConfig.vendorServiceApiUrl()}/customers/addresses/${vendorId}/branch/${branchId}?mobile_number=${mobile}`
    ),

  getVendorWalletBalance: (
    vendorId: string,
    branchId?: string
  ): Promise<TypeWalletResponce> => {
    let url = `/${vendorId}`;
    if (branchId) url += `/branch/${branchId}`;
    return apiFetch(
      `${appConfig.vendorServiceApiUrl()}${url}/wallet/balance`
    );
  },

  getAllVendorBranches: () =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/vendor-branches`),

  getAllVendors: () =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/vendors`),

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

  getAffiliationList: () =>
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
    apiFetch(
      `${appConfig.userServiceApiUrl()}/vendor/user/update/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    ),

  createVendorUser: (user: TypeCreateVendorUserReq): Promise<any> =>
    apiFetch(`${appConfig.userServiceApiUrl()}/vendor-user-register`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),



  getAffiliation: () =>
    apiFetch(`${appConfig.vendorServiceApiUrl()}/affiliation/get-all`, {
      method: 'GET',
    }),

  getOpsFinUser: (): Promise<TypeOpsFinUserResponce> =>
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
