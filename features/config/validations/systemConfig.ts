import { z } from 'zod';
import { convert12to24 } from '../components/utils';

// Operation Timing Schema
export const OperationTimingSchema = z
  .object({
    id: z.any().optional(),
    start_time: z
      .string()
      .regex(/^(1[0-2]|0?[1-9]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
      .optional(),
    end_time: z
      .string()
      .regex(/^(1[0-2]|0?[1-9]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
      .optional(),
    startTimeAMPM: z
      .enum(['0', '1'], { message: 'AM/PM is required' })
      .optional(),
    endTimeAMPM: z
      .enum(['0', '1'], { message: 'AM/PM is required' })
      .optional(),
    fullDayOperational: z.boolean().optional(),
  })
  // Ensure required fields if not full day
  .refine(
    (data) => {
      if (!data.fullDayOperational) {
        return (
          !!data.start_time &&
          !!data.end_time &&
          !!data.startTimeAMPM &&
          !!data.endTimeAMPM
        );
      }
      return true;
    },
    {
      message: 'Start and end times are required when not full day operational',
    }
  )
  // Ensure start_time <= end_time
  .refine(
    (data) => {
      if (!data.fullDayOperational) {
        const start = convert12to24(
          `${data.start_time} ${data.startTimeAMPM === '0' ? 'AM' : 'PM'}`
        );
        const end = convert12to24(
          `${data.end_time} ${data.endTimeAMPM === '0' ? 'AM' : 'PM'}`
        );
        return start <= end;
      }
      return true;
    },
    {
      message: 'Start time should not be greater than end time',
      path: ['start_time'],
    }
  );

export type TypeOperationTimingForm = z.infer<typeof OperationTimingSchema>;

// Warning Message Schema
export const WarningMessageSchema = z
  .object({
    warningMessage: z
      .string()
      .max(250, 'Max 250 characters')
      .optional()
      .or(z.literal('')), // allow empty if disabled
    isEnable: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEnable) {
        return !!data.warningMessage && data.warningMessage.trim().length > 0;
      }
      return true;
    },
    { message: 'Warning message is required when enabled' }
  );

export type TypeWarningMessageForm = z.infer<typeof WarningMessageSchema>;

// Area Restriction Schema
export const AreaRestrictionSchema = z
  .object({
    id: z.any().optional(),
    isEnable: z.boolean(),
    area_radius: z
      .string()
      .regex(/^[1-9][0-9]*$/, 'Area radius must be a positive number')
      .optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
    startTimeAMPM: z
      .enum(['0', '1'], { message: 'AM/PM is required' })
      .optional(),
    endTimeAMPM: z
      .enum(['0', '1'], { message: 'AM/PM is required' })
      .optional(),
    fullDayRestriction: z.boolean().optional(),
  })
  // Required fields when enabled and not full day
  .refine(
    (data) => {
      if (data.isEnable && !data.fullDayRestriction) {
        return (
          !!data.start_time &&
          !!data.end_time &&
          !!data.startTimeAMPM &&
          !!data.endTimeAMPM
        );
      }
      return true;
    },
    {
      message:
        'Start and end times are required when enabled and not full day restriction',
    }
  )
  // Validate start_time <= end_time when enabled and not full day
  .refine(
    (data) => {
      if (data.isEnable && !data.fullDayRestriction) {
        const start = convert12to24(
          `${data.start_time} ${data.startTimeAMPM === '0' ? 'AM' : 'PM'}`
        );
        const end = convert12to24(
          `${data.end_time} ${data.endTimeAMPM === '0' ? 'AM' : 'PM'}`
        );
        return start <= end;
      }
      return true;
    },
    {
      message:
        'Start time should not be greater than end time (if next day, toggle full day or adjust times)',
      path: ['start_time'],
    }
  );

export type TypeAreaRestrictionForm = z.infer<typeof AreaRestrictionSchema>;

// Block Activation Schema
export const BlockActivationSchema = z
  .object({
    blockMessage: z
      .string()
      .max(250, 'Message must not exceed 250 characters')
      .optional(),
    isBlockActivationEnable: z.boolean(),
    isCouriersEnable: z.boolean(),
    isMashkorAppEnable: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isBlockActivationEnable) {
        return !!data.blockMessage && data.blockMessage.trim().length > 0;
      }
      return true;
    },
    { message: 'Block message is required when enabled' }
  );

export type TypeBlockActivationForm = z.infer<typeof BlockActivationSchema>;
