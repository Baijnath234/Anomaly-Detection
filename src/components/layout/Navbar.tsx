import React, { useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAppStore } from '../../store/useAppStore';
import {
  Sun,
  Moon,
  Bell,
  ExternalLink,
  Trash2,
  Wifi,
  User,
} from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { formatDate } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { liveAlerts, clearLiveAlerts } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
      {/* Left side: System Status Breadcrumb */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Systems Online
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Turbine & Compressor Fleet Telemetry Active
        </span>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-3">
        {/* Live ESP32 Device Connection Status */}
        <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Wifi className="w-3.5 h-3.5" />
          <span>ESP32: Connected (24ms)</span>
        </span>

        {/* Swagger Docs Link */}
        <a
          href="http://localhost:3000/docs"
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <span>API Docs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Live Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Bell className="w-4 h-4" />
            {liveAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 text-xs z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  Real-time Alerts ({liveAlerts.length})
                </span>
                {liveAlerts.length > 0 && (
                  <button
                    onClick={clearLiveAlerts}
                    className="text-slate-400 hover:text-red-500 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {liveAlerts.length === 0 ? (
                  <p className="text-slate-400 text-center py-4 italic">
                    No active stream alerts
                  </p>
                ) : (
                  liveAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <SeverityBadge severity={alert.severity} size="sm" />
                        <span className="text-[10px] text-slate-400">
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                        Score: {(alert.score * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
            AS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Alex S.</p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
