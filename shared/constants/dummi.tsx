import type { User } from '../types/auth';

export const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'vendor.user@example.com': {
    password: 'password',
    user: {
      id: '1',
      name: 'Vendor User',
      email: 'vendor.user@example.com',
      role: 'VENDOR_USER',
    },
  },
  'op.manager@example.com': {
    password: 'password',
    user: {
      id: '2',
      name: 'Operation Manager',
      email: 'op.manager@example.com',
      role: 'OPERATION_MANAGER',
    },
  },
  'finance.manager@example.com': {
    password: 'password',
    user: {
      id: '3',
      name: 'Finance Manager',
      email: 'finance.manager@example.com',
      role: 'FINANCE_MANAGER',
    },
  },
  'vendor.account@example.com': {
    password: 'password',
    user: {
      id: '4',
      name: 'Vendor Account Manager',
      email: 'vendor.account@example.com',
      role: 'VENDOR_ACCOUNT_MANAGER',
    },
  },
  'sales.head@example.com': {
    password: 'password',
    user: {
      id: '5',
      name: 'Sales Head',
      email: 'sales.head@example.com',
      role: 'SALES_HEAD',
    },
  },
};
