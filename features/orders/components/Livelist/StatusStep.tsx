'use client';

import { Check, Circle } from 'lucide-react';
import { TypeStatusHistoryForUi } from '@/shared/types/orders';
import React from 'react';

interface StatusStepProps {
  status: TypeStatusHistoryForUi;
}

const StatusStep: React.FC<StatusStepProps> = ({ status }) => {
  return (
    <div className="flex gap-3 items-start relative z-10 group">
      {/* Icon */}
      <div className="flex flex-col items-center">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            status.completed ? 'bg-primary-blue' : 'border border-[#ABB7C2]'
          }`}
        >
          {status.active ? (
            <Circle className="text-white size-[80%]" />
          ) : (
            <Check className="text-white size-[80%]" />
          )}
        </div>
      </div>

      {/* Text */}
      <div>
        <p
          className={`text-sm font-medium ${
            status.completed ? 'text-purple-600' : 'text-gray-500'
          }`}
        >
          {status.text}
        </p>
        <p className="text-xs text-gray-400">{status.time}</p>
      </div>

      {/* Connector Line */}
      <div className="h-[calc(100%-10px)] w-px bg-[#CFD6DC] absolute left-2.5 bottom-[-15px] group-last:hidden" />
    </div>
  );
};

export default StatusStep;
