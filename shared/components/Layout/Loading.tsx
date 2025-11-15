'use client';
import { useAuthStore } from '@/store';
import { LoaderCircle } from 'lucide-react';

const LoadingPage: React.FC = () => {
  const { isLoading } = useAuthStore();
  const hidden = !isLoading;
  return (
    <div
      hidden={hidden}
      className="flex justify-end items-end h-screen w-screen pointer-events-none text-gray-800 md:p-10 p-6 fixed inset-0 top-0 left-0 z-50"
    >
      <span className="p-3 bg-white/50 border border-primary-blue/50 text-primary-blue backdrop-blur rounded-xl shadow-2xl">
        <LoaderCircle className="animate-spin size-5 " />
      </span>
    </div>
  );
};

export default LoadingPage;
