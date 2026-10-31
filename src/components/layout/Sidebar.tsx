import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  LineChart,
  Wrench,
  Hourglass,
  Radio,
  FileText,
  Activity,
  Zap,
  Sliders,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Smart Electrical', path: '/electrical', icon: Zap },
  { label: 'Home Automation', path: '/automation', icon: Sliders },
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Upload & Configure', path: '/upload', icon: UploadCloud },
  { label: 'Analysis', path: '/analysis', icon: LineChart },
  { label: 'Problems & Repair', path: '/problems', icon: Wrench },
  { label: 'Time to Expiry', path: '/expiry', icon: Hourglass },
  { label: 'Live Monitor', path: '/live', icon: Radio },
  { label: 'Reports', path: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen flex-shrink-0 z-20">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-slate-50 uppercase">
              DETECT<span className="text-blue-500">.AI</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Repair Assistant
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          Predictive Maintenance v2.0
        </div>
        <div>NestJS + TF.js + RUL Engine</div>
      </div>
    </aside>
  );
};

