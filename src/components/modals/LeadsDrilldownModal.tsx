import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { X, Calendar, ChevronDown, ChevronLeft, ChevronRight, Table, LineChart as LineChartIcon } from 'lucide-react';
import { formatDateInput, parseDateInput } from '../../../utils';

interface LeadsDrilldownModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Period = '6M' | '12M' | '2Y' | 'Custom';
type OperationType = 'all' | 'hair' | 'dental';

const METRICS: { key: string; label: string }[] = [
    { key: 'leads', label: 'Total Leads' },
    { key: 'revenue', label: 'Ticket Amount (€)' },
    { key: 'tickets', label: 'Ticket Count' },
    { key: 'conversion', label: 'Conv. Rate (%)' },
    { key: 'interestRate', label: 'Int. Rate (%)' },
    { key: 'spend', label: 'Ad. Spent (€)' },
    { key: 'cpa', label: 'CPT (€)' },
    { key: 'ticketAmount', label: 'AVG Ticket (€)' },
    { key: 'expectedVal', label: 'AVG Revenue (€)' },
    { key: 'roas', label: 'ROAS' },
    { key: 'iqs', label: 'IQS Score' }
];

export const LeadsDrilldownModal: React.FC<LeadsDrilldownModalProps> = ({ isOpen, onClose }) => {
    const [period, setPeriod] = useState<Period>('6M');
    const [customRange, setCustomRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Graph View State
    const [viewMode, setViewMode] = useState<'table' | 'graph'>('table');
    const [graphType, setGraphType] = useState<OperationType>('all');
    const [graphMetric, setGraphMetric] = useState<string>('leads'); // Default to leads

    const datePickerRef = useRef<HTMLDivElement>(null);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
            }
        };

        if (isDatePickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDatePickerOpen]);

    // --- Mock Data Generator ---
    const data = useMemo(() => {
        const monthsToCheck = period === '6M' ? 6 : period === '12M' ? 12 : period === '2Y' ? 24 : 0; // 0 for custom logic
        const now = new Date();
        const generated = [];

        // Logic for iteration
        let iterations = monthsToCheck;
        if (period === 'Custom' && customRange.start && customRange.end) {
            // Calculate months between start and end approx
            iterations = (customRange.end.getFullYear() - customRange.start.getFullYear()) * 12 + (customRange.end.getMonth() - customRange.start.getMonth()) + 1;
            now.setTime(customRange.end.getTime()); // Start generating backwards from End Date
        }

        // Generate data backwards
        for (let i = 0; i < iterations; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            // Random Base factors
            // const seasonality = Math.sin(i * 0.5) * 0.2 + 1; // Removed in favor of IQS driven logic

            // Helper to generate consistent metrics based on target IQS
            const generateMetrics = (baseSpend: number, baseTicket: number, type: 'hair' | 'dental') => {
                // Determine Scenario
                const r = Math.random();
                let targetIQS;
                if (r < 0.2) targetIQS = 0.0008 + Math.random() * 0.0006; // Red (< 0.0015) - Bad
                else if (r < 0.5) targetIQS = 0.0016 + Math.random() * 0.0013; // Yellow (0.0015 - 0.003) - Stable
                else targetIQS = 0.005 + Math.random() * 0.02; // Green (> 0.003) - Good

                const spend = Math.floor(baseSpend * (0.8 + Math.random() * 0.4));
                const roas = targetIQS * Math.sqrt(spend);
                const revenue = spend * roas;

                const ticketAmount = Math.floor(baseTicket * (0.9 + Math.random() * 0.2));
                const tickets = Math.max(1, Math.floor(revenue / ticketAmount));

                // Backfill Leads
                // Good IQS usually means Good Conversion or Low CPA? 
                // Let's vary conversion slightly but keep reasonable
                const baseConv = type === 'hair' ? 20 : 12;
                const conversion = baseConv + (Math.random() * 10 - 5);
                const leads = Math.floor(tickets / (conversion / 100));
                const interested = Math.floor(leads * (0.4 + Math.random() * 0.1));

                return {
                    tickets,
                    ticketAmount,
                    revenue,
                    spend,
                    leads,
                    interested,
                    conversion: parseFloat(conversion.toFixed(1)),
                    interestRate: parseFloat(((interested / leads) * 100).toFixed(1)),
                    cpa: parseFloat((spend / tickets).toFixed(0)),
                    roas: parseFloat(roas.toFixed(2)), // Display ROAS normally
                    expectedVal: Math.floor(revenue / tickets),
                    iqs: parseFloat(targetIQS.toFixed(4)) // Keep precision for display
                };
            };

            const hair = generateMetrics(50000, 2500, 'hair'); // ~50k spend base
            const dental = generateMetrics(80000, 4500, 'dental'); // ~80k spend base

            generated.push({
                month: monthName,
                hair,
                dental
            });
        }
        return generated;
    }, [period, customRange]);

    const handleCustomAllTime = () => {
        setCustomRange({ start: new Date(2022, 0, 1), end: new Date() });
        setPeriod('Custom');
        setIsDatePickerOpen(false);
    };

    const getIQSColor = (val: number) => {
        if (val > 0.003) return 'text-green-600';
        if (val >= 0.0015) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (!isOpen) return null;

    // Prepare data for graph (reverse so oldest is first)
    const graphData = [...data].reverse();

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-7xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Leads Breakdown Analysis</h2>
                        <p className="text-sm text-slate-500">Detailed monthly performance for Hair & Dental departments</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">

                        {/* View Toggle */}
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <Table size={14} /> Table View
                            </button>
                            <button onClick={() => setViewMode('graph')} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${viewMode === 'graph' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <LineChartIcon size={14} /> Graph View
                            </button>
                        </div>

                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {(['6M', '12M', '2Y'] as Period[]).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${period === p ? 'bg-white text-esvita-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {p === '2Y' ? '2 Years' : p === '12M' ? '12 Months' : '6 Months'}
                                </button>
                            ))}
                            <div className="relative" ref={datePickerRef}>
                                <button
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${period === 'Custom' ? 'bg-white text-esvita-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Calendar size={14} /> Custom
                                </button>
                                {isDatePickerOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-4">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><label className="text-[10px] uppercase font-bold text-slate-400">Start</label><input type="date" className="w-full border rounded p-1 text-sm" onChange={(e) => setCustomRange(p => ({ ...p, start: parseDateInput(e.target.value) }))} /></div>
                                                <div><label className="text-[10px] uppercase font-bold text-slate-400">End</label><input type="date" className="w-full border rounded p-1 text-sm" onChange={(e) => setCustomRange(p => ({ ...p, end: parseDateInput(e.target.value) }))} /></div>
                                            </div>
                                            <button onClick={handleCustomAllTime} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors">Select All Time (From 2022)</button>
                                            <button onClick={() => { setPeriod('Custom'); setIsDatePickerOpen(false); }} className="w-full py-2 bg-esvita-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90">Apply Filter</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
                    </div>
                </div>

                {/* Graph Controls Bar (Only visible in Graph Mode) */}
                {viewMode === 'graph' && (
                    <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200">
                        {/* Metric Selector */}
                        <div className="relative group">
                            <select
                                value={graphMetric}
                                onChange={(e) => setGraphMetric(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-esvita-primary/20 cursor-pointer shadow-sm hover:border-slate-300"
                            >
                                {METRICS.map(m => (
                                    <option key={m.key} value={m.key}>{m.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                        </div>

                        {/* IQS Legend - Only Show if IQS is selected or effectively always helpful context? User asked to write it 'in the graph as well'. Let's show it only when IQS is selected or always? The request implies context for IQS specifically. */}
                        {graphMetric === 'iqs' && (
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>{'>'} 0.003: Scale</div>
                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>0.0015 - 0.003: Stable</div>
                                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>{'<'} 0.0015: Reduce</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-6">
                    {viewMode === 'graph' ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-[500px] animate-in fade-in duration-300">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="month"
                                        // Our graphData is reversed (Newest first in 'data', so 'graphData' is Oldest first).
                                        // So index 0 is oldest. Left side. Correct.
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 20, right: 20 }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) =>
                                            ['tickets', 'leads', 'revenue', 'cpa', 'spend', 'ticketAmount', 'expectedVal'].includes(graphMetric)
                                                ? (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)
                                                : graphMetric === 'iqs' ? value.toFixed(3)
                                                    : `${value}%` // Rates
                                        }
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: any) =>
                                            ['roas', 'iqs'].includes(graphMetric) ? value :
                                                ['conversion', 'interestRate'].includes(graphMetric) ? `${value}%` :
                                                    ['tickets', 'leads'].includes(graphMetric) ? value :
                                                        `€${value.toLocaleString()}`
                                        }
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                                    <Line
                                        type="monotone"
                                        name="Hair"
                                        dataKey={`hair.${graphMetric}`}
                                        stroke="#0d9488"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                    <Line
                                        type="monotone"
                                        name="Dental"
                                        dataKey={`dental.${graphMetric}`}
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        /* Table View */
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in duration-300">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="px-6 py-4 w-48">Period</th>
                                        <th className="px-4 py-4 w-24">Operation Type</th>
                                        <th className="px-4 py-4 text-right">Total Leads</th>
                                        <th className="px-4 py-4 text-right">Conv. Rate</th>
                                        <th className="px-4 py-4 text-right">Int. Rate</th>
                                        <th className="px-4 py-4 text-right">Ticket Amount</th>
                                        <th className="px-4 py-4 text-right">Ticket Count</th>
                                        <th className="px-4 py-4 text-right">Ad. Spent</th>
                                        <th className="px-4 py-4 text-right">CPT (Cost/Tkt)</th>
                                        <th className="px-4 py-4 text-right">AVG Ticket</th>
                                        <th className="px-4 py-4 text-right">AVG Revenue</th>
                                        <th className="px-4 py-4 text-right">ROAS</th>
                                        <th className="px-4 py-4 text-right pr-6">IQS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {data.map((row, idx) => (
                                        <React.Fragment key={idx}>
                                            {/* Row Group Spacer if not first */}
                                            {idx > 0 && <tr className="h-4 bg-slate-50/30 border-t border-slate-100"><td colSpan={13}></td></tr>}

                                            {/* Hair Row */}
                                            <tr className="bg-teal-50/40 hover:bg-teal-50/70 transition-colors group border-t border-slate-200">
                                                <td className="px-6 py-4 font-bold text-slate-700 border-r border-slate-100/50 relative" rowSpan={2}>
                                                    <div className="sticky top-0">{row.month}</div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-teal-700 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-teal-500"></div> Hair
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">{row.hair.leads}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">{row.hair.conversion}%</td>
                                                <td className="px-4 py-3 text-right text-slate-600">{row.hair.interestRate}%</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{Math.floor(row.hair.revenue).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">{row.hair.tickets}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{row.hair.spend.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">€{row.hair.cpa}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{Math.floor(row.hair.ticketAmount).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-800">€{row.hair.expectedVal.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-bold text-teal-600">{row.hair.roas}</td>
                                                <td className={`px-4 py-3 text-right pr-6 font-bold ${getIQSColor(row.hair.iqs)}`}>{row.hair.iqs}</td>
                                            </tr>

                                            {/* Dental Row */}
                                            <tr className="bg-blue-50/40 hover:bg-blue-50/70 transition-colors group">
                                                {/* First cell occupied by rowspan */}
                                                <td className="px-4 py-3 font-semibold text-blue-700 flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Dental
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">{row.dental.leads}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">{row.dental.conversion}%</td>
                                                <td className="px-4 py-3 text-right text-slate-600">{row.dental.interestRate}%</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{Math.floor(row.dental.revenue).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">{row.dental.tickets}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{row.dental.spend.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-700">€{row.dental.cpa}</td>
                                                <td className="px-4 py-3 text-right text-slate-600">€{Math.floor(row.dental.ticketAmount).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-800">€{row.dental.expectedVal.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-bold text-blue-600">{row.dental.roas}</td>
                                                <td className={`px-4 py-3 text-right pr-6 font-bold ${getIQSColor(row.dental.iqs)}`}>{row.dental.iqs}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
