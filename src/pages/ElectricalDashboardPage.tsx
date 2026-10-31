import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Thermometer,
  Power,
  RotateCw,
  Home,
  CheckCircle2,
  Clock,
  Wrench,
  Search,
  Bell,
  Volume2,
  AlertOctagon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { electricalApi, ElectricalFault, ComponentHealth } from '../api/electrical.api';

interface DeviceState {
  id: string;
  name: string;
  room: string;
  category: string;
  ratedWatts: number;
  state: 'ON' | 'OFF';
  moduleId: string;
  homeId: string;
  hasProblem?: boolean;
}

const INITIAL_DEVICES: DeviceState[] = [
  { id: 'dev-1', name: 'Main Light', room: 'Living Room', category: 'LIGHT', ratedWatts: 60, state: 'ON', moduleId: 'ESP32_LR_01', homeId: 'home_alpha_01' },
  { id: 'dev-2', name: 'Warm Recessed Spotlights', room: 'Living Room', category: 'LIGHT', ratedWatts: 40, state: 'ON', moduleId: 'ESP32_LR_01', homeId: 'home_alpha_01' },
  { id: 'dev-3', name: 'Ceiling Fan', room: 'Living Room', category: 'FAN', ratedWatts: 75, state: 'ON', moduleId: 'ESP32_LR_01', homeId: 'home_alpha_01' },
  { id: 'dev-4', name: 'Socket', room: 'Living Room', category: 'SOCKET', ratedWatts: 65, state: 'OFF', moduleId: 'ESP32_LR_01', homeId: 'home_alpha_01' },
  { id: 'dev-5', name: 'Dual Inverter AC (1.5 Ton)', room: 'Living Room', category: 'AC', ratedWatts: 1850, state: 'ON', moduleId: 'ESP32_LR_02', homeId: 'home_alpha_01' },
  { id: 'dev-8', name: 'Bedside Light', room: 'Master Bedroom', category: 'LIGHT', ratedWatts: 20, state: 'OFF', moduleId: 'ESP32_BR_01', homeId: 'home_alpha_01' },
  { id: 'dev-9', name: 'Silent BLDC Ceiling Fan', room: 'Master Bedroom', category: 'FAN', ratedWatts: 35, state: 'ON', moduleId: 'ESP32_BR_01', homeId: 'home_alpha_01' },
  { id: 'dev-13', name: 'Inverter Refrigerator', room: 'Kitchen', category: 'REFRIGERATOR', ratedWatts: 250, state: 'ON', moduleId: 'ESP32_KT_01', homeId: 'home_alpha_01' },
  { id: 'dev-18', name: 'Instant Water Geyser (25L)', room: 'Bathroom', category: 'HEATER', ratedWatts: 2000, state: 'OFF', moduleId: 'ESP32_BT_01', homeId: 'home_alpha_01', hasProblem: true },
];

export const ElectricalDashboardPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceState[]>(INITIAL_DEVICES);
  const [faults, setFaults] = useState<ElectricalFault[]>([]);
  const [healthRecords, setHealthRecords] = useState<ComponentHealth[]>([]);
  const [isEmergencyCutOffActive, setIsEmergencyCutOffActive] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [deviceSearchId, setDeviceSearchId] = useState('');
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'NOTIFICATIONS'>('ALERTS');

  // Live Electrical Telemetry State
  const [telemetry, setTelemetry] = useState({
    voltage: 230.0,
    current: 10.4,
    power: 2400.0,
    frequency: 50.01,
    temperature: 32.0,
    leakageMa: 1.85,
    todayKwh: 8.6,
    overallHealth: 94,
  });

  // Chart Data buffer (last 20 seconds)
  const [chartData, setChartData] = useState<any[]>([]);

  // Simulation tick for dynamic live gauges
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (isEmergencyCutOffActive) {
        setTelemetry((prev) => ({ ...prev, voltage: 0, current: 0, power: 0 }));
        return;
      }

      // Calculate total active load based on ON devices
      const activeWatts = devices
        .filter((d) => d.state === 'ON')
        .reduce((sum, d) => sum + d.ratedWatts, 0);

      const jitterV = 230.0 + (Math.random() * 2 - 1.0);
      const computedCurrent = Math.round(((activeWatts / jitterV) + (Math.random() * 0.1)) * 10) / 10;
      const computedPower = Math.round(jitterV * computedCurrent);

      setTelemetry((prev) => ({
        ...prev,
        voltage: Math.round(jitterV * 10) / 10,
        current: computedCurrent || 10.4,
        power: computedPower || 2400,
        temperature: Math.round((31.5 + (computedCurrent || 10) * 0.1) * 10) / 10,
        leakageMa: Math.round((1.6 + Math.random() * 0.3) * 100) / 100,
      }));

      setChartData((prev) => {
        const next = [
          ...prev,
          {
            time: timeStr,
            voltage: Math.round(jitterV * 10) / 10,
            current: computedCurrent || 10.4,
            power: computedPower || 2400,
          },
        ];
        return next.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [devices, isEmergencyCutOffActive]);

  // Fetch initial faults and health records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeFaults, health] = await Promise.allSettled([
          electricalApi.getActiveFaults(),
          electricalApi.getHealthOverview(),
        ]);
        if (activeFaults.status === 'fulfilled') setFaults(activeFaults.value);
        if (health.status === 'fulfilled') setHealthRecords(health.value);
      } catch {
        // Fallback simulation
      }
    };
    fetchData();
  }, []);

  const handleToggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === deviceId
          ? { ...dev, state: dev.state === 'ON' ? 'OFF' : 'ON' }
          : dev
      )
    );
    const target = devices.find((d) => d.id === deviceId);
    if (target) {
      electricalApi.toggleDevice(deviceId, target.state === 'ON' ? 'OFF' : 'ON').catch(() => {});
    }
  };

  const handleExecuteScene = (sceneName: string) => {
    if (sceneName === 'ALL_OFF') {
      setDevices((prev) => prev.map((d) => ({ ...d, state: 'OFF' })));
    } else if (sceneName === 'ALL_ON') {
      setDevices((prev) => prev.map((d) => ({ ...d, state: 'ON' })));
    }
  };

  const handleEmergencyCutOff = () => {
    setIsEmergencyCutOffActive(true);
    setDevices((prev) => prev.map((d) => ({ ...d, state: 'OFF' })));
  };

  const handleResetEmergencyCutOff = () => {
    setIsEmergencyCutOffActive(false);
  };

  // Filtered devices for investigation search
  const filteredDevices = devices.filter(
    (d) =>
      d.id.toLowerCase().includes(deviceSearchId.toLowerCase()) ||
      d.name.toLowerCase().includes(deviceSearchId.toLowerCase()) ||
      d.moduleId.toLowerCase().includes(deviceSearchId.toLowerCase()) ||
      d.room.toLowerCase().includes(deviceSearchId.toLowerCase())
  );

  const activeCount = devices.filter((d) => d.state === 'ON').length;
  const inactiveCount = devices.filter((d) => d.state === 'OFF').length;
  const problemCount = devices.filter((d) => d.hasProblem).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Emergency Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isEmergencyCutOffActive ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-500" />
              Centralised Electrical Safety & Home Automation Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Registered Home: <strong className="text-slate-700 dark:text-slate-300">Sunset Villa Alpha (Home ID: home_alpha_01)</strong> • ESP32 Master Gateway Connected
          </p>
        </div>

        {/* Emergency Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSirenActive(!sirenActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              sirenActive
                ? 'bg-rose-600 text-white border-rose-700 animate-bounce'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            {sirenActive ? 'SIREN ACTIVE (95dB)' : 'Test Siren'}
          </button>

          <button
            onClick={isEmergencyCutOffActive ? handleResetEmergencyCutOff : handleEmergencyCutOff}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide text-white transition-all flex items-center gap-1.5 shadow-sm ${
              isEmergencyCutOffActive
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            {isEmergencyCutOffActive ? 'RESTORE POWER' : 'EMERGENCY CUT-OFF 🛑'}
          </button>
        </div>
      </div>

      {/* Centralized Device Connectivity & Operational Health Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Connected */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Connected</p>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-50 mt-1">
            20 <span className="text-xs font-semibold text-slate-400">Devices</span>
          </div>
          <p className="text-[10px] text-blue-500 font-semibold mt-1">6 Active Switchboard Modules</p>
        </div>

        {/* Active Drawing Load */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Devices</p>
          <div className="text-2xl font-black text-emerald-500 mt-1">
            {activeCount} <span className="text-xs font-semibold text-slate-400">Running</span>
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Drawing {telemetry.power}W active load</p>
        </div>

        {/* Inactive Standby */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inactive Devices</p>
          <div className="text-2xl font-black text-slate-600 dark:text-slate-300 mt-1">
            {inactiveCount} <span className="text-xs font-semibold text-slate-400">Standby</span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Relays open • Zero idle waste</p>
        </div>

        {/* Experiencing Problems */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Safety Status</p>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {problemCount} <span className="text-xs font-semibold text-slate-400">Warning</span>
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">0 Critical • Auto Cut-Off Armed</p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Live Power */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Live Power</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
            {(telemetry.power / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
          </div>
          <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
            Today: {telemetry.todayKwh} kWh consumed
          </p>
        </div>

        {/* Voltage */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Mains Voltage</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
            {telemetry.voltage} <span className="text-xs font-normal text-slate-400">V RMS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Grid Freq: {telemetry.frequency} Hz (Nominal)</p>
        </div>

        {/* Current & Load */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Feeder Current</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-50">
            {telemetry.current} <span className="text-xs font-normal text-slate-400">A RMS</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Rated limit: 63A Breaker</p>
        </div>

        {/* Health & Safety */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Asset Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-500">
            {telemetry.overallHealth}% <span className="text-xs font-normal text-slate-400">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Busbar: {telemetry.temperature}°C | Leakage: {telemetry.leakageMa} mA
          </p>
        </div>
      </div>

      {/* Real-time Telemetry Waveform */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Live Electrical Telemetry Stream (True RMS & Current Load)
            </h2>
            <p className="text-xs text-slate-400">Continuous 1 Hz sampling via isolated CT & voltage sensor</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            EMQX 5.8 MQTT LIVE
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#0284c7" fontSize={11} domain={[0, 25]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="current"
                name="Current (A)"
                stroke="#0284c7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#currentGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Administrator Device ID Investigation & Switchboard Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-500" /> Connected Devices & Module Control
              </h2>
              <p className="text-xs text-slate-400">Direct switchboard latching relay actuation</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Device ID..."
                value={deviceSearchId}
                onChange={(e) => setDeviceSearchId(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredDevices.map((device) => {
              const isOn = device.state === 'ON';
              return (
                <div
                  key={device.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    device.hasProblem
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : isOn
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${isOn ? 'text-amber-500' : 'text-slate-400'}`} />
                      {device.name}
                      {device.hasProblem && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                          ATTENTION
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {device.room} • ID: <code className="font-mono text-slate-600 dark:text-slate-300">{device.id}</code> • Module: <code className="font-mono text-slate-600 dark:text-slate-300">{device.moduleId}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOn
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isOn ? `${device.ratedWatts}W ON` : 'OFF'}
                    </span>
                    <button
                      onClick={() => handleToggleDevice(device.id)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        isOn ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          isOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10 Core Safety Fault Detection Engines & Alerts Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Electrical Fault Detection (10 Categories)
              </h2>
              <p className="text-xs text-slate-400">Continuous AI sensor diagnostics and auto-cutoff rules</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-200 dark:border-emerald-900">
              PROTECTION ARMED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {[
              { id: 1, name: 'Power Cut-Off', status: 'ARMED (SSR)', safe: true },
              { id: 2, name: 'Emergency Siren', status: 'STANDBY (95dB)', safe: true },
              { id: 3, name: 'Wire Disconnect', status: 'LOOP CLOSED', safe: true },
              { id: 4, name: 'Loose Connection', status: '<0.02Ω SAFE', safe: true },
              { id: 5, name: 'Circuit Overload', status: '10.4A / 63A', safe: true },
              { id: 6, name: 'Phase Imbalance', status: '<2.1% BALANCED', safe: true },
              { id: 7, name: 'Corroded Terminal', status: 'NORMAL', safe: true },
              { id: 8, name: 'Abnormal Voltage', status: '230V NOMINAL', safe: true },
              { id: 9, name: 'Overheating', status: '32°C SAFE', safe: true },
              { id: 10, name: 'Earth Leakage', status: '1.85mA (RCD: 30mA)', safe: true },
            ].map((rule) => (
              <div key={rule.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">#{rule.id} {rule.name}</span>
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">{rule.status}</span>
              </div>
            ))}
          </div>

          {/* Active Alert Notification Sample */}
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> High-Priority Alert: Earth Leakage Triggered
              </span>
              <span className="text-[10px] text-slate-400 font-mono">dev-18 • Bathroom</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Water Geyser residual earth leakage recorded 34.2 mA (Limit: 30.0 mA). Auto Power Cut-Off disconnected the circuit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
