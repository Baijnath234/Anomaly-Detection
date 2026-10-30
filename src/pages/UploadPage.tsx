import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { systemsApi } from '../api/systems.api';
import { datasetsApi } from '../api/datasets.api';
import { detectionApi } from '../api/detection.api';
import { useAppStore } from '../store/useAppStore';
import { DetectionMethod } from '../types';
import { ErrorAlert } from '../components/common/ErrorAlert';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  Cpu,
  ArrowRight,
  Loader2,
  Plus,
} from 'lucide-react';

const MODEL_OPTIONS: Array<{
  id: DetectionMethod;
  name: string;
  category: string;
  description: string;
}> = [
  {
    id: 'ensemble',
    name: 'Ensemble Consensus',
    category: 'Recommended',
    description: 'Majority vote combining statistical and ML models for maximum precision.',
  },
  {
    id: 'zscore',
    name: 'Z-Score Detector',
    category: 'Statistical',
    description: 'Fast, lightweight standard deviation outlier detection per sensor metric.',
  },
  {
    id: 'isolation_forest',
    name: 'Isolation Forest',
    category: 'Tree-based',
    description: 'Isolates anomalies by randomly selecting features and split values.',
  },
  {
    id: 'lof',
    name: 'Local Outlier Factor (LOF)',
    category: 'Density-based',
    description: 'Measures local deviation of density with respect to k-nearest neighbors.',
  },
  {
    id: 'autoencoder',
    name: 'Dense Autoencoder',
    category: 'Deep Learning',
    description: 'TensorFlow.js multi-layer neural network trained on reconstruction error.',
  },
  {
    id: 'lstm_ae',
    name: 'LSTM Autoencoder',
    category: 'Deep Learning',
    description: 'Temporal recurrent network capturing sequential temporal patterns.',
  },
];

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    activeSystemId,
    setActiveSystemId,
    setActiveDatasetId,
    setActiveRunId,
  } = useAppStore();

  // State
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [datasetName, setDatasetName] = useState<string>('');
  const [timestampColumn, setTimestampColumn] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<DetectionMethod>('ensemble');
  const [sensitivity, setSensitivity] = useState<number>(0.85);
  const [windowSize, setWindowSize] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New system modal/inline state
  const [isCreatingSystem, setIsCreatingSystem] = useState<boolean>(false);
  const [newSystemName, setNewSystemName] = useState<string>('');
  const [newSystemType, setNewSystemType] = useState<string>('Industrial Motor');

  // Fetch Systems
  const { data: systemsData } = useQuery({
    queryKey: ['systems'],
    queryFn: systemsApi.list,
  });

  const systems = systemsData?.items || [];

  // Parse CSV via Papaparse
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setDatasetName(selectedFile.name.replace(/\.[^/.]+$/, ''));
    setErrorMessage(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      preview: 50, // Preview top 50 rows
      complete: (results) => {
        if (results.meta.fields && results.meta.fields.length > 0) {
          setCsvHeaders(results.meta.fields);
          setCsvData(results.data);

          // Auto-detect timestamp column
          const tsMatch = results.meta.fields.find((f) => {
            const l = f.toLowerCase();
            return (
              l.includes('timestamp') ||
              l.includes('time') ||
              l.includes('date') ||
              l === 'ts'
            );
          });
          if (tsMatch) {
            setTimestampColumn(tsMatch);
          } else {
            setTimestampColumn(results.meta.fields[0]);
          }
        }
      },
      error: (err) => {
        setErrorMessage(`CSV parsing error: ${err.message}`);
      },
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
  });

  // Create system handler
  const handleCreateSystem = async () => {
    if (!newSystemName.trim()) return;
    try {
      const created = await systemsApi.create({
        name: newSystemName,
        type: newSystemType,
      });
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      setActiveSystemId(created.id);
      setIsCreatingSystem(false);
      setNewSystemName('');
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create system');
    }
  };

  // Upload and execute detection
  const handleRunDetection = async () => {
    if (!file) {
      setErrorMessage('Please select a CSV file to upload.');
      return;
    }
    if (!activeSystemId) {
      setErrorMessage('Please select or create a monitored system.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Upload dataset
      setStepMessage('Uploading and parsing CSV telemetry...');
      const uploadedDataset = await datasetsApi.upload(
        file,
        activeSystemId,
        datasetName || file.name,
        timestampColumn,
      );

      setActiveDatasetId(uploadedDataset.id);
      queryClient.invalidateQueries({ queryKey: ['datasets'] });

      // Step 2: Trigger Anomaly Detection
      setStepMessage(`Running ${selectedMethod} detector over ${uploadedDataset.rowCount} rows...`);
      const detectionResult = await detectionApi.run({
        datasetId: uploadedDataset.id,
        method: selectedMethod,
        sensitivity,
        windowSize,
      });

      setActiveRunId(detectionResult.runId);
      queryClient.invalidateQueries({ queryKey: ['detection-run', detectionResult.runId] });

      // Step 3: Transition to Analysis Page
      setStepMessage('Detection complete! Redirecting to analysis...');
      setTimeout(() => {
        navigate('/analysis');
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      setStepMessage('');
      setErrorMessage(
        err.response?.data?.message || 'Failed to complete dataset upload and detection.',
      );
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Upload & Configure Detection
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Import telemetry CSVs, select ML or statistical detectors, tune sensitivity parameters, and launch anomaly screening.
        </p>
      </div>

      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
      )}

      {/* 1. Target System Selection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            1. Monitored System
          </label>
          <button
            type="button"
            onClick={() => setIsCreatingSystem(!isCreatingSystem)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {isCreatingSystem ? 'Cancel' : 'Register New System'}
          </button>
        </div>

        {isCreatingSystem ? (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                System / Asset Name
              </label>
              <input
                type="text"
                placeholder="e.g. Pump Turbine Beta-4"
                value={newSystemName}
                onChange={(e) => setNewSystemName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="w-48">
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Equipment Type
              </label>
              <input
                type="text"
                placeholder="e.g. Centrifugal Pump"
                value={newSystemType}
                onChange={(e) => setNewSystemType(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={handleCreateSystem}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              Save Asset
            </button>
          </div>
        ) : (
          <select
            value={activeSystemId || ''}
            onChange={(e) => setActiveSystemId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose Monitored System --</option>
            {systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.type})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 2. Drag & Drop Upload */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-blue-500" />
          2. Telemetry File (CSV)
        </label>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            {file ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>{file.name}</span>
                <span className="text-xs text-slate-500">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Drag & drop your sensor CSV here, or{' '}
                  <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Requires 1 timestamp column and 1 or more numeric sensor metrics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CSV Preview & Column Mapping */}
        {csvHeaders.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Detected {csvHeaders.length} columns:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {csvHeaders.join(', ')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Timestamp Column:
                </label>
                <select
                  value={timestampColumn}
                  onChange={(e) => setTimestampColumn(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                >
                  {csvHeaders.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Rows Table Preview */}
            <div className="max-h-48 overflow-auto border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {csvHeaders.map((col) => (
                      <th
                        key={col}
                        className={`px-3 py-2 font-medium ${
                          col === timestampColumn
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {col} {col === timestampColumn && '(timestamp)'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {csvData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {csvHeaders.map((col) => (
                        <td key={col} className="px-3 py-1.5 text-slate-600 dark:text-slate-400">
                          {row[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 3. Model & Hyperparameter Selection */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
        <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          3. Model Selector & Detection Settings
        </label>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODEL_OPTIONS.map((opt) => {
            const isSelected = selectedMethod === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedMethod(opt.id)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {opt.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                      {opt.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {opt.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sliders: Sensitivity & Window Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sensitivity Threshold
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {sensitivity.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Low (Less noise)</span>
              <span>Balanced (0.80)</span>
              <span>High (Strict screening)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Window Size (Time-steps)
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {windowSize} rows
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={windowSize}
              onChange={(e) => setWindowSize(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Short (Fast response)</span>
              <span>10-20</span>
              <span>Long (Deep context)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button & Progress */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {isProcessing && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{stepMessage}</span>
          </div>
        )}

        <button
          onClick={handleRunDetection}
          disabled={!file || !activeSystemId || isProcessing}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Run Anomaly Detection
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
