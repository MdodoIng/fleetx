import { storageKeys } from '@/shared/lib/storageKeys';
import { configService } from '@/shared/services/app-config';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userId: string;
  user: string;
  roles: string[];
  token: string;
  orig_iat?: number;
  exp?: number;
}

const userApiUrl = configService.userServiceApiUrl();

const refreshToken = async (token: { token: string }) => {
  const res = await fetch(userApiUrl + '/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(token),
  });
  if (!res.ok) throw new Error('Failed to refresh token');
  return res.json();
};

const isAuthenticated = (): boolean => {
  const userStr = localStorage.getItem(storageKeys.userContext);
  if (!userStr) return false;
  const user = JSON.parse(userStr);
  if (user.token) {
    try {
      const decoded: any = jwtDecode(user.token);
      if (decoded.exp && Date.now() / 1000 < decoded.exp) return true;
    } catch {
      return false;
    }
  }
  return false;
};

const setUserContext = (token: string) => {
  localStorage.setItem(storageKeys.userContext, JSON.stringify({ token }));
  localStorage.setItem(storageKeys.refreshTime, new Date().toString());
};

const getDecodedAccessToken = (
  token?: string | null
): DecodedToken | undefined => {
  if (!token) {
    const userStr = localStorage.getItem(storageKeys.userContext);
    if (!userStr) {
      logout();
      return;
    }
    token = JSON.parse(userStr).token;
  }
  try {
    const decoded: any = jwtDecode(token!);
    return {
      userId: decoded.user_id,
      user: decoded.user,
      roles: decoded.roles,
      token: token ?? '',
      orig_iat: decoded.orig_iat,
      exp: decoded.exp,
    };
  } catch {
    logout();
    return;
  }
};

const logout = () => {
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  sessionStorage.clear();
  // Add any additional cleanup here if needed
};

const getAccessTokenTime = (): { orgTime: number; exp: number } | null => {
  const userStr = localStorage.getItem(storageKeys.userContext);
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  try {
    const decoded: any = jwtDecode(user.token);
    return { orgTime: decoded.orig_iat, exp: decoded.exp };
  } catch {
    return null;
  }
};

const triggerRefreshToken = async () => {
  const refreshTime = localStorage.getItem(storageKeys.refreshTime);
  if (refreshTime) {
    const refreshDate = new Date(refreshTime);
    const currentTime = new Date();
    const minute =
      Math.abs(currentTime.getTime() - refreshDate.getTime()) / 60000;
    const REFRESH_TOKEN_TIME_IN_MINUTE = 30;
    if (Math.round(minute) >= REFRESH_TOKEN_TIME_IN_MINUTE) {
      const tokenPayload = getDecodedAccessToken();
      if (!tokenPayload) return;
      try {
        const res = await refreshToken({ token: tokenPayload.token });
        localStorage.setItem(
          storageKeys.userContext,
          JSON.stringify({ token: res.data.token })
        );
        localStorage.setItem(storageKeys.refreshTime, new Date().toString());
      } catch (error: unknown) {
        if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof (error as { message: string }).message === 'string' &&
          ((error as { message: string }).message.includes(
            'Signature has expired'
          ) ||
            (error as { message: string }).message.includes(
              'Refresh has expired'
            ))
        ) {
          logout();
        }
      }
    }
  }
};

export const AuthService = {
  storageKeys,
  refreshToken,
  isAuthenticated,
  getDecodedAccessToken,
  logout,
  getAccessTokenTime,
  triggerRefreshToken,
  setUserContext,
};
