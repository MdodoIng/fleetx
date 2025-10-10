import { apiFetch } from '../lib/utils';
import { appConfig } from './app-config';
import {
  AuthRoot,
  TypeAreaRestrictionResponse,
  TypeChangePasswordRequest,
  TypeChangePasswordResponse,
  TypeResetPasswordRequest,
  TypeSingUpRequest,
  User,
  UserLogin,
} from '../types/user';
import { configService } from './config';

const getUserServiceApiUrl = appConfig.userServiceApiUrl();
const getVendorServiceApiUrl = appConfig.vendorServiceApiUrl();

export const userService = {
  authenticate: (user: UserLogin): Promise<AuthRoot> =>
    apiFetch(`${getUserServiceApiUrl}/authenticate`, {
      method: 'POST',
      body: JSON.stringify({ ...user }),
    }),

  refreshToken: (token: any): Promise<AuthRoot> =>
    apiFetch(`${getUserServiceApiUrl}/refreshtoken`, {
      method: 'POST',
      body: JSON.stringify(token),
    }),

  restUserPassword: (user: TypeResetPasswordRequest): Promise<AuthRoot> =>
    apiFetch(`${getUserServiceApiUrl}/vendor-password-reset`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  restPassword: (user: User) =>
    apiFetch(`${getUserServiceApiUrl}/resetpassword`, {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  signUp: (request: TypeSingUpRequest) =>
    apiFetch(`${getVendorServiceApiUrl}/signup`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  forgotPassword: (request: { email: any }) =>
    apiFetch(`${getUserServiceApiUrl}/password/forgot`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  validateForgotPassword: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/password/validate/reset-link`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  resetForgotPassword: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/password/reset`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  changePassword: (
    request: TypeChangePasswordRequest
  ): Promise<TypeChangePasswordResponse> =>
    apiFetch(`${getUserServiceApiUrl}/my/password/change`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  slaAccepted: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/sla/accept`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  addNotes: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/note/add`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getNoteDetails: (userId: string) =>
    apiFetch(`${getUserServiceApiUrl}/note/list/${userId}`),

  getUserNoteDetails: (userId: string) =>
    apiFetch(`${getUserServiceApiUrl}/get/${userId}`),

  affiliationRegenerate: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/affiliation/regenerate`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  getAreaRestriction: (): Promise<TypeAreaRestrictionResponse> =>
    apiFetch(`${getUserServiceApiUrl}/areas/restriction/get`, {
      method: 'GET',
    }),

  createAreaRestriction: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/areas/restriction/create`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  updateAreaRestriction: (request: any, id: string) =>
    apiFetch(`${getUserServiceApiUrl}/areas/restriction/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }),

  getAccountManagerList: (
    page: number,
    perPage: number,
    search?: string | null
  ): Promise<any> => {
    let url = `/vendor-acount-manager/list?page=${page}&page_size=${perPage}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    return apiFetch(`${getUserServiceApiUrl}${url}`, {
      method: 'GET',
    });
  },

  createAccountManager: (request: any) =>
    apiFetch(`${getUserServiceApiUrl}/vendor-acount-manager/create`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  updateAccountManager: (request: any, id: string) =>
    apiFetch(`${getUserServiceApiUrl}/vendor-acount-manager/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    }),
};

export default userService;
