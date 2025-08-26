'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { paymentService } from '@/shared/services/payment';

import { TypeBalanceAlertReq } from '@/shared/types/payment';
import { useVenderStore } from '@/store';
import { useEffect, useState } from 'react';

type MethodType = 'email' | 'phone';

export function AlertSettings() {
  const [alertValue, setAlertValue] = useState('');
  const [method, setMethod] = useState<MethodType[]>(['email']);
  const { vendorId, branchId } = useVenderStore();
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
        alert('✅ Wallet balance alert configured successfully!');
      }
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const fetchAlertLoader = async () => {
    setIsLoading(true);

    try {
      const res = await paymentService.getWalletNotifyBalance(
        vendorId!,
        branchId!
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

      console.error('Error in fetchOrderDetails:', errorMessage);
    }
  };

  useEffect(() => {
    const loadInitialOrders = async () => {
      await fetchAlertLoader();
    };
    loadInitialOrders();
  }, [branchId, vendorId]);

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
      <CardHeader>
        <CardTitle>Alert Settings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Get notified before your balance runs out
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter amount"
            value={alertValue}
            onChange={(e) => setAlertValue(e.target.value)}
            className="w-40"
          />
          <span>KD</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant={method?.includes('email') ? 'default' : 'outline'}
            onClick={() => onHandleClick('email')}
          >
            Email
          </Button>
          <Button
            variant={method?.includes('phone') ? 'default' : 'outline'}
            onClick={() => onHandleClick('phone')}
          >
            Phone
          </Button>
        </div>

        <p className="text-xs text-green-600">
          You’ll receive an {method} notification when your balance falls below{' '}
          {alertValue} KD
        </p>

        <Button onClick={() => configureNotification()}>Save Settings</Button>
      </CardContent>
    </Card>
  );
}
