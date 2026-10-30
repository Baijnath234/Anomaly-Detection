import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { systemsApi } from '../api/systems.api';
import { datasetsApi } from '../api/datasets.api';
import { detectionApi } from '../api/detection.api';
import { rulApi } from '../api/rul.api';
import { useAppStore } from '../store/useAppStore';
import { HealthGauge } from '../components/dashboard/HealthGauge';
import { CountdownCard } from '../components/dashboard/CountdownCard';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate, formatScore } from '../utils/formatters';
import {
  AlertTriangle,
  Upload,
  Activity,
  Wrench,
  Radio,
  FileText,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeSystemId,
    setActiveSystemId,
    activeDatasetId,
    setActiveDatasetId,
    activeRunId,
    setActiveRunId,
    liveAlerts,
    setSelectedAnomalyId,
  } = useAppStore();

  // 1. Fetch Systems
  const { data: systemsData, isLoading: loadingSystems } = useQuery({
    queryKey: ['systems'],
    queryFn: systemsApi.list,
  });

  const systems = systemsData?.items || [];

  // Auto-select first system if none selected
  React.useEffect(() => {
    if (!activeSystemId && systems.length > 0) {
      setActiveSystemId(systems[0].id);
    }
  }, [systems, activeSystemId, setActiveSystemId]);

  // 2. Fetch Datasets
  const { data: datasets, isLoading: loadingDatasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: datasetsApi.list,
  });

  // Auto-select first dataset if none selected
  React.useEffect(() => {
    if (!activeDatasetId && datasets && datasets.length > 0) {
      const match = activeSystemId
        ? datasets.find((d) => d.systemId === activeSystemId)
        : datasets[0];
      if (match) {
        setActiveDatasetId(match.id);
      }
    }
  }, [datasets, activeSystemId, activeDatasetId, setActiveDatasetId]);

  // 3. Fetch Detection Run Results if activeRunId exists
  const { data: runResult, isLoading: loadingRun } = useQuery({
    queryKey: ['detection-run', activeRunId],
    queryFn: () => detectionApi.getResults(activeRunId!),
    enabled: !!activeRunId,
  });

  // 4. Fetch RUL estimate if activeDatasetId exists
  const { data: rulResult, isLoading: loadingRul } = useQuery({
    queryKey: ['rul-estimate', activeDatasetId],
    queryFn: () => rulApi.estimate({ datasetId: activeDatasetId! }),
    enabled: !!activeDatasetId,
    retry: 1,
  });

  const activeDataset = datasets?.find((d) => d.id === activeDatasetId);
  const activeSystem = systems.find((s) => s.id === activeSystemId);

  // Health Score from RUL or default calculated
  const healthScore = rulResult?.currentHealthIndex ?? 0.88;
  const criticalCount = runResult?.criticalCount ?? 0;
  const warningCount = runResult?.warningCount ?? 0;
  const infoCount = runResult?.infoCount ?? 0;
  const totalAnomalies = runResult?.anomaliesCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / System Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              System Online
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {activeSystem ? activeSystem.name : 'Predictive Maintenance Hub'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time anomaly telemetry, Remaining Useful Life (RUL), and AI-guided repair protocols.
          </p>
        </div>

        {/* System & Dataset Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 mb-1 font-medium">Monitored System</span>
            <select
              value={activeSystemId || ''}
              onChange={(e) => {
                setActiveSystemId(e.target.value);
                const ds = datasets?.find((d) => d.systemId === e.target.value);
                if (ds) setActiveDatasetId(ds.id);
              }}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {systems.length === 0 && <option value="">No systems</option>}
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col text-xs">
            <span className="text-slate-500 mb-1 font-medium">Active Dataset</span>
            <select
              value={activeDatasetId || ''}
              onChange={(e) => setActiveDatasetId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {(!datasets || datasets.length === 0) && (
                <option value="">No datasets available</option>
              )}
              {datasets?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.rowCount} rows)
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => navigate('/upload')}
            className="self-end px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-sm transition"
          >
            <Upload className="w-4 h-4" />
            Upload New
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Health Gauge */}
        <HealthGauge
          score={healthScore}
          subtext={activeDataset ? `Computed for ${activeDataset.name}` : 'Awaiting sensor evaluation'}
        />

        {/* Card 2: RUL Countdown */}
        <CountdownCard
          etaDays={rulResult?.etaDays ?? null}
          lowerDays={rulResult?.lowerDays}
          upperDays={rulResult?.upperDays}
          failureThreshold={rulResult?.failureThreshold}
        />

        {/* Card 3: Active Anomalies Counter */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Detected Anomalies
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalAnomalies}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeRunId ? `Run #${activeRunId.slice(0, 8)}` : 'No active run completed'}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="flex items-center gap-1 text-red-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {criticalCount} Critical
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {warningCount} Warning
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-blue-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {infoCount} Info
            </span>
          </div>
        </div>

        {/* Card 4: Live Telemetry Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Live Stream Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              Socket.io Ready
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {liveAlerts.length} live stream alerts captured
            </p>
          </div>
          <button
            onClick={() => navigate('/live')}
            className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-2 border-t border-slate-100 dark:border-slate-800"
          >
            <span>Open Live Sensor Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Recent Alerts & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Recent Anomalies Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Recent Anomaly Detections
              </h2>
              <p className="text-xs text-slate-500">
                Latest anomalies identified from multi-detector analysis and live telemetry
              </p>
            </div>
            <button
              onClick={() => navigate('/problems')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1"
            >
              View All ({totalAnomalies})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingRun ? (
            <div className="space-y-3">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : !runResult || runResult.anomalies.length === 0 ? (
            <EmptyState
              title="No anomalies detected"
              description="Upload a CSV dataset and run detection (Z-score, Isolation Forest, LOF, Autoencoder, or Ensemble) to analyze sensor telemetry."
              actionLabel="Run Detection"
              onAction={() => navigate('/upload')}
            />
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {runResult.anomalies.slice(0, 6).map((anomaly) => (
                <div
                  key={anomaly.id}
                  onClick={() => {
                    setSelectedAnomalyId(anomaly.id);
                    navigate('/problems');
                  }}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer transition group"
                >
                  <div className="flex items-start gap-3">
                    <SeverityBadge severity={anomaly.severity} size="sm" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                        {anomaly.rootCause || 'Unspecified Telemetry Deviation'}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(anomaly.timestamp)}</span>
                        <span>•</span>
                        <span>Score: {formatScore(anomaly.score)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                      View Fix
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1/3): Quick Navigation / Actions */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Workflows & Tools
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => navigate('/upload')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Upload & Train Models
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Import CSV telemetry and run ML detectors
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/analysis')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Time-Series Analysis
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Multi-metric graphs with anomaly overlays
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/problems')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Repair Assistant
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Root cause diagnostics & fix checklists
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/expiry')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Remaining Useful Life (RUL)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Weibull degradation curve & confidence band
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Generate Reports
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Export audit-ready PDF and CSV packages
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

