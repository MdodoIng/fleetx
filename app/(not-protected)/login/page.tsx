'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { useRTL } from '@/shared/lib/utils';

export default function Login() {
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading, setLoading } = useAuthStore();
  const isRtl = useRTL();
  const { push } = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      push('/');
    }
  }, [isAuthenticated, push]);

  const formSchema = z.object({
    email: z.literal([
      'vendor.user@example.com',
      'op.manager@example.com',
      'finance.manager@example.com',
      'vendor.account@example.com',
      'sales.head@example.com',
    ]),
    password: z.literal('password'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'vendor.user@example.com',
      password: 'password',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError('');
    setLoading(true);

    try {
      const success = await login(values.email, values.password);
      console.log(success, isAuthenticated);
      if (success) {
        push('/order');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        direction: isRtl ? 'rtl' : 'ltr',
      }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8"
    >
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Ender your Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Ender your Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {' '}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Demo Accounts:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Vendor User:</strong> vendor.user@example.com / password
            </p>
            <p>
              <strong>Operation Manager:</strong> op.manager@example.com /
              password
            </p>
            <p>
              <strong>Finance Manager:</strong> finance.manager@example.com /
              password
            </p>
            <p>
              <strong>Vendor Account Manager:</strong>
              vendor.account@example.com / password
            </p>
            <p>
              <strong>Sales Head:</strong> sales.head@example.com / password
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
