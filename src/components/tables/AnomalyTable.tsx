import React, { useState, useMemo } from 'react';
import { Anomaly } from '../../types';
import { SeverityBadge } from '../common/SeverityBadge';
import { formatDate, formatScore } from '../../utils/formatters';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface AnomalyTableProps {
  anomalies: Anomaly[];
  onSelectAnomaly: (id: string) => void;
}

export const AnomalyTable: React.FC<AnomalyTableProps> = ({
  anomalies,
  onSelectAnomaly,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      const matchSeverity =
        filterSeverity === 'ALL' || a.severity.toUpperCase() === filterSeverity;
      const matchSearch =
        searchQuery === '' ||
        (a.rootCause && a.rootCause.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [anomalies, filterSeverity, searchQuery]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-3">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by root cause or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Severity filter pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => {
            const isActive = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => {
                  setFilterSeverity(sev);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sev}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Container */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Anomalies Found"
          description="No anomalies match your current search and severity filters."
        />
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Anomaly Score</th>
                  <th className="px-4 py-3">Identified Root Cause</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {paginated.map((anomaly) => (
                  <tr
                    key={anomaly.id}
                    onClick={() => onSelectAnomaly(anomaly.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                      {formatDate(anomaly.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={anomaly.severity} size="sm" />
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formatScore(anomaly.score)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {anomaly.rootCause || 'Multivariate deviation'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                        Diagnose
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Previous
              </button>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
