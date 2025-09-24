import { useSharedStore } from './useSharedStore';
import { useOrderStore } from './useOrderStore';
import { useVendorStore } from './useVendorStore';
import { useWalletStore } from './useWalletStore';
import { useNotificationStore } from './useNotificationStore';
import { useAuthStore } from './useAuthStore';

export {
  useAuthStore,
  useVendorStore,
  useOrderStore,
  useWalletStore,
  useNotificationStore,
  useSharedStore,
};
export const clearAllStore = () => {
  useOrderStore.getState().clearAll();
  useSharedStore.getState().clearAll();
  useVendorStore.getState().clearAll();
  useWalletStore.getState().clearAll();
  useNotificationStore.getState().clearAll();
};
