export function formatDate(dateStr?: string | Date): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatScore(score?: number): string {
  if (score === undefined || score === null) return '0.00';
  return (score * 100).toFixed(1) + '%';
}

export function formatDays(days?: number): string {
  if (days === undefined || days === null) return 'N/A';
  if (days < 1) {
    const hours = Math.round(days * 24);
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  return `${days.toFixed(1)} days`;
}

