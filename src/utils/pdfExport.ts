import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Anomaly, RunSummaryReport } from '../types';
import { formatDate } from './formatters';

export function exportAnomaliesPdf(
  summary: RunSummaryReport,
  anomalies: Anomaly[],
) {
  const doc = new jsPDF();

  // Header Title
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ANOMALY DETECTION & REPAIR AUDIT REPORT', 14, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

  // Executive Summary Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 14, 42);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Run ID: ${summary.runId}`, 14, 50);
  doc.text(`System: ${summary.systemName || 'Industrial Asset'}`, 14, 56);
  doc.text(`Dataset: ${summary.datasetName || 'Sensor Telemetry'}`, 14, 62);
  doc.text(`Algorithm: ${summary.method.toUpperCase()}`, 14, 68);

  // Breakdown statistics box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, 44, 76, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SEVERITY BREAKDOWN', 125, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(`Critical: ${summary.severityBreakdown.critical}`, 125, 58);
  doc.text(`Warning: ${summary.severityBreakdown.warning}`, 125, 64);
  doc.text(`Info: ${summary.severityBreakdown.info}`, 155, 58);
  doc.text(`Total: ${summary.totalAnomalies}`, 155, 64);

  // Anomalies Table
  const tableData = anomalies.slice(0, 100).map((a) => [
    formatDate(a.timestamp),
    a.severity,
    `${(a.score * 100).toFixed(1)}%`,
    a.rootCause || 'N/A',
  ]);

  autoTable(doc, {
    startY: 78,
    head: [['Timestamp', 'Severity', 'Anomaly Score', 'Identified Root Cause']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const text = String(data.cell.raw);
        if (text === 'Critical') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        } else if (text === 'Warning') {
          data.cell.styles.textColor = [217, 119, 6];
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [37, 99, 235];
        }
      }
    },
  });

  doc.save(`anomaly-report-${summary.runId.slice(0, 8)}.pdf`);
}

