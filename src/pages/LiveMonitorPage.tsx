import React, { useState, useEffect } from 'react';
import { useLiveStream } from '../hooks/useLiveStream';
import { useAppStore } from '../store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { systemsApi } from '../api/systems.api';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { formatDate, formatScore } from '../utils/formatters';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Radio,
  Play,
  Square,
  AlertTriangle,
  Activity,
  Trash2,
  Flame,
  Gauge,
  RotateCw,
} from 'lucide-react';

export const LiveMonitorPage: React.FC = () => {
  const { activeSystemId, liveAlerts, clearLiveAlerts } =
    useAppStore();

  // Systems
  const { data: systemsData } = useQuery({
    queryKey: ['systems'],
    queryFn: systemsApi.list,
  });

  const systems = systemsData?.items || [];
  const activeSystem = systems.find((s) => s.id === activeSystemId) || systems[0];

  const {
    isConnected,
    lastAnomaly,
    streamPoints,
    bufferSize,
    isSimulating,
    startSimulation,
    stopSimulation,
  } = useLiveStream(activeSystem?.id);

  // Active toast banner for the latest anomaly
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    if (lastAnomaly) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastAnomaly]);

  // Current reading snapshot (latest point)
  const latestReading = streamPoints[streamPoints.length - 1];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {showToast && lastAnomaly && (
        <div className="fixed top-20 right-6 z-50 bg-white dark:bg-slate-900 border-2 border-red-500 rounded-xl p-4 shadow-2xl max-w-sm animate-bounce">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                  Live Outlier Alert!
                </span>
                <SeverityBadge severity={lastAnomaly.severity} size="sm" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Anomaly detected on System {lastAnomaly.systemId?.slice(0, 8)}: Score{' '}
                <span className="font-bold">{lastAnomaly.score}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Live Sensor Telemetry & Anomaly Stream
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time sliding window anomaly detection powered by NestJS WebSocket gateway (`/live`).
          </p>
        </div>

        {/* Connection status & simulation trigger */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs">
            {isConnected ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Connected
                </span>
                <span className="text-slate-400">({bufferSize}/50 buffer)</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="font-semibold text-rose-500">Disconnected</span>
              </>
            )}
          </div>

          {isSimulating ? (
            <button
              onClick={stopSimulation}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Stop Stream
            </button>
          ) : (
            <button
              onClick={() => startSimulation(activeSystem?.id || 'demo-system')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Live Simulation
            </button>
          )}
        </div>
      </div>

      {/* Sensor Snapshot Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Temperature</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {latestReading?.temperature ? `${latestReading.temperature} °C` : '--'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Vibration</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {latestReading?.vibration ? `${latestReading.vibration} g` : '--'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Pressure</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {latestReading?.pressure ? `${latestReading.pressure} kPa` : '--'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Speed (RPM)</span>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {latestReading?.rpm ? `${latestReading.rpm} RPM` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Sliding Window Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Sliding Window Sensor Stream (Last 40 Points)
            </h2>
            <p className="text-xs text-slate-500">
              Continuous readings streamed over WebSocket connection
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-600 dark:text-slate-400">
            {streamPoints.length} points
          </span>
        </div>

        {streamPoints.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
            <Radio className="w-8 h-8 mb-2 opacity-50" />
            <span>Click &ldquo;Start Live Simulation&rdquo; above to stream mock telemetry data</span>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={streamPoints}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  name="Temperature (°C)"
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  name="Vibration (g)"
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Pressure (kPa)"
                />
                <Line
                  type="monotone"
                  dataKey="rpm"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  name="RPM / 10"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Live Stream Anomaly Event Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Stream Anomaly Log ({liveAlerts.length})
            </h2>
          </div>
          {liveAlerts.length > 0 && (
            <button
              onClick={clearLiveAlerts}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Log
            </button>
          )}
        </div>

        {liveAlerts.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No real-time anomalies detected yet. Keep the stream running to observe outlier spikes.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
            {liveAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="py-2.5 px-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded transition"
              >
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Score: {formatScore(alert.score)}
                    </span>
                    <span className="text-slate-400 ml-2">
                      System: {alert.systemId}
                    </span>
                  </div>
                </div>
                <div className="text-slate-400 font-mono">
                  {formatDate(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
