import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import { useAppStore } from '../../store/useAppStore';
import { useAppDispatch, useAppSelector } from '../../features/common/hooks';
import { logout } from '../../features/common/authSlice';
import {
  Sun,
  Moon,
  Bell,
  ExternalLink,
  Trash2,
  Wifi,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';
import { formatDate } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { liveAlerts, clearLiveAlerts } = useAppStore();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
      } catch {}
      navigate('/login');
    }
  };

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

        {/* User Profile Pill & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-85 transition py-1"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
              AS
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Alex S.</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  AS
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Alex S.</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">alex.admin@detect.ai</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Shield className="w-2.5 h-2.5" /> Administrator
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 dark:hover:text-rose-300 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Quick Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign out of system"
          className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
