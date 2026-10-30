import { apiClient } from './client';
import { System } from '../types';

export const systemsApi = {
  list: async (): Promise<{ items: System[]; total: number }> => {
    const res = await apiClient.get('/api/systems');
    return res.data;
  },

  create: async (data: { name: string; type: string }): Promise<System> => {
    const res = await apiClient.post('/api/systems', data);
    return res.data;
  },

  getById: async (id: string): Promise<System> => {
    const res = await apiClient.get(`/api/systems/${id}`);
    return res.data;
  },
};

