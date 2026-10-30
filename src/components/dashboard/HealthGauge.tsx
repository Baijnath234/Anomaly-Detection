import React from 'react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

interface HealthGaugeProps {
  score: number; // 0.0 to 1.0 (or percentage 0 to 100)
  size?: number;
  subtext?: string;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({ score, subtext }) => {
  const normalized = score > 1 ? score : score * 100;
  const clamped = Math.max(0, Math.min(100, normalized));

  let colorClass = 'text-emerald-500';
  let bgClass = 'stroke-emerald-500';
  let statusText = 'Optimal Health';
  let StatusIcon = ShieldCheck;

  if (clamped < 60) {
    colorClass = 'text-red-500';
    bgClass = 'stroke-red-500';
    statusText = 'Degraded / Critical';
    StatusIcon = AlertTriangle;
  } else if (clamped < 80) {
    colorClass = 'text-amber-500';
    bgClass = 'stroke-amber-500';
    statusText = 'Warning State';
    StatusIcon = Activity;
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            className={`${bgClass} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-3xl font-extrabold ${colorClass}`}>
            {clamped.toFixed(0)}%
          </span>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Health Index
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-col items-center gap-1 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300">
          <StatusIcon className={`w-4 h-4 ${colorClass}`} />
          <span>{statusText}</span>
        </div>
        {subtext && <span className="text-[11px] text-slate-400">{subtext}</span>}
      </div>
    </div>
  );
};
