import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = 'h-4 w-full',
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
    <Skeleton className="h-4 w-28" />
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-3 w-40" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full space-y-2">
    <Skeleton className="h-10 w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);

