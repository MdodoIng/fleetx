'use client';

import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
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
import { useDir } from '@/shared/lib/hooks';
import { useRedirectToHome } from '@/shared/lib/hooks/useRedirectToHome';
import { loginSchema } from '@/features/auth/validations/auth';

export default function Login() {
  const [error, setError] = useState('');
  const { isAuthenticated, isLoading, login, isAuthenticatedCheck } =
    useAuthStore();
  const { setDir } = useDir();
  const { push } = useRouter();
  const redirectToHome = useRedirectToHome();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test_vendor1@gmail.com',
      password: '123456',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError('');
    const success = await login(values.email, values.password);

    if (success) {
      redirectToHome();
    } else {
      setError('Invalid email or password');
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated]);

  return (
    <div
      style={{
        direction: setDir,
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
