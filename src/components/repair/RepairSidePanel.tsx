import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { repairApi } from '../../api/repair.api';
import { SeverityBadge } from '../common/SeverityBadge';
import { FixStepsList } from './FixStepsList';
import { X, Sparkles, Wrench } from 'lucide-react';
import { Skeleton } from '../common/LoadingSkeleton';

interface RepairSidePanelProps {
  anomalyId: string | null;
  onClose: () => void;
}

export const RepairSidePanel: React.FC<RepairSidePanelProps> = ({
  anomalyId,
  onClose,
}) => {
  const { data: guide, isLoading, error } = useQuery({
    queryKey: ['repair-guide', anomalyId],
    queryFn: () => repairApi.getGuide(anomalyId!),
    enabled: !!anomalyId,
  });

  if (!anomalyId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Repair Assistant & Diagnosis
              </h2>
              <p className="text-xs text-slate-400">Reliability engineering guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 text-red-500 text-sm">
              Failed to load repair diagnosis for this anomaly: {(error as Error).message}
            </div>
          )}

          {guide && (
            <>
              {/* Problem Identification */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-slate-400">
                    Rule ID: {guide.matchedRuleId}
                  </span>
                  <SeverityBadge severity={guide.severity} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {guide.problem}
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Identified Root Cause:{' '}
                  </span>
                  {guide.rootCause}
                </div>
              </div>

              {/* Sensor Metric Snapshot */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Sensor Readings at Anomaly Timestamp
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(guide.metrics || {}).map(([metric, val]) => (
                    <div
                      key={metric}
                      className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex justify-between"
                    >
                      <span className="text-slate-500 dark:text-slate-400 truncate">{metric}:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {typeof val === 'number' ? val.toFixed(2) : String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grounded AI Explanation */}
              {guide.aiExplanation && (
                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grounded Engineering Explanation (Claude AI)</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {guide.aiExplanation}
                  </p>
                </div>
              )}

              {/* Ordered Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Ordered Resolution Checklist
                </h4>
                <FixStepsList
                  steps={guide.orderedSteps}
                  safetyPrecaution={guide.safetyPrecaution}
                />
              </div>
            </>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
