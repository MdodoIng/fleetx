/* eslint-disable prefer-const */
import { UseFormReturn } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

export const convert12to24 = (time12h: string) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

export const convert24to12 = (time24h: string) => {
  const [hours, minutes] = time24h.split(':');
  let h = parseInt(hours, 10);
  let ampm = 'AM';
  if (h >= 12) {
    ampm = 'PM';
    if (h > 12) h -= 12;
  }
  return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

export function validateNextDay(
  form: UseFormReturn<any>,
  setNextDay: Dispatch<SetStateAction<string>>
) {
  const startTime = form.getValues('startTime');
  const startAMPM = form.getValues('startTimeAMPM');
  const endTime = form.getValues('endTime');
  const endAMPM = form.getValues('endTimeAMPM');

  if (!startTime || !endTime || startAMPM === '' || endAMPM === '') return;

  const startValue = convert12to24(
    `${startTime} ${startAMPM === '0' ? 'AM' : 'PM'}`
  );
  const endValue = convert12to24(`${endTime} ${endAMPM === '0' ? 'AM' : 'PM'}`);

  const startDate = new Date(`1/1/2020 ${startValue}`);
  const endDate = new Date(`1/1/2020 ${endValue}`);

  form.setValue('fullDayOperational', false); // reset

  if (startDate > endDate) {
    setNextDay('Next Day');
  } else if (startValue === endValue) {
    form.setValue('fullDayOperational', true);
    setNextDay('');
  } else {
    setNextDay('');
  }
}

export function handleFullDayToggle(
  form: UseFormReturn<any>,
  setNextDay: Dispatch<SetStateAction<string>>
) {
  const current = form.getValues('fullDayOperational');
  const newValue = !current;

  form.setValue('fullDayOperational', newValue);

  if (newValue) {
    // clear/disable values like Angular
    form.setValue('startTime', '12:00');
    form.setValue('endTime', '12:00');
    form.setValue('startTimeAMPM', '0');
    form.setValue('endTimeAMPM', '0');
    form.clearErrors();
    setNextDay('');
  }
}
