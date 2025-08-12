'use client';
import React from 'react';

const LoadingPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f0f2f5',
        color: '#333',
        fontSize: '2rem',
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column',
      }}
    >
      <h1 className="inline-block">
        Loading{' '}
        <div className="animate-spin rounded-full size-5 border-b-2 border-black inline-block"></div>
      </h1>
      <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
        Please wait while we prepare your content.
      </p>
    </div>
  );
};

export default LoadingPage;
