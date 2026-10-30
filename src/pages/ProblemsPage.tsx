import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { detectionApi } from '../api/detection.api';
import { useAppStore } from '../store/useAppStore';
import { AnomalyTable } from '../components/tables/AnomalyTable';
import { RepairSidePanel } from '../components/repair/RepairSidePanel';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { Wrench, ShieldCheck } from 'lucide-react';

export const ProblemsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRunId,
    selectedAnomalyId,
    setSelectedAnomalyId,
  } = useAppStore();

  // Fetch results for current run
  const {
    data: runResult,
    isLoading,
  } = useQuery({
    queryKey: ['detection-run', activeRunId],
    queryFn: () => detectionApi.getResults(activeRunId!),
    enabled: !!activeRunId,
  });

  const anomalies = runResult?.anomalies || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Problems & Repair Assistant
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritized equipment failures with deterministic rules, safety protocols, and Claude AI explanations.
          </p>
        </div>

        {activeRunId && (
          <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300">
            Active Run: <span className="font-mono font-bold">{activeRunId.slice(0, 10)}...</span>
          </div>
        )}
      </div>

      {/* Guide Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 dark:text-blue-200 space-y-0.5">
          <span className="font-bold">Automated Repair Workflow:</span>
          <p className="text-blue-800 dark:text-blue-300">
            Click on any anomaly below to open its diagnostic drawer. Each guide matches industrial rule specifications (`rules.json`) and delivers a step-by-step resolution checklist with AI context.
          </p>
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {isLoading ? (
        <CardSkeleton />
      ) : !activeRunId || anomalies.length === 0 ? (
        <EmptyState
          title="No Anomaly Incidents Found"
          description="There are currently no flagged anomalies for this run, or no detection has been triggered yet."
          actionLabel="Run Detection"
          onAction={() => navigate('/upload')}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <AnomalyTable
            anomalies={anomalies}
            onSelectAnomaly={(id) => setSelectedAnomalyId(id)}
          />
        </div>
      )}

      {/* Slide-over Repair Assistant Drawer */}
      <RepairSidePanel
        anomalyId={selectedAnomalyId}
        onClose={() => setSelectedAnomalyId(null)}
      />
    </div>
  );
};
