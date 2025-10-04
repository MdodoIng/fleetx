import React from 'react';

interface IntegrationsIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const BillIcon: React.FC<IntegrationsIconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.2188 15.7502C13.7 15.3224 14.425 15.3224 14.9062 15.7502C15.2332 16.0407 15.75 15.8087 15.75 15.3713V2.62889C15.75 2.19147 15.2332 1.95938 14.9062 2.24999C14.425 2.67772 13.7 2.67772 13.2188 2.24999C12.7375 1.82227 12.0125 1.82227 11.5312 2.24999C11.05 2.67772 10.325 2.67772 9.84375 2.24999C9.36255 1.82227 8.63745 1.82227 8.15625 2.24999C7.67505 2.67772 6.94994 2.67772 6.46875 2.24999C5.98756 1.82227 5.26244 1.82227 4.78125 2.24999C4.30006 2.67772 3.57494 2.67772 3.09375 2.24999C2.76682 1.95938 2.25 2.19147 2.25 2.62889V15.3713C2.25 15.8087 2.76682 16.0407 3.09375 15.7502C3.57494 15.3224 4.30006 15.3224 4.78125 15.7502C5.26244 16.1779 5.98756 16.1779 6.46875 15.7502C6.94994 15.3224 7.67505 15.3224 8.15625 15.7502C8.63745 16.1779 9.36255 16.1779 9.84375 15.7502C10.325 15.3224 11.05 15.3224 11.5312 15.7502C12.0125 16.1779 12.7375 16.1779 13.2188 15.7502Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.625 11.625H12.375" stroke={color} strokeLinecap="round" />
      <path d="M5.625 9H12.375" stroke={color} strokeLinecap="round" />
      <path d="M5.625 6.375H12.375" stroke={color} strokeLinecap="round" />
    </svg>
  );
};

export default BillIcon;
