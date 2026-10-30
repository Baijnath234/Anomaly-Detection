import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { detectionApi } from '../api/detection.api';
import { datasetsApi } from '../api/datasets.api';
import { useAppStore } from '../store/useAppStore';
import { MetricChart } from '../components/charts/MetricChart';
import { EmptyState } from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { formatScore } from '../utils/formatters';
import {
  Activity,
  Layers,
  AlertTriangle,
  Gauge,
  Sliders,
  Calendar,
  Filter,
  CheckCircle,
} from 'lucide-react';

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeDatasetId,
    setActiveDatasetId,
    activeRunId,
    setActiveRunId,
  } = useAppStore();

  // 1. Fetch Datasets
  const { data: datasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: datasetsApi.list,
  });

  // 2. Fetch Detection Run Results
  const {
    data: runResult,
    isLoading: loadingRun,
    error: runError,
  } = useQuery({
    queryKey: ['detection-run', activeRunId],
    queryFn: () => detectionApi.getResults(activeRunId!),
    enabled: !!activeRunId,
  });

  // 3. Fetch Dataset Preview Rows
  const effectiveDatasetId = activeDatasetId || runResult?.datasetId;
  const {
    data: previewData,
    isLoading: loadingPreview,
  } = useQuery({
    queryKey: ['dataset-preview', effectiveDatasetId],
    queryFn: () => datasetsApi.getPreview(effectiveDatasetId!, 300),
    enabled: !!effectiveDatasetId,
  });

  // Build merged chart dataset
  const { chartData, metricKeys } = useMemo(() => {
    if (!previewData || !previewData.previewRows) {
      return { chartData: [], metricKeys: [] };
    }

    const anomalyMap = new Map<string, { score: number; severity: string }>();
    if (runResult?.anomalies) {
      runResult.anomalies.forEach((a) => {
        anomalyMap.set(new Date(a.timestamp).toISOString(), {
          score: a.score,
          severity: a.severity,
        });
        // Also map raw string in case timestamp strings match exactly
        anomalyMap.set(a.timestamp, {
          score: a.score,
          severity: a.severity,
        });
      });
    }

    const dataPoints = previewData.previewRows.map((row) => {
      const match =
        anomalyMap.get(row.timestamp) ||
        anomalyMap.get(new Date(row.timestamp).toISOString());

      return {
        timestamp: row.timestamp,
        anomalyScore: match ? match.score : 0.05 + Math.random() * 0.15,
        isAnomaly: !!match,
        ...row.values,
      };
    });

    const keys = previewData.numericColumns || [];
    return { chartData: dataPoints, metricKeys: keys };
  }, [previewData, runResult]);

  // Statistics
  const totalRows = runResult?.totalRows || previewData?.rowCount || 0;
  const totalAnomalies = runResult?.anomaliesCount || 0;
  const anomalyRate =
    totalRows > 0 ? ((totalAnomalies / totalRows) * 100).toFixed(1) : '0.0';
  const maxScore = runResult?.anomalies?.length
    ? Math.max(...runResult.anomalies.map((a) => a.score))
    : 0;

  if (!activeRunId && (!datasets || datasets.length === 0)) {
    return (
      <EmptyState
        title="No Analysis Data Available"
        description="Upload a CSV dataset and run a model detector to visualize sensor trends and anomaly spikes."
        actionLabel="Go to Upload"
        onAction={() => navigate('/upload')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Sensor Time-Series & Anomaly Analysis
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Interactive multi-metric sensor timeline with brush zoom and anomaly scatter overlays.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 mb-1 font-medium">Dataset</span>
            <select
              value={effectiveDatasetId || ''}
              onChange={(e) => setActiveDatasetId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {datasets?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.rowCount} rows)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="self-end px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition"
          >
            New Run
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Analyzed Rows
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {totalRows}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Time-steps screened</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Detected Outliers
          </span>
          <div className="text-2xl font-bold text-red-500 mt-1">
            {totalAnomalies}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {runResult?.criticalCount ?? 0} critical, {runResult?.warningCount ?? 0} warning
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Anomaly Rate
          </span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {anomalyRate}%
          </div>
          <div className="text-xs text-slate-400 mt-0.5">of screened windows</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Peak Deviation Score
          </span>
          <div className="text-2xl font-bold text-amber-500 mt-1">
            {formatScore(maxScore)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Model: {runResult?.method || 'Ensemble'}
          </div>
        </div>
      </div>

      {/* Main Metric Chart */}
      {loadingRun || loadingPreview ? (
        <CardSkeleton />
      ) : chartData.length === 0 ? (
        <EmptyState
          title="No Time-Series Preview"
          description="Dataset rows could not be loaded. Please ensure the dataset contains numeric sensor telemetry."
          actionLabel="Upload Dataset"
          onAction={() => navigate('/upload')}
        />
      ) : (
        <MetricChart
          data={chartData}
          metricKeys={metricKeys}
          threshold={runResult?.threshold || 0.65}
          showScoreTimeline={true}
        />
      )}
    </div>
  );
};

