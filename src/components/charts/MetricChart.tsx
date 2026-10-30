import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  Scatter,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { formatDate } from '../../utils/formatters';

interface DataPoint {
  timestamp: string;
  anomalyScore?: number;
  isAnomaly?: boolean;
  [metricKey: string]: any;
}

interface MetricChartProps {
  data: DataPoint[];
  metricKeys: string[];
  threshold?: number;
  showScoreTimeline?: boolean;
}

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ec4899', // pink
];

export const MetricChart: React.FC<MetricChartProps> = ({
  data,
  metricKeys,
  threshold = 0.5,
  showScoreTimeline = true,
}) => {
  // Visibility toggles per metric
  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    metricKeys.forEach((key, idx) => {
      initial[key] = idx < 3; // default show first 3 metrics
    });
    return initial;
  });

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Extract anomaly scatter points for marking red on the primary metric
  const primaryMetric = metricKeys[0];
  const anomalyScatterPoints = useMemo(() => {
    return data
      .filter((d) => d.isAnomaly)
      .map((d) => ({
        timestamp: d.timestamp,
        anomalyValue: d[primaryMetric],
      }));
  }, [data, primaryMetric]);

  return (
    <div className="space-y-4">
      {/* Metric Visibility Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1">Visible Metrics:</span>
        {metricKeys.map((key, idx) => {
          const isVisible = visibleMetrics[key];
          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          return (
            <button
              key={key}
              onClick={() => toggleMetric(key)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition select-none ${
                isVisible
                  ? 'border-transparent text-white shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 opacity-50 bg-slate-100 dark:bg-slate-800'
              }`}
              style={{ backgroundColor: isVisible ? color : undefined }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isVisible ? '#ffffff' : color }}
              />
              {key}
            </button>
          );
        })}
      </div>

      {/* Main Sensor Time-Series Chart */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sensor Telemetry (Red Dots = Anomalies on {primaryMetric})
          </h4>
          <span className="text-[11px] text-slate-400 italic">Drag bottom brush to zoom / pan</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) => formatDate(ts).split(',')[0]}
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                labelFormatter={(ts) => formatDate(String(ts))}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />

              {/* Individual Metric Lines */}
              {metricKeys.map((key, idx) => {
                if (!visibleMetrics[key]) return null;
                const strokeColor = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={key}
                    stroke={strokeColor}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                );
              })}

              {/* Anomaly Scatter Marker Dots (Red) */}
              <Scatter
                name="Anomaly Incident"
                data={anomalyScatterPoints}
                dataKey="anomalyValue"
                fill="#ef4444"
                shape="circle"
              />

              {/* Zoom & Brush Bar */}
              <Brush
                dataKey="timestamp"
                height={24}
                stroke="#3b82f6"
                fill="#0f172a"
                tickFormatter={() => ''}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Score Timeline Chart */}
      {showScoreTimeline && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Anomaly Score Timeline & Decision Threshold
            </h4>
            <span className="text-[11px] font-mono text-red-500 font-semibold">
              Threshold = {threshold.toFixed(2)}
            </span>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(ts) => formatDate(ts).split(',')[0]}
                  stroke="#64748b"
                  fontSize={10}
                />
                <YAxis domain={[0, 1]} stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                  labelFormatter={(ts) => formatDate(String(ts))}
                  formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Score']}
                />
                <ReferenceLine
                  y={threshold}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Threshold', fill: '#ef4444', fontSize: 10, position: 'insideTopLeft' }}
                />
                <Line
                  type="monotone"
                  dataKey="anomalyScore"
                  name="Anomaly Score"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

