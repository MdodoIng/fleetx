import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export const OverviewIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = 'currentColor',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dashboard grid background */}
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="3"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />

      {/* Top metrics cards */}
      <rect
        x="4"
        y="4"
        width="7"
        height="4"
        rx="1"
        fill={color}
        opacity="0.15"
      />
      <rect
        x="13"
        y="4"
        width="7"
        height="4"
        rx="1"
        fill={color}
        opacity="0.15"
      />

      {/* Chart representation */}
      <rect
        x="4"
        y="10"
        width="7"
        height="8"
        rx="1"
        fill={color}
        opacity="0.1"
      />

      {/* Bar chart inside */}
      <rect x="5" y="15" width="1" height="2" fill={color} opacity="0.4" />
      <rect x="6.5" y="14" width="1" height="3" fill={color} opacity="0.4" />
      <rect x="8" y="13" width="1" height="4" fill={color} opacity="0.4" />
      <rect x="9.5" y="16" width="1" height="1" fill={color} opacity="0.4" />

      {/* Stats/metrics on right */}
      <circle
        cx="16.5"
        cy="12"
        r="2.5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="m15 12 1 1 2.5-2.5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom stats */}
      <rect
        x="13"
        y="16"
        width="3"
        height="1"
        fill={color}
        opacity="0.3"
        rx="0.5"
      />
      <rect
        x="13"
        y="17.5"
        width="2"
        height="1"
        fill={color}
        opacity="0.3"
        rx="0.5"
      />
    </svg>
  );
};

export default OverviewIcon;
