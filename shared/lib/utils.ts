import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { storageKeys } from './storageKeys';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem(storageKeys.authAppToken)}`,
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
