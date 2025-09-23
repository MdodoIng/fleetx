import { notificationService } from '@/shared/services/notification';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSharedStore } from './useSharedStore';
import { get24to12 } from '@/shared/services';
import { TypeOperationTimeApi } from '@/shared/types/notification';

export interface NotificationState {
  operationalStartTime: string | undefined;
  operationalEndTime: string | undefined;
  full_day_operational: boolean;
  busyModeData: any;
  busyModeDisplayMessage: string;
  warningMessage:
  | {
    message: string;
    isEnableToggleButton: boolean;
  }
  | undefined;
}

export interface NotificationActions {
  setValue: <K extends keyof NotificationState>(
    key: K,
    value: NotificationState[K]
  ) => void;
  clearAll: () => void;
  setOperationalHoursDisplayMessage: (data: TypeOperationTimeApi) => void;
  getOperationalHours: () => Promise<void>;
  activateBusyMode: () => Promise<void>;
  setBusyModeDisplayMessage: (data: any) => void;
  getBusyModeWarnedMessage: (mode: string, duration: number) => string;
  getBusyModeActivatedMessage: (mode: string, expiredTimeF24: string) => string;
  getDurationOfTimeInMinutes: (start: Date, end: Date) => number;
  getOperationalHoursTimer: () => void;
  getWarningMessage: () => void;
}

const initialState: NotificationState = {
  operationalStartTime: undefined,
  operationalEndTime: undefined,
  full_day_operational: true,
  busyModeData: undefined,
  busyModeDisplayMessage: '',
  warningMessage: undefined,
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setValue: (key, value) => set({ [key]: value }),

      clearAll: () => set({ ...initialState }),

      setOperationalHoursDisplayMessage: (data) => {
        const { setValue } = useSharedStore.getState();

        if (data.full_day_operational) {
          set({ full_day_operational: true });
        } else {
          set({
            full_day_operational: false,
            operationalStartTime: get24to12(data.start_time),
            operationalEndTime: get24to12(data.end_time),
          });
        }

        setValue('operationalHours', data);
      },

      getOperationalHours: async () => {
        try {
          const res = await notificationService.getOperationTimeApi();
          if (res.data) {
            get().setOperationalHoursDisplayMessage(res.data);
          }
        } catch (err: any) {
          set({
            full_day_operational: true,
            operationalStartTime: undefined,
            operationalEndTime: undefined,
          });
          console.error('Failed to fetch operational hours:', err?.error);
        }
      },

      activateBusyMode: async () => {
        try {
          const res = await notificationService.getBusyModeApi();
          if (res.data) {
            set({ busyModeData: res.data });
            get().setBusyModeDisplayMessage(res.data);
          }
        } catch (err: any) {
          console.error('Failed to fetch busy mode:', err?.error);
        }
      },

      getWarningMessage: () => {
        notificationService.getWarningMessageApi().then(
          (res) => {
            console.log(res, 'getWarningMessage');
            if (res.data && res.data.length > 0) {
              set({
                warningMessage: {
                  message: res.data[0].message,
                  isEnableToggleButton: res.data[0].enabled,
                },
              });
            } else {
              set({
                warningMessage: undefined,
              });
            }
          },
          (err) => {
            console.log(err);
          }
        );
      },

      setBusyModeDisplayMessage: (data) => {
        const currentDate = new Date();
        const warnedAt = new Date(data.warned_at);
        const activatedAt = new Date(data.activated_at);
        const expiredAt = new Date(data.expired_at);

        const message =
          currentDate < expiredAt && currentDate > warnedAt
            ? currentDate < activatedAt
              ? get().getBusyModeWarnedMessage(
                data.mode_type,
                get().getDurationOfTimeInMinutes(activatedAt, expiredAt)
              )
              : get().getBusyModeActivatedMessage(
                data.mode_type,
                `${expiredAt.getHours()}:${expiredAt.getMinutes()}`
              )
            : '';

        set({ busyModeDisplayMessage: message });
      },

      getOperationalHoursTimer: () => {
        notificationService.getOperationTimeApi().then(
          (res: any) => {
            if (res.data) {
              get().setOperationalHoursDisplayMessage(res.data);
            }
          },
          (err: any) => {
            set({
              operationalStartTime: undefined,
              operationalEndTime: undefined,
            });
            console.error('Failed to fetch operational hours:', err);
          }
        );
      },

      getBusyModeWarnedMessage: (mode, duration) =>
        `Due to a ${mode}, we will soon stop accepting orders. Busy mode will last ${duration} mins`,

      getBusyModeActivatedMessage: (mode, expiredTimeF24) =>
        `Due to a ${mode}, we stopped accepting orders until ${get24to12(expiredTimeF24)}`,

      getDurationOfTimeInMinutes: (start, end) =>
        Math.floor((end.getTime() - start.getTime()) / 60000),
    }),
    {
      name: 'notification-storage',
    }
  )
);
