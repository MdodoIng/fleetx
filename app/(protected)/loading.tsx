import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed bottom-4 starting:-bottom-40 duration-500 right-4 bg-white shadow-2xl rounded-2xl border p-3 aspect-square size-12">
      <div className="animate-spin rounded-full size-4 aspect-square border-b-2 border-black inline-block"></div>
    </div>
  );
};

export default LoadingPage;
