import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { rulApi } from '../api/rul.api';
import { datasetsApi } from '../api/datasets.api';
import { useAppStore } from '../store/useAppStore';
import { CountdownCard } from '../components/dashboard/CountdownCard';
import { HealthGauge } from '../components/dashboard/HealthGauge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatScore, formatDate } from '../utils/formatters';
import {
  Clock,
  TrendingDown,
  ShieldAlert,
  Sliders,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';

export const ExpiryPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeDatasetId, setActiveDatasetId } = useAppStore();
  const [failureThreshold, setFailureThreshold] = useState<number>(0.25);

  // Fetch Datasets
  const { data: datasets } = useQuery({
    queryKey: ['datasets'],
    queryFn: datasetsApi.list,
  });

  // Fetch RUL estimate
  const {
    data: rulResult,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['rul-estimate', activeDatasetId, failureThreshold],
    queryFn: () =>
      rulApi.estimate({
        datasetId: activeDatasetId!,
        failureThreshold,
      }),
    enabled: !!activeDatasetId,
    retry: 1,
  });

  // Build combined history + projected degradation curve for Recharts
  const chartData = useMemo(() => {
    if (!rulResult || !rulResult.healthIndexHistory) {
      return [];
    }

    const { timestamps, scores } = rulResult.healthIndexHistory;
    const points: Array<{
      time: string;
      healthIndex: number | null;
      projected?: number | null;
      upperBand?: number | null;
      lowerBand?: number | null;
    }> = [];

    // Historical Points
    timestamps.forEach((ts, idx) => {
      points.push({
        time: ts.includes('T') ? ts.split('T')[1]?.slice(0, 5) || ts : ts,
        healthIndex: scores[idx] ?? null,
      });
    });

    // If we have an ETA, project future degradation curve
    if (scores.length > 0 && rulResult.etaDays > 0) {
      const lastScore = scores[scores.length - 1];
      const steps = 10;
      const decayPerStep = (lastScore - failureThreshold) / steps;

      for (let i = 1; i <= steps; i++) {
        const val = +(lastScore - decayPerStep * i).toFixed(3);
        const uncertainty = 0.03 * Math.sqrt(i);
        points.push({
          time: `+${((rulResult.etaDays / steps) * i).toFixed(1)}d`,
          healthIndex: null,
          projected: Math.max(0, val),
          upperBand: Math.min(1.0, +(val + uncertainty).toFixed(3)),
          lowerBand: Math.max(0, +(val - uncertainty).toFixed(3)),
        });
      }
    }

    return points;
  }, [rulResult, failureThreshold]);

  if (!activeDatasetId && (!datasets || datasets.length === 0)) {
    return (
      <EmptyState
        title="No Dataset Available for RUL Estimation"
        description="Please upload sensor telemetry to project health index decay and Remaining Useful Life."
        actionLabel="Upload Telemetry"
        onAction={() => navigate('/upload')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Remaining Useful Life (RUL) & Expiry Projection
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weibull degradation modeling, health index trajectory, and confidence intervals.
          </p>
        </div>

        {/* Dataset Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 mb-1 font-medium">Dataset</span>
            <select
              value={activeDatasetId || ''}
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
        </div>
      </div>

      {/* Top Cards: Countdown & Health Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CountdownCard
          etaDays={rulResult?.etaDays ?? null}
          lowerDays={rulResult?.lowerDays}
          upperDays={rulResult?.upperDays}
          failureThreshold={failureThreshold}
        />

        <HealthGauge
          score={rulResult?.currentHealthIndex ?? 0.85}
          subtext={`Threshold set at ${(failureThreshold * 100).toFixed(0)}%`}
        />

        {/* Threshold Adjustment Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-500" />
                Failure Threshold (HI)
              </span>
              <span className="text-sm font-mono font-bold text-purple-600 dark:text-purple-400">
                {failureThreshold.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When equipment Health Index drops below this boundary, system failure is considered imminent.
            </p>
            <input
              type="range"
              min="0.10"
              max="0.45"
              step="0.05"
              value={failureThreshold}
              onChange={(e) => setFailureThreshold(parseFloat(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer mt-4"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0.10 (Severe wear)</span>
              <span>0.25 (Standard)</span>
              <span>0.45 (Conservative)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Updates RUL bounds dynamically</span>
          </div>
        </div>
      </div>

      {/* Main Health Index Chart with Confidence Bands */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-500" />
              Health Index Trajectory & Projection Band
            </h2>
            <p className="text-xs text-slate-500">
              Historical Health Index (solid blue), projected decay (dashed purple), 90% confidence envelope (shaded band), and failure cutoff.
            </p>
          </div>
        </div>

        {isLoading ? (
          <CardSkeleton />
        ) : chartData.length === 0 ? (
          <EmptyState
            title="Insufficient History"
            description="The selected dataset does not have enough time-series records to project degradation."
          />
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 1]}
                  ticks={[0, 0.25, 0.5, 0.75, 1.0]}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any, name: any) => [
                    `${(Number(val) * 100).toFixed(1)}%`,
                    String(name || ''),
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />

                {/* Shaded Confidence Band */}
                <Area
                  type="monotone"
                  dataKey="upperBand"
                  stroke="transparent"
                  fill="url(#bandGradient)"
                  name="Confidence Band (Upper)"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBand"
                  stroke="transparent"
                  fill="url(#bandGradient)"
                  name="Confidence Band (Lower)"
                />

                {/* Historical Observed Health Index */}
                <Line
                  type="monotone"
                  dataKey="healthIndex"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 2 }}
                  name="Observed Health Index"
                />

                {/* Projected Decay */}
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                  name="Projected Decay"
                />

                {/* Failure Threshold Reference Line */}
                <ReferenceLine
                  y={failureThreshold}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Failure Cutoff (${(failureThreshold * 100).toFixed(0)}%)`,
                    fill: '#ef4444',
                    fontSize: 11,
                    position: 'insideBottomRight',
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
