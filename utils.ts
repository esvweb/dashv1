
export const getTimeMultiplier = (filter: string) => {
    if (filter === 'Today') return 0.04; // Daily avg
    if (filter === 'This Week') return 0.22; // Weekly avg
    if (filter.includes('Range')) return 0.5; // Custom range approx
    return 1; // Month
};

export const getComparisonLabel = (filter: string) => {
    if (filter === 'Today') return 'yesterday';
    if (filter === 'This Week') return 'prev. week';
    if (filter === 'This Month') return 'prev. month';
    return 'previous period';
};

export const formatDateInput = (date: Date | null) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const parseDateInput = (str: string) => {
    if (!str) return null;
    const [y, m, d] = str.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};

export const formatDate = (dateStr: string) => {
    const date = parseDateInput(dateStr);
    if (!date) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();
