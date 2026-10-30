import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useThemeStore } from '../../store/useThemeStore';

export const AppLayout: React.FC = () => {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

