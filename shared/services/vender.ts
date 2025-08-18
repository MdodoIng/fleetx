import { storageKeys } from '../lib/storageKeys';
import { configService } from './app-config';

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: headers,
    cache: 'no-store', // prevents Next.js caching
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return await res.json();
}

export const VendorService = {
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

  getVendorDetails: (id: string) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/details?id=${id}`),

  getVendorInfo: (id: string) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/vendor-info/${id}`),

  getVendorList: (url: string) =>
    apiFetch(`${configService.vendorServiceApiUrl()}${url}`),

  getBranchDetails: (id: string) =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details?id=${id}`),

  getBranchDetailByBranchId: (
    branch: {
      vendor_id: string;
      branch_id: string;
    },
    options?: any
  ): Promise<Branch> =>
    apiFetch(`${configService.vendorServiceApiUrl()}/branch-details-branchid`, {
      method: 'POST',
      body: JSON.stringify(branch),
      ...{
        headers: {
          Authorization: `Bearer ${localStorage.getItem(storageKeys.authAppToken)}`,
        },
      },
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

  getVendorWalletBalance: (vendorId: string, branchId?: string) => {
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
