import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-700 dark:text-red-400">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm mt-0.5 text-red-600 dark:text-red-300 opacity-90">
              {message}
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold underline hover:no-underline"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry Request
              </button>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-200 transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
