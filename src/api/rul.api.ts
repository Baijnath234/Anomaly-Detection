import { apiClient } from './client';
import { RulResult } from '../types';

export const rulApi = {
  estimate: async (params: {
    datasetId: string;
    failureThreshold?: number;
  }): Promise<RulResult> => {
    const res = await apiClient.post('/api/rul/estimate', params);
    return res.data;
  },
};

