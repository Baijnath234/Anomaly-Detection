import React, { useState } from 'react';
import {
  Clock,
  Sliders,
  ShieldAlert,
  Wrench,
  Plus,
  CheckCircle2,
  Calendar,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

interface ScheduleItem {
  id: string;
  name: string;
  device: string;
  time: string;
  days: string;
  action: 'ON' | 'OFF';
  isEnabled: boolean;
}

interface AlertRuleItem {
  id: string;
  name: string;
  parameter: string;
  condition: string;
  threshold: number;
  severity: 'WARNING' | 'CRITICAL';
}

interface MaintenanceTicketItem {
  id: string;
  title: string;
  circuit: string;
  technician?: string;
  priority: 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
  createdAt: string;
}

export const SmartAutomationPage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    { id: 'sch-1', name: 'Morning Water Heater', device: 'Water Geyser (25L)', time: '06:15 AM', days: 'Mon, Tue, Wed, Thu, Fri', action: 'ON', isEnabled: true },
    { id: 'sch-2', name: 'Evening Porch Lights', device: 'Living Room Ambient Lights', time: '06:45 PM', days: 'Daily', action: 'ON', isEnabled: true },
    { id: 'sch-3', name: 'Night AC Eco Mode', device: 'Master AC', time: '02:00 AM', days: 'Daily', action: 'OFF', isEnabled: false },
  ]);

  const [rules, setRules] = useState<AlertRuleItem[]>([
    { id: 'r-1', name: 'Breaker C-01 Continuous Overload Rule', parameter: 'CURRENT_RMS', condition: '> 16.0 A (for 60s)', threshold: 16.0, severity: 'CRITICAL' },
    { id: 'r-2', name: 'Distribution Board Terminal Overheat Warning', parameter: 'TEMPERATURE', condition: '> 65.0 °C', threshold: 65.0, severity: 'CRITICAL' },
    { id: 'r-3', name: 'RCD Earth Leakage Pre-trip Warning', parameter: 'LEAKAGE_MA', condition: '> 15.0 mA', threshold: 15.0, severity: 'WARNING' },
    { id: 'r-4', name: 'Contact Micro-Arcing Spectral Variance Jitter', parameter: 'POWER_FACTOR', condition: '< 0.75 under load', threshold: 0.75, severity: 'WARNING' },
  ]);

  const [tickets, setTickets] = useState<MaintenanceTicketItem[]>([
    { id: 'tk-1', title: 'Retorque Loose Busbar Terminal Screws', circuit: 'Circuit C-04 (Living Room AC)', technician: 'Marcus Vance, Master Electrician', priority: 'HIGH', status: 'ASSIGNED', createdAt: 'Today, 10:15 AM' },
    { id: 'tk-2', title: 'Inspect Refrigerator Inrush Surge Variance', circuit: 'Circuit C-02 (Kitchen Power)', technician: undefined, priority: 'MEDIUM', status: 'OPEN', createdAt: 'Yesterday' },
  ]);

  const handleToggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleAssignTechnician = (ticketId: string) => {
    const tech = prompt('Enter Certified Electrician Name:', 'John Miller, Licensed Electrician');
    if (tech) {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, technician: tech, status: 'ASSIGNED' } : t))
      );
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'RESOLVED' } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-500" />
            Smart Automation, Schedules & Alert Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic electrical threshold alerts, operating schedules, and dispatch electrician tickets
          </p>
        </div>
      </div>

      {/* Grid: Schedules & Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Schedules */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Appliance Operating Schedules
            </h2>
            <span className="text-xs text-slate-400">{schedules.length} Timers Active</span>
          </div>

          <div className="space-y-3">
            {schedules.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.device} • <span className="text-blue-500 font-semibold">{item.time}</span> ({item.days})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.action === 'ON' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Action: {item.action}
                  </span>
                  <button
                    onClick={() => handleToggleSchedule(item.id)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
                      item.isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Alert Rules */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Configurable Multi-Variable Alert Rules
            </h2>
            <span className="text-xs text-slate-400">IEC Standard Hysteresis</span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rule.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Trigger condition: <code className="text-amber-500 font-mono">{rule.condition}</code>
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    rule.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                >
                  {rule.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Maintenance Service Tickets */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-500" /> Maintenance Service Tickets & Electrician Dispatch
            </h2>
            <p className="text-xs text-slate-400">Track professional electrical repair tickets generated by AI diagnostics</p>
          </div>
          <span className="text-xs text-slate-400">{tickets.length} Registered</span>
        </div>

        <div className="space-y-3">
          {tickets.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    {t.priority}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.circuit} • Created {t.createdAt}
                  {t.technician && <span className="text-slate-200 font-semibold"> • Assigned to: {t.technician}</span>}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {t.status !== 'RESOLVED' && (
                  <>
                    {!t.technician && (
                      <button
                        onClick={() => handleAssignTechnician(t.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Assign Electrician
                      </button>
                    )}
                    <button
                      onClick={() => handleResolveTicket(t.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                    </button>
                  </>
                )}
                {t.status === 'RESOLVED' && (
                  <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Work Complete
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

