import { useSharedStore } from './useSharedStore';
import { useOrderStore } from './useOrderStore';
import { useVenderStore } from './useVenderStore';
import { useWalletStore } from './useWalletStore';
import { useNotificationStore } from './useNotificationStore';
import { useAuthStore } from './useAuthStore';

export {
  useAuthStore,
  useVenderStore,
  useOrderStore,
  useWalletStore,
  useNotificationStore,
  useSharedStore,
};
export const clearAllStore = () => {
  useOrderStore.getState().clearAll();
  useSharedStore.getState().clearAll();
  useVenderStore.getState().clearAll();
  useWalletStore.getState().clearAll();
  useNotificationStore.getState().clearAll();
};
