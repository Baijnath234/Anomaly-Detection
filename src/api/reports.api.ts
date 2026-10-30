import { apiClient, API_BASE_URL } from './client';
import { RunSummaryReport } from '../types';

export const reportsApi = {
  getSummary: async (runId: string): Promise<RunSummaryReport> => {
    const res = await apiClient.get(`/api/reports/summary/${runId}`);
    return res.data;
  },

  getCsvDownloadUrl: (runId: string): string => {
    return `${API_BASE_URL}/api/reports/anomalies/${runId}/csv`;
  },
};

