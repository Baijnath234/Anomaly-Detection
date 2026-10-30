import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

