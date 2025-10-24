'use client';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { storageKeys } from './storageKeys';
import { useAuthStore, useSharedStore } from '@/store';
import { showServerMessage } from '../services';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const { user, getDecodedAccessToken, triggerRefreshToken, logout } =
    useAuthStore.getState();
  const { getLocalStorage } = useSharedStore.getState();

  const storedToken = getLocalStorage(storageKeys.authAppToken);
  const tokenPayload = getDecodedAccessToken(storedToken);
  const token = user?.token || tokenPayload?.token;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    const errorText = errorResponse.message || (await res.text());

    if (res.status === 401 && retry) {
      try {
        await triggerRefreshToken();
        return await apiFetch<T>(url, options, false); // prevent infinite loop
      } catch (error: any) {
        if (
          error.message?.includes('Signature has expired') ||
          error.message?.includes('Refresh has expired')
        ) {
          logout();
        }
        throw new Error(`Auth error: ${error.message || errorText}`);
      }
    }

    if (options.method === 'POST' || 'post') {
      showServerMessage('error', errorText);
    }
    console.log(errorText);
    throw new Error(`API error ${res.status}: ${errorText}`);
  }

  return await res.json();
}
