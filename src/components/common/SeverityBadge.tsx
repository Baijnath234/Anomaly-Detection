import React from 'react';
import { Severity } from '../../types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  switch (severity) {
    case 'Critical':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Critical
        </span>
      );
    case 'Warning':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Warning
        </span>
      );
    case 'Info':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 ${
            isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Info className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Info
        </span>
      );
  }
};

