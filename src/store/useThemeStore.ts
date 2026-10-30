import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (val: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: true, // Default to dark mode for industrial dashboards
      toggleTheme: () => {
        const next = !get().isDark;
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark: next });
      },
      setDark: (val: boolean) => {
        if (val) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ isDark: val });
      },
    }),
    {
      name: 'anomaly-theme-preference',
    },
  ),
);

