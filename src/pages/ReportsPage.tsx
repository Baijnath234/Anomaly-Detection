import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { reportsApi } from '../api/reports.api';
import { detectionApi } from '../api/detection.api';
import { useAppStore } from '../store/useAppStore';
import { exportAnomaliesPdf } from '../utils/pdfExport';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate, formatScore } from '../utils/formatters';
import {
  FileText,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeRunId } = useAppStore();
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Fetch Summary Report
  const {
    data: summary,
    isLoading: loadingSummary,
  } = useQuery({
    queryKey: ['report-summary', activeRunId],
    queryFn: () => reportsApi.getSummary(activeRunId!),
    enabled: !!activeRunId,
  });

  // Fetch Run Results to get anomaly list for PDF table
  const {
    data: runResult,
    isLoading: loadingRun,
  } = useQuery({
    queryKey: ['detection-run', activeRunId],
    queryFn: () => detectionApi.getResults(activeRunId!),
    enabled: !!activeRunId,
  });

  const handleExportPdf = () => {
    if (!summary || !runResult) return;
    setIsExportingPdf(true);
    try {
      exportAnomaliesPdf(summary, runResult.anomalies || []);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!activeRunId) return;
    const url = reportsApi.getCsvDownloadUrl(activeRunId);
    window.open(url, '_blank');
  };

  if (!activeRunId) {
    return (
      <EmptyState
        title="No Detection Run Selected"
        description="Select or execute an anomaly detection run to generate audit reports and CSV/PDF data exports."
        actionLabel="Go to Upload & Detect"
        onAction={() => navigate('/upload')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Audit Reports & Data Exports
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Export regulatory compliance packages, incident audits, and sensor logs in PDF and CSV format.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            Export CSV
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf || !summary}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            {isExportingPdf ? 'Generating PDF...' : 'Export PDF Report'}
          </button>
        </div>
      </div>

      {loadingSummary || loadingRun ? (
        <CardSkeleton />
      ) : !summary ? (
        <EmptyState
          title="Summary Unavailable"
          description="Could not generate summary report for the selected run."
        />
      ) : (
        <>
          {/* Executive Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Run Execution Audit
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  Run #{summary.runId.slice(0, 12)}
                </h2>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>Executed on</div>
                <div className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatDate(summary.executedAt)}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[11px] text-slate-400 uppercase font-bold">
                  System Asset
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {summary.systemName || 'Industrial Asset'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[11px] text-slate-400 uppercase font-bold">
                  Dataset Analyzed
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
                  {summary.datasetName || 'Sensor Telemetry'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[11px] text-slate-400 uppercase font-bold">
                  Model Algorithm
                </span>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5 uppercase">
                  {summary.method}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                <span className="text-[11px] text-slate-400 uppercase font-bold">
                  Total Flagged Anomalies
                </span>
                <div className="text-sm font-bold text-red-500 mt-0.5">
                  {summary.totalAnomalies} Outliers
                </div>
              </div>
            </div>

            {/* Severity Breakdown */}
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                Severity Distribution
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-center">
                  <div className="text-2xl font-black text-red-600 dark:text-red-400">
                    {summary.severityBreakdown.critical}
                  </div>
                  <div className="text-xs font-bold text-red-700 dark:text-red-300 uppercase mt-1">
                    Critical Outliers
                  </div>
                  <div className="text-[11px] text-red-500 mt-0.5">Immediate intervention</div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-center">
                  <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {summary.severityBreakdown.warning}
                  </div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase mt-1">
                    Warning Outliers
                  </div>
                  <div className="text-[11px] text-amber-500 mt-0.5">Inspection scheduled</div>
                </div>

                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 text-center">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {summary.severityBreakdown.info}
                  </div>
                  <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mt-1">
                    Info Outliers
                  </div>
                  <div className="text-[11px] text-blue-500 mt-0.5">Operational noise</div>
                </div>
              </div>
            </div>

            {/* Root Causes Distribution */}
            {summary.topRootCauses && Object.keys(summary.topRootCauses).length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                  Primary Failure Drivers (Root Cause Attribution)
                </h3>
                <div className="space-y-2">
                  {Object.entries(summary.topRootCauses).map(([metric, count]) => {
                    const pct = ((count / (summary.totalAnomalies || 1)) * 100).toFixed(0);
                    return (
                      <div key={metric} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {metric}
                          </span>
                          <span className="text-slate-500 font-mono">
                            {count} events ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Audit Table Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Audit Sample (Included in Export)
            </h3>
            <div className="max-h-64 overflow-auto border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Timestamp</th>
                    <th className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Severity</th>
                    <th className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Score</th>
                    <th className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">Root Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {runResult?.anomalies?.slice(0, 15).map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{formatDate(a.timestamp)}</td>
                      <td className="px-3 py-2">
                        <SeverityBadge severity={a.severity} size="sm" />
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {formatScore(a.score)}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">
                        {a.rootCause || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
