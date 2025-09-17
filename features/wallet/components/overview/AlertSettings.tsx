'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { paymentService } from '@/shared/services/payment';

import { TypeBalanceAlertReq } from '@/shared/types/payment';
import { useSharedStore, useVenderStore } from '@/store';
import { Icon } from '@iconify/react';
import { Mail, Phone, Save } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type MethodType = 'email' | 'phone';

export function AlertSettings() {
  const [alertValue, setAlertValue] = useState('');
  const [method, setMethod] = useState<MethodType[]>(['email']);
  const { vendorId, branchId, selectedBranch, selectedVendor } =
    useVenderStore();

  const { appConstants } = useSharedStore();
  const [isLoading, setIsLoading] = useState(false);

  const isCentralWalletEnabled = false;

  const configureNotification = async () => {
    // same checks as Angular
    if (!alertValue) {
      alert('⚠️ Please enter all the values');
      return;
    }
    if (!vendorId) {
      alert('⚠️ Please enter Vendor');
      return;
    }
    if (!isCentralWalletEnabled && !branchId) {
      alert('⚠️ Please enter Branch');
      return;
    }

    const request: TypeBalanceAlertReq & any = {
      vendor_id: vendorId!,
      branch_id: branchId!,
      alert_on_amount: parseFloat(parseFloat(alertValue).toFixed(2)),
      required_email_alert: method.includes('email'),
      required_sms_alert: method.includes('phone'),
    };

    try {
      const res = await paymentService.confirmWalletNotifyBalance(request);

      if (res) {
        toast('✅ Wallet balance alert configured successfully!');
      }
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const fetchAlertLoader = useCallback(async () => {
    setIsLoading(true);

    console.log(branchId);
    if (!branchId) return;

    try {
      const res = await paymentService.getWalletNotifyBalance(
        selectedVendor?.id || vendorId!,
        selectedBranch?.id || branchId!
      );

      if (res?.data) {
        setAlertValue(
          res.data.alert_on_amount
            ? parseFloat(
                parseFloat(res.data.alert_on_amount).toFixed(2)
              ).toString()
            : '0'
        );

        setMethod(
          [
            res.data.required_email_alert ? 'email' : '',
            res.data.required_sms_alert ? 'phone' : '',
          ].filter(Boolean) as MethodType[]
        );
      }

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      // Replace `this.sharedService.showServerMessage` and `this.sharedService.logError`
      const errorMessage =
        err.error?.message ||
        err.message ||
        'An unknown error occurred while fetching orders.';

      console.error('Error in fetch', errorMessage);
    }
  }, [branchId, selectedBranch?.id, vendorId, selectedVendor?.id]);

  useEffect(() => {
    fetchAlertLoader();
  }, [fetchAlertLoader]);

  const onHandleClick = (value: MethodType) => {
    setMethod((prev) => {
      if (!prev) {
        return [value];
      }
      if (prev?.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  return (
    <Card className="">
      <CardHeader className="flex justify-start">
        <CardIcon>
          <Icon icon={'fluent:alert-20-regular'} />
        </CardIcon>
        <div className="flex w-full flex-col">
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>
            Get notified before your balance runs out
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 w-full">
          <Input
            placeholder="Enter amount"
            value={alertValue}
            onChange={(e) => setAlertValue(e.target.value)}
            className="w-full"
          />
          <span>{appConstants?.currency}</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-medium">Notification Method</p>
          <div className="flex gap-4">
            <Button
              variant={method?.includes('email') ? 'outline' : 'ghost'}
              onClick={() => onHandleClick('email')}
              className="w-full shrink bg-off-white flex-col py-10 gap-1"
            >
              <Mail />
              Email
            </Button>
            <Button
              variant={method?.includes('phone') ? 'outline' : 'ghost'}
              onClick={() => onHandleClick('phone')}
              className="w-full shrink bg-off-white flex-col py-10 gap-1"
            >
              <Phone />
              Phone
            </Button>
          </div>
        </div>

        <Badge className="text-xs bg-[#F7F6C0] whitespace-normal max-md:rounded-[8px]">
          🔔 You’ll receive an {method.join(' and ')} notification when your
          balance falls below {alertValue} KD
        </Badge>

        <Button onClick={() => configureNotification()} variant="outline" className="w-full bg-[#F5F4F5] border-dark-grey/20">
          <Save />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
