'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { classForInput, Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { cn } from '@/shared/lib/utils';

import {
  AreaRestrictionSchema,
  TypeAreaRestrictionForm,
} from '../../validations/systemConfig';
import { convert12to24, convert24to12, validateNextDay } from '../utils';
import userService from '@/shared/services/user';
import { useVendorStore } from '@/store';
import { SettingsFallback } from '@/shared/components/fetch/fallback';

export default function AreaRestrictionCard() {
  const [nextDay, setNextDay] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const { selectedVendor, selectedBranch } = useVendorStore();

  const form = useForm<TypeAreaRestrictionForm>({
    resolver: zodResolver(AreaRestrictionSchema),
    defaultValues: {
      isEnable: false,
      area_radius: '10',
      start_time: '00:00',
      end_time: '00:00',
      startTimeAMPM: '0',
      endTimeAMPM: '0',
      fullDayRestriction: false,
    },
  });

  useEffect(() => {
    userService
      .getAreaRestriction()
      .then((res) => {
        console.log(res);
        if (res) {
          form.setValue('id', res.data.id);
          form.setValue('isEnable', res.data.enabled);
          form.setValue('area_radius', res.data.area_radius.toString());

          if (res.data.full_day_restriction) {
            form.setValue('fullDayRestriction', true);
            form.setValue('start_time', '');
            form.setValue('end_time', '');
          } else if (!res.data.enabled) {
            // Disabled state
            form.setValue('start_time', '');
            form.setValue('end_time', '');
          } else {
            // Normal active case
            const [startT, startAMPM] = convert24to12(res.data.start_time);
            const [endT, endAMPM] = convert24to12(res.data.end_time);

            form.setValue('start_time', startT);
            form.setValue('startTimeAMPM', startAMPM === 'AM' ? '0' : '1');
            form.setValue('end_time', endT);
            form.setValue('endTimeAMPM', endAMPM === 'AM' ? '0' : '1');
            setNextDay(res.data.next_day);
          }
        } else {
          // Empty case
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TypeAreaRestrictionForm) => {
    if (!selectedVendor?.id) {
      toast.warning('Select a vendor');
      return;
    }
    if (!selectedBranch?.id) {
      toast.warning('Select a Branch');
      return;
    }
    const payload = {
      ...data,
      next_day: !!nextDay,
      vendor_id: selectedVendor.id,
      branch_id: selectedBranch.id,
      start_time: data.fullDayRestriction
        ? '00:00'
        : convert12to24(
            `${data.start_time} ${data.startTimeAMPM === '0' ? 'AM' : 'PM'}`
          ),
      end_time: data.fullDayRestriction
        ? '00:00'
        : convert12to24(
            `${data.end_time} ${data.endTimeAMPM === '0' ? 'AM' : 'PM'}`
          ),
      full_day_restriction: data.fullDayRestriction,
    };

    try {
      if (payload.id) {
        await userService.updateAreaRestriction(payload, payload.id);
        toast.success('Restriction updated successfully');
      } else {
        await userService.createAreaRestriction(payload);
        toast.success('Restriction created successfully');
      }
    } catch (err: any) {
      toast.error('Error saving restriction');
      console.error(err);
    }
  };

  const isEnable = form.watch('isEnable');
  const fullDayRestriction = form.watch('fullDayRestriction');

  if (loading) return <SettingsFallback />;

  return (
    <Form {...form}>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Area Restriction</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 flex flex-col h-full"
          >
            {/* Enable / Disable */}
            <FormField
              control={form.control}
              name="isEnable"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    classForInput,
                    'flex items-center justify-between'
                  )}
                >
                  <FormLabel>Enable Restriction</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Area Radius */}
            <FormField
              control={form.control}
              name="area_radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area Radius</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter area radius"
                      {...field}
                      disabled={!isEnable}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Range */}
            {!fullDayRestriction && isEnable && (
              <div className="flex flex-col gap-4 ">
                {/* Start Time */}
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="hh:mm"
                            {...field}
                            onBlur={() => validateNextDay(form, setNextDay)}
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="startTimeAMPM"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => {
                                field.onChange(val);
                                validateNextDay(form, setNextDay);
                              }}
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
                          )}
                        />
                      </div>
                    </FormItem>
                  )}
                />

                {/* End Time */}
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="hh:mm"
                            {...field}
                            onBlur={() => validateNextDay(form, setNextDay)}
                          />
                        </FormControl>
                        <FormField
                          control={form.control}
                          name="endTimeAMPM"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => {
                                field.onChange(val);
                                validateNextDay(form, setNextDay);
                              }}
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
                          )}
                        />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Full Day Restriction */}
            {isEnable && (
              <FormField
                control={form.control}
                name="fullDayRestriction"
                render={({ field }) => (
                  <FormItem
                    className={cn(
                      classForInput,
                      'flex items-center justify-between'
                    )}
                  >
                    <FormLabel>Full Day Restriction</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {/* Next Day Info */}
            {nextDay && (
              <p className="text-orange-500 text-xs font-bold">Next Day</p>
            )}

            <Button type="submit" className="w-full mt-auto">
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
