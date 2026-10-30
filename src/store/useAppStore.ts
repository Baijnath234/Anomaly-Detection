import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LiveAnomalyEvent } from '../types';

interface AppState {
  activeSystemId: string | null;
  activeDatasetId: string | null;
  activeRunId: string | null;
  selectedAnomalyId: string | null;
  liveAlerts: LiveAnomalyEvent[];
  
  setActiveSystemId: (id: string | null) => void;
  setActiveDatasetId: (id: string | null) => void;
  setActiveRunId: (id: string | null) => void;
  setSelectedAnomalyId: (id: string | null) => void;
  addLiveAlert: (alert: LiveAnomalyEvent) => void;
  clearLiveAlerts: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSystemId: null,
      activeDatasetId: null,
      activeRunId: null,
      selectedAnomalyId: null,
      liveAlerts: [],

      setActiveSystemId: (id) => set({ activeSystemId: id }),
      setActiveDatasetId: (id) => set({ activeDatasetId: id }),
      setActiveRunId: (id) => set({ activeRunId: id }),
      setSelectedAnomalyId: (id) => set({ selectedAnomalyId: id }),
      addLiveAlert: (alert) =>
        set((state) => ({
          liveAlerts: [alert, ...state.liveAlerts].slice(0, 50), // keep latest 50
        })),
      clearLiveAlerts: () => set({ liveAlerts: [] }),
    }),
    {
      name: 'anomaly-app-store',
      partialize: (state) => ({
        activeSystemId: state.activeSystemId,
        activeDatasetId: state.activeDatasetId,
        activeRunId: state.activeRunId,
      }),
    },
  ),
);
