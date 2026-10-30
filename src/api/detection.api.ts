import { apiClient } from './client';
import { DetectionRunResult, DetectionMethod } from '../types';

export const detectionApi = {
  run: async (params: {
    datasetId: string;
    method: DetectionMethod;
    sensitivity?: number;
    windowSize?: number;
  }): Promise<DetectionRunResult> => {
    const res = await apiClient.post('/api/detection/run', params);
    return res.data;
  },

  getResults: async (runId: string): Promise<DetectionRunResult> => {
    const res = await apiClient.get(`/api/detection/${runId}/results`);
    return res.data;
  },

  trainModel: async (params: {
    systemId: string;
    datasetId: string;
    method: DetectionMethod;
    epochs?: number;
    batchSize?: number;
  }) => {
    const res = await apiClient.post('/api/models/train', params);
    return res.data;
  },

  getModelStatus: async (modelId: string) => {
    const res = await apiClient.get(`/api/models/${modelId}/status`);
    return res.data;
  },
};

