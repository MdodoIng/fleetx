'use client';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { type JSX } from 'react';

function ProtectedContent(): JSX.Element {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                My Wallet
              </h1>
              <p className="text-gray-600">
                Welcome to the wallet section of our application!
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              🎉 Access Granted!
            </h2>
            <p className="text-green-700">
              You have successfully accessed this protected page. This content
              is only available to authenticated users.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                User Information
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Role:</strong>{' '}
                  <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                </p>
                <p>
                  <strong>User ID:</strong> {user?.id}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Wallet Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✅ View wallet balance</li>
                <li>✅ Track transaction history</li>
                <li>✅ Make payments</li>
                <li>✅ Manage payment methods</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              📋 Wallet Content
            </h3>
            <p className="text-blue-700 mb-4">
              This section provides access to your digital wallet and its
              features.
            </p>
            <ul className="list-disc list-inside text-blue-700 space-y-1">
              <li>Current balance display</li>
              <li>Transaction history table</li>
              <li>Payment processing tools</li>
              <li>Secure payment method management</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/admin-only"
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Admin Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedContent;
