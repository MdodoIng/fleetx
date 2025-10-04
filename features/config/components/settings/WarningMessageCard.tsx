'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
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

import { notificationService } from '@/shared/services/notification';
import { configService } from '@/shared/services/config';
import { cn } from '@/shared/lib/utils';
import { classForInput } from '@/shared/components/ui/input';
import {
  TypeWarningMessageForm,
  WarningMessageSchema,
} from '../../validations/systemConfig';
import { SettingsFallback } from '@/shared/components/fetch/fallback';

export default function WarningMessageCard() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<TypeWarningMessageForm>({
    resolver: zodResolver(WarningMessageSchema),
    defaultValues: { warningMessage: '', isEnable: false },
  });

  // Load existing message
  useEffect(() => {
    notificationService
      .getWarningMessageApi()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          form.setValue('warningMessage', res.data[0].message || '');
          form.setValue('isEnable', res.data[0].enabled || false);
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
  const onSubmit = async (data: TypeWarningMessageForm) => {
    setSubmitted(true);

    if (data.isEnable && !data.warningMessage) {
      toast.error('Please enter warning message');
      setSubmitted(false);
      return;
    }

    const payload = {
      message: data.warningMessage,
      enabled: data.isEnable,
    };

    try {
      const res = await configService.setWarningMessage(payload);
      if (res) {
        toast.success('Warning message updated successfully');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitted(false);
    }
  };

  if (loading) return <SettingsFallback />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 h-full flex flex-col"
      >
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle>Warning Message</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 flex-1">
            {/* Enable Toggle */}
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
                  <div className="space-y-0.5">
                    <FormLabel>{field.value ? 'Disable' : 'Enable'}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        form.setValue('isEnable', checked)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Warning Message textarea */}
            <FormField
              control={form.control}
              name="warningMessage"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter warning message..."
                      {...field}
                      disabled={!form.watch('isEnable')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={submitted || !form.formState.isValid}
            >
              Update
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
