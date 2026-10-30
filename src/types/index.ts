export type Severity = 'Critical' | 'Warning' | 'Info';

export interface System {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  systemId: string;
  name: string;
  columns: string[];
  rowCount: number;
  createdAt: string;
}

export interface DatasetPreview {
  id: string;
  systemId: string;
  name: string;
  columns: string[];
  numericColumns: string[];
  timestampColumn: string;
  rowCount: number;
  previewRows: Array<{
    timestamp: string;
    values: Record<string, number>;
  }>;
}

export type DetectionMethod =
  | 'zscore'
  | 'isolation_forest'
  | 'lof'
  | 'ocsvm'
  | 'autoencoder'
  | 'lstm_ae'
  | 'ensemble';

export interface DetectionRunParams {
  sensitivity: number;
  windowSize: number;
  totalRows?: number;
  anomaliesCount?: number;
  threshold?: number;
}

export interface Anomaly {
  id: string;
  runId: string;
  timestamp: string;
  score: number;
  severity: Severity;
  metrics: Record<string, number>;
  rootCause: string;
}

export interface DetectionRunResult {
  runId: string;
  datasetId: string;
  method: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  totalRows: number;
  anomaliesCount: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  threshold: number;
  anomalies: Anomaly[];
}

export interface RulResult {
  id: string;
  datasetId: string;
  etaDays: number;
  lowerDays: number;
  upperDays: number;
  currentHealthIndex: number;
  failureThreshold: number;
  healthIndexHistory: {
    timestamps: string[];
    scores: number[];
  };
}

export interface RepairGuide {
  anomalyId: string;
  problem: string;
  severity: Severity;
  rootCause: string;
  orderedSteps: string[];
  safetyPrecaution: string;
  aiExplanation?: string;
  metrics: Record<string, any>;
  matchedRuleId: string;
}

export interface RunSummaryReport {
  runId: string;
  systemName?: string;
  datasetName?: string;
  method: string;
  executedAt: string;
  totalAnomalies: number;
  severityBreakdown: {
    critical: number;
    warning: number;
    info: number;
  };
  topRootCauses: Record<string, number>;
}

export interface LiveAnomalyEvent {
  systemId: string;
  timestamp: string;
  score: number;
  severity: Severity;
  values: Record<string, number>;
  isAnomaly: boolean;
}

