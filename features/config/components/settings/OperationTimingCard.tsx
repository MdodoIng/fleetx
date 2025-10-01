'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/shared/components/ui/form';
import { classForInput, Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import {
  OperationTimingSchema,
  type TypeOperationTimingForm,
} from '@/features/config/validations/systemConfig';
import {
  convert12to24,
  convert24to12,
  handleFullDayToggle,
  validateNextDay,
} from '../utils';
import { notificationService } from '@/shared/services/notification';
import { configService } from '@/shared/services/config';
import { cn } from '@/shared/lib/utils';
import { SettingsFallback } from '@/shared/components/fetch/fallback';

export default function OperationTimingCard() {
  const [submitted, setSubmitted] = useState(false);
  const [nextDay, setNextDay] = useState('');
  const [loading, setLoading] = useState(true);
  const form = useForm<TypeOperationTimingForm>({
    resolver: zodResolver(OperationTimingSchema),
    defaultValues: {
      id: null,
      start_time: '',
      end_time: '',
      startTimeAMPM: '0',
      endTimeAMPM: '0',
      fullDayOperational: false,
    },
    mode: 'onTouched',
  });

  // Load existing config
  useEffect(() => {
    notificationService
      .getOperationTimeApi()
      .then((res) => {
        if (res.data) {
          form.setValue('id', res.data.id);
          if (res.data.full_day_operational) {
            form.setValue('fullDayOperational', true);
            setNextDay('');
          } else {
            const startTime = convert24to12(res.data.start_time);
            const [sTime, sAmPm] = startTime.split(' ');
            form.setValue('start_time', sTime);
            form.setValue('startTimeAMPM', sAmPm === 'AM' ? '0' : '1');

            const endTime = convert24to12(res.data.end_time);
            const [eTime, eAmPm] = endTime.split(' ');
            form.setValue('end_time', eTime);
            form.setValue('endTimeAMPM', eAmPm === 'AM' ? '0' : '1');

            setNextDay(res.data.next_day ? 'Next Day' : '');
          }
        } else {
          // Default fallback like Angular
          form.setValue('start_time', '00:00');
          form.setValue('end_time', '00:00');
          setNextDay('');
        }
      })
      .catch((err) => {
        toast.error('Failed to fetch restriction');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [form]);

  // Submit handler
  const onSubmit = async (data: TypeOperationTimingForm) => {
    setSubmitted(true);
    if (data.fullDayOperational) {
      console.log(data.fullDayOperational);
      form.clearErrors();
    }

    try {
      const payload: TypeOpTime = {
        start_time: data.fullDayOperational
          ? '00:00'
          : convert12to24(
              `${data.start_time} ${data.startTimeAMPM === '0' ? 'AM' : 'PM'}`
            ),
        end_time: data.fullDayOperational
          ? '00:00'
          : convert12to24(
              `${data.end_time} ${data.endTimeAMPM === '0' ? 'AM' : 'PM'}`
            ),
        full_day_operational: data.fullDayOperational,
        next_day: nextDay === 'Next Day',
      };

      // check if ID exists → update, else create
      if (data.id) {
        const res = await configService.update(payload, data.id);
        console.log(res);
        if (res?.data) {
          toast.success('Operation Time updated successfully');
        }
      } else {
        const res = await configService.create(payload);
        if (res?.data) {
          toast.success('Operation Time configured successfully');
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitted(false);
    }
  };

  const isDisabled = form.watch('fullDayOperational');

  if (loading) return <SettingsFallback />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full">
        <Card className="rounded-[8px] bg-white h-full flex flex-col items-start">
          <CardHeader></CardHeader>
          <CardContent className="flex flex-col gap-4 h-full w-full">
            {/* Start Time */}
            <div className="flex items-start gap-2 w-full">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="hh:mm"
                        {...field}
                        disabled={isDisabled}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          validateNextDay(form, setNextDay);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startTimeAMPM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AM / PM</FormLabel>
                    <Select
                      disabled={isDisabled}
                      onValueChange={(val) => {
                        field.onChange(val);
                        validateNextDay(form, setNextDay);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">AM</SelectItem>
                        <SelectItem value="1">PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* End Time */}
            <div className="flex items-start gap-2 w-full">
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="hh:mm"
                        {...field}
                        disabled={isDisabled}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          validateNextDay(form, setNextDay);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTimeAMPM"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AM / PM</FormLabel>
                    <Select
                      disabled={isDisabled}
                      onValueChange={(val) => {
                        field.onChange(val);
                        validateNextDay(form, setNextDay);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="AM/PM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">AM</SelectItem>
                        <SelectItem value="1">PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Full Day Toggle */}
            <FormField
              control={form.control}
              name="fullDayOperational"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    classForInput,
                    'flex items-center justify-between'
                  )}
                >
                  <div className="space-y-0.5">
                    <FormLabel>Full Day Operational</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={() =>
                        handleFullDayToggle(form, setNextDay)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Next Day indicator */}
            {nextDay && (
              <p className="text-sm text-blue-600 font-medium">{nextDay}</p>
            )}
          </CardContent>
          <CardFooter className="w-full">
            <Button
              type="submit"
              className="w-full"
              disabled={submitted || !form.formState.isValid}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
