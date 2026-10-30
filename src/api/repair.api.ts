import { apiClient } from './client';
import { RepairGuide } from '../types';

export const repairApi = {
  getGuide: async (anomalyId: string): Promise<RepairGuide> => {
    const res = await apiClient.get(`/api/repair/${anomalyId}`);
    return res.data;
  },
};

