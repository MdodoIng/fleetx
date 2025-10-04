'use client';

import PromoBanner from '@/features/auth/components/PromoBanner';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-start justify-center relative z-0 w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 grid grid-cols-2 w-full max-md:hidden">
        <div className="bg-white" />
        <div className="bg-primary-blue" />
      </div>

      <div className="grid md:grid-cols-2 wrapper md:h-screen  content-center">
        <div className="h-full overflow-y-auto">
          <ResetPasswordForm />
        </div>

        <div className="h-full md:overflow-hidden relative z-0">
          <div className="bg-primary-blue absolute -z-10 inset-0 w-[200vw] left-0 -translate-x-1/2 rtl:translate-x-1/2" />
          <PromoBanner />
        </div>
      </div>
    </div>
  );
}
