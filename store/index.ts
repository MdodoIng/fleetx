import { useSharedStore } from './sharedStore';
import { useAuthStore } from './useAuthStore';
import { useOrderStore } from './useOrderStore';
import { useVenderStore } from './useVenderStore';
import { useWalletStore } from './useWalletStore';

export { useAuthStore } from './useAuthStore';
export { useSharedStore } from './sharedStore';
export { useVenderStore } from './useVenderStore';
export { useOrderStore } from './useOrderStore';
export { useWalletStore } from './useWalletStore';

export const clearAllStore = () => {
  useOrderStore.getState().clearAll();
  useSharedStore.getState().clearAll();
  useVenderStore.getState().clearAll();
  useWalletStore.getState().clearAll();
};
