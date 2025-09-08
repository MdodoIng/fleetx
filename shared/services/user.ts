import { configService } from '@/shared/services/app-config';
import { User, UserLogin } from '@/shared/types/auth';
import { apiFetch } from '../lib/utils';

const getUserServiceApiUrl = configService.userServiceApiUrl();
const getvendorServiceApiUrl = configService.vendorServiceApiUrl();

export const authenticate = (user: UserLogin) =>
  fetch(`${getUserServiceApiUrl}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user }),
  });

export const restUserPassword = (user: User) =>
  fetch(`${getUserServiceApiUrl}/vendor-password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

export const restPassword = (user: User) =>
  fetch(`${getUserServiceApiUrl}/resetpassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

export const signUp = (request: any) =>
  fetch(`${getvendorServiceApiUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const forgotPassword = (request: any) =>
  fetch(`${getUserServiceApiUrl}/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const validateForgotPassword = (request: any) =>
  fetch(`${getUserServiceApiUrl}/password/validate/reset-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const resetForgotPassword = (request: any) =>
  fetch(`${getUserServiceApiUrl}/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const changePassword = (request: any) =>
  fetch(`${getUserServiceApiUrl}/my/password/change`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const slaAccepted = (request: any) =>
  fetch(`${getUserServiceApiUrl}/sla/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const addNotes = (request: any) =>
  fetch(`${getUserServiceApiUrl}/note/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const getNoteDetails = (userId: string) =>
  fetch(`${getUserServiceApiUrl}/note/list/${userId}`);

export const getUserNoteDetails = (userId: string) =>
  fetch(`${getUserServiceApiUrl}/get/${userId}`);

export const affiliationRegenerate = (request: any) =>
  fetch(`${getUserServiceApiUrl}/affiliation/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const getAreaRestriction = () =>
  fetch(`${getUserServiceApiUrl}/areas/restriction/get`);

export const createAreaRestriction = (request: any) =>
  fetch(`${getUserServiceApiUrl}/areas/restriction/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updateAreaRestriction = (request: any, id: string) =>
  fetch(`${getUserServiceApiUrl}/areas/restriction/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const getAccountManagerList = (
  page: number,
  perPage: number,
  search?: string | null
) => {
  let url = `/vendor-acount-manager/list?page=${page}&page_size=${perPage}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  return apiFetch(`${getUserServiceApiUrl}${url}`, {
    method: 'GET',
  });
};

export const createAccountManager = (request: any) =>
  fetch(`${getUserServiceApiUrl}/vendor-acount-manager/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

export const updateAccountManager = (request: any, id: string) =>
  fetch(`${getUserServiceApiUrl}/vendor-acount-manager/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
