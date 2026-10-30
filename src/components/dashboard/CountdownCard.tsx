import React from 'react';
import { Clock, AlertOctagon, TrendingDown } from 'lucide-react';
import { formatDays } from '../../utils/formatters';

interface CountdownCardProps {
  etaDays?: number | null;
  lowerDays?: number;
  upperDays?: number;
  threshold?: number;
  failureThreshold?: number;
}

export const CountdownCard: React.FC<CountdownCardProps> = ({
  etaDays,
  lowerDays,
  upperDays,
  threshold = 0.25,
  failureThreshold,
}) => {
  const effectiveThreshold = failureThreshold ?? threshold;
  const isCritical = etaDays != null && etaDays < 7;
  const isWarning = etaDays != null && etaDays >= 7 && etaDays < 30;

  const badgeColor = isCritical
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    : isWarning
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Remaining Useful Life (RUL)
            </h3>
            <p className="text-xs text-slate-400">Degradation forecast projection</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
          {isCritical ? 'Critical Urgency' : isWarning ? 'Maintenance Due' : 'Healthy Trend'}
        </span>
      </div>

      <div className="my-4">
        {etaDays !== undefined ? (
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              Estimated failure in {formatDays(etaDays)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>90% Confidence Interval:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {formatDays(lowerDays)} – {formatDays(upperDays)}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 text-sm text-slate-400 italic flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" />
            No active RUL estimation. Run detection to compute trajectory.
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
          Failure threshold set at:
        </span>
        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
          {(threshold * 100).toFixed(0)}% Health Index
        </span>
      </div>
    </div>
  );
};
