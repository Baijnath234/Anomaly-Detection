import { apiClient } from './client';
import { Dataset, DatasetPreview } from '../types';

export const datasetsApi = {
  upload: async (
    file: File,
    systemId?: string,
    name?: string,
    timestampColumn?: string,
  ): Promise<Dataset> => {
    const formData = new FormData();
    formData.append('file', file);
    if (systemId) {
      formData.append('systemId', systemId);
    }
    if (name) {
      formData.append('name', name);
    }
    if (timestampColumn) {
      formData.append('timestampColumn', timestampColumn);
    }

    const res = await apiClient.post('/api/datasets/upload', formData);
    return res.data;
  },

  list: async (): Promise<Dataset[]> => {
    const res = await apiClient.get('/api/datasets');
    return res.data;
  },

  getPreview: async (id: string, limit: number = 20): Promise<DatasetPreview> => {
    const res = await apiClient.get(`/api/datasets/${id}/preview?limit=${limit}`);
    return res.data;
  },

  getById: async (id: string): Promise<Dataset> => {
    const res = await apiClient.get(`/api/datasets/${id}`);
    return res.data;
  },
};
