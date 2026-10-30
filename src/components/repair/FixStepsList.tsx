import React, { useState } from 'react';
import { CheckCircle2, Circle, ShieldAlert } from 'lucide-react';

interface FixStepsListProps {
  steps: string[];
  safetyPrecaution?: string;
}

export const FixStepsList: React.FC<FixStepsListProps> = ({
  steps,
  safetyPrecaution,
}) => {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompleted((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {safetyPrecaution && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">MANDATORY SAFETY PRECAUTION: </span>
            {safetyPrecaution}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <span>Repair Checklist Progress</span>
          <span>
            {completedCount} of {steps.length} steps completed ({progressPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, idx) => {
          const isDone = !!completed[idx];
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-start gap-3 select-none ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-500 dark:text-slate-400 line-through'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-500/40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

