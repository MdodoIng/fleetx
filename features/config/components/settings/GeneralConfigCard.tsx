'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { SettingsFallback } from '@/shared/components/fetch/fallback';
import { classForInput } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { cn } from '@/shared/lib/utils';
import { fleetService } from '@/shared/services/fleet';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BlockActivationSchema,
  TypeBlockActivationForm,
} from '../../validations/systemConfig';

export default function ZoningConfigCard() {
  const [loading, setLoading] = useState(true);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<TypeBlockActivationForm>({
    resolver: zodResolver(BlockActivationSchema),
    defaultValues: {
      isBlockActivationEnable: false,
      blockMessage: '',
      isCouriersEnable: false,
      isMashkorAppEnable: false,
    },
  });

  const { watch, setValue } = form;
  const {
    isBlockActivationEnable,
    isCouriersEnable,
    isMashkorAppEnable,
    blockMessage,
  } = watch();

  useEffect(() => {
    // Load geofence config
    fleetService
      .getGeofence()
      .then((res) => {
        if (res.data) {
          for (const config of res.data) {
            if (config.name === 'COURIERS_GEOFENCE_ENABLED') {
              setValue('isCouriersEnable', config.value === '1');
            } else if (config.name === 'MASHKOR_APP_GEOFENCE_ENABLED') {
              setValue('isMashkorAppEnable', config.value === '1');
            }
          }
        }
      })
      .catch((err) => {
        toast.error('Failed to fetch geofence configuration');
        console.error(err);
      });

    // Load block activation config
    fleetService
      .getBlockActivation()
      .then((res) => {
        if (res.data) {
          setValue('isBlockActivationEnable', res.data.enabled);
          setValue('blockMessage', res.data.message || '');
          if (messageRef.current) {
            messageRef.current.disabled = !res.data.enabled;
          }
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

  const handleToggleGeofence = (
    value: boolean,
    type: 'COURIERS' | 'MASHKOR'
  ) => {
    const request = {
      type:
        type === 'COURIERS'
          ? 'COURIERS_GEOFENCE_ENABLED'
          : 'MASHKOR_APP_GEOFENCE_ENABLED',
    };
    const action = value
      ? fleetService.geofenceEnable
      : fleetService.geofenceDisable;
    action(request).catch((err) => {
      toast.error('Failed to fetch restriction');
      console.error(err);
    });
  };

  const handleBlockToggle = (value: boolean) => {
    if (messageRef.current) messageRef.current.disabled = !value;
    setValue('isBlockActivationEnable', value);
  };

  const handleBlockUpdate = () => {
    if (isBlockActivationEnable && !blockMessage) {
      toast.error('Please enter block message');
      return;
    }

    const request = {
      enabled: isBlockActivationEnable,
      message: isBlockActivationEnable ? blockMessage : '',
    };

    fleetService
      .rechargeFirstTimeBlockConfig(request)
      .then(() => toast.success('Updated successfully'))
      .catch((err) => {
        toast.error('Failed to fetch restriction');
        console.error(err);
      });
  };

  if (loading) return <SettingsFallback />;

  return (
    <Card className="h-full">
      <CardContent className="space-y-4 flex-col flex h-full">
        {/* Block First Time Wallet Recharge */}
        <Card className="border-none shadow-none pt-0">
          <CardHeader className="p-0">
            <CardTitle>Block First Time Wallet Recharge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-col flex h-full p-0">
            <div
              className={cn(classForInput, 'flex items-center justify-between')}
            >
              <span>Enable Block Activation</span>
              <Switch
                checked={isBlockActivationEnable}
                onCheckedChange={handleBlockToggle}
              />
            </div>
            <Textarea
              ref={messageRef}
              value={blockMessage}
              onChange={(e) => setValue('blockMessage', e.target.value)}
              placeholder="Block Message"
              className="w-full"
            />
            <Button onClick={handleBlockUpdate} className="w-full mt-auto">
              Update
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Geofence Config */}
        <Card className="border-none shadow-none ">
          <CardHeader className="p-0">
            <CardTitle>Geofence Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <div
              className={cn(classForInput, 'flex items-center justify-between')}
            >
              <span>Couriers Geofence</span>
              <Switch
                checked={isCouriersEnable}
                onCheckedChange={(val) => {
                  setValue('isCouriersEnable', val);
                  handleToggleGeofence(val, 'COURIERS');
                }}
              />
            </div>

            <div
              className={cn(classForInput, 'flex items-center justify-between')}
            >
              <span>FleetX App Geofence</span>
              <Switch
                checked={isMashkorAppEnable}
                onCheckedChange={(val) => {
                  setValue('isMashkorAppEnable', val);
                  handleToggleGeofence(val, 'MASHKOR');
                }}
              />
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
