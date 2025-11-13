import { LoaderCircle } from 'lucide-react';

const LoadingPage: React.FC = () => {
  return (
    <div className="flex justify-end items-end h-screen w-screen pointer-events-none text-gray-800 md:p-10 p-6">
      <span className="p-3 bg-white/5 border border-white/10 text-white backdrop-blur rounded-xl shadow-2xl">
        <LoaderCircle className="animate-spin size-5 " />
      </span>
    </div>
  );
};

export default LoadingPage;
