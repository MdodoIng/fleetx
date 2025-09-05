import { useVenderStore } from '@/store';
import { storageKeys } from '../lib/storageKeys';
import { apiFetch } from '../lib/utils';
import {
  TypeAddVenderReq,
  TypeBranch,
  TypeCreateVendorUserReq,
  TypeEditVenderReq,
  TypeOpsFinUserResponce,
  TypeUpdateVendorUserReq,
  TypeVender,
  TypeVenderList,
  TypeVenderListRes,
  TypeVenderRes,
  TypeVendorUserListRes,
  TypeWalletResponce,
} from '../types/vender';
import { configService } from './app-config';
import { TypeVendorPricingRuleRes } from '../types/index,d';

export const vendorService = {
  create: (vendor: TypeAddVenderReq) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/create`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    }),

  update: (req: TypeEditVenderReq) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/update/${req.id}`, {
      method: 'PUT',
      body: JSON.stringify(req),
    }),

  getVendorDetails: (id: string): Promise<TypeVenderRes> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/details?id=${id}`),

  getVendorInfo: (id: string): Promise<{ data: TypeVender }> =>
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

  getBranchDetails: (id: string): Promise<{ data: TypeBranch[] }> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details?id=${id}`),

  getBranchDetailByBranchId: (
    branch: {
      vendor_id: string;
      branch_id: string;
    },
    options?: any
  ): Promise<any> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details-branchid`, {
      method: 'POST',
      body: JSON.stringify(branch),
      ...options,
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

  getVendorPricingRule: (
    vendorId: string,
    branchId: string
  ): Promise<TypeVendorPricingRuleRes> =>
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
    return apiFetch(`${configService.userServiceApiUrl()}${url}`);
  },

  updateVendorUser: (userId: string, request: TypeUpdateVendorUserReq) =>
    apiFetch(
      `${configService.userServiceApiUrl()}/vendor/user/update/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    ),

  createVendorUser: (user: TypeCreateVendorUserReq): Promise<any> =>
    apiFetch(`${configService.userServiceApiUrl()}/vendor-user-register`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),

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
    apiFetch(`${configService.vendorServiceApiUrl()}/affiliation/get-all`, {
      method: 'GET',
    }),

  getOpsFinUser: (): Promise<TypeOpsFinUserResponce> =>
    apiFetch(`${configService.userServiceApiUrl()}/all-ops-fin/users`),
};
