import React, { useState, useMemo } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, ComposedChart, PieChart, Pie, Cell, LabelList
} from 'recharts';
import { X, Calendar, Filter, ArrowUpRight, ArrowDownRight, User, Users } from 'lucide-react';

interface InterestedLeadsDrilldownModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TimeFrame = 'daily' | 'weekly' | 'monthly';
type OperationType = 'all' | 'hair' | 'dental';

const COLORS = ['#0d9488', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const InterestedLeadsDrilldownModal: React.FC<InterestedLeadsDrilldownModalProps> = ({ isOpen, onClose }) => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
    const [opType, setOpType] = useState<OperationType>('hair');
    const [viewBy, setViewBy] = useState<'agent' | 'team'>('team'); // For the bottom chart

    // --- Mock Data ---

    // 1. Trend Graph Data
    const trendData = useMemo(() => {
        if (timeFrame === 'daily') {
            // Hourly data for Today vs Yesterday
            return Array.from({ length: 13 }, (_, i) => { // 09:00 to 21:00
                const hour = i + 9;
                const baseRate = opType === 'all' ? 40 : opType === 'hair' ? 45 : 35;
                const todayVal = Math.floor(baseRate + Math.random() * 15 - 5);
                const yestVal = Math.floor(baseRate + Math.random() * 15 - 5);
                return {
                    label: `${hour}:00`,
                    today: todayVal,
                    yesterday: yestVal,
                    diff: todayVal - yestVal
                };
            });
        }

        if (timeFrame === 'weekly') {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return days.map(day => ({
                label: day,
                today: 40 + Math.random() * 20,
                yesterday: 35 + Math.random() * 20,
                diff: 0
            }));
        }

        // Monthly (Day 1-30)
        return Array.from({ length: 30 }, (_, i) => ({
            label: `${i + 1}`,
            today: 40 + Math.random() * 20,
            yesterday: 35 + Math.random() * 20,
            diff: 0
        }));
    }, [timeFrame, opType]);

    // 2. Team Interest Rates
    const teamData = [
        { name: "Alex's Team", rate: 52, color: '#0d9488' },
        { name: "Enzo's Team", rate: 48, color: '#3b82f6' },
        { name: "Robert's Team", rate: 45, color: '#f59e0b' },
        { name: "Mazen's Team", rate: 55, color: '#8b5cf6' },
        { name: "Gio's Team", rate: 42, color: '#ef4444' },
    ];

    // 3. Status Distribution
    const statusData = [
        { name: 'Waiting Ticket', value: 120, color: '#3b82f6' },
        { name: 'Offer Sent', value: 250, color: '#0d9488' },
        { name: 'High Price', value: 80, color: '#f59e0b' },
        { name: 'Photo Needed', value: 150, color: '#8b5cf6' },
        { name: 'Future Plan', value: 60, color: '#64748b' },
    ];
    const totalStatus = statusData.reduce((acc, curr) => acc + curr.value, 0);

    // 4. Activity Data (Dynamic)
    const activeData = useMemo(() => {
        if (viewBy === 'team') {
            return [
                { name: "Alex's Team", interested: 45, total: 100 },
                { name: "Enzo's Team", interested: 62, total: 100 },
                { name: "Robert's Team", interested: 35, total: 100 },
                { name: "Mazen's Team", interested: 50, total: 100 },
                { name: "Gio's Team", interested: 40, total: 100 },
            ].map(item => ({
                ...item,
                remaining: item.total - item.interested,
                rate: Math.round((item.interested / item.total) * 100)
            }));
        }
        // Agent View - 30 dummy agents
        return Array.from({ length: 30 }, (_, i) => {
            const total = Math.floor(20 + Math.random() * 80);
            const interested = Math.floor(total * (0.2 + Math.random() * 0.5));
            return {
                name: `Ag. ${i + 1}`,
                total,
                interested,
                remaining: total - interested,
                rate: Math.round((interested / total) * 100)
            };
        });
    }, [viewBy]);

    const getLegendLabels = () => {
        if (timeFrame === 'daily') return { current: 'Today', prev: 'Yesterday' };
        if (timeFrame === 'weekly') return { current: 'Curr. Week', prev: 'Prev. Week' };
        return { current: 'Curr. Month', prev: 'Prev. Month' };
    };

    const legends = getLegendLabels();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-7xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></span> Independent Leads Analysis
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Deep dive into interest rates and lead quality</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Global OpType Removed from here as requested to be in the chart, but maybe keep timeframe? */}
                        <div className="bg-slate-100 p-1 rounded-lg flex">
                            {['daily', 'weekly', 'monthly'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTimeFrame(t as TimeFrame)}
                                    className={`px-3 py-1 text-xs font-bold uppercase rounded-md transition-all ${timeFrame === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 space-y-6">

                    {/* Top Row: Trend Graph */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Interest Rate Trends</h3>
                                <p className="text-xs text-slate-400 mt-1">Comparing performance vs Previous Period</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {/* Type Switch inside Chart Card */}
                                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                                    {['all', 'hair', 'dental'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setOpType(t as OperationType)}
                                            className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${opType === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                {/* Legend */}
                                <div className="flex items-center gap-4 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>{legends.current}</div>
                                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>{legends.prev}</div>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(val: number) => [`${val.toFixed(1)}%`]}
                                    />
                                    <Line type="monotone" name={legends.current} dataKey="today" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name={legends.prev} dataKey="yesterday" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Middle Row: Team Stats & Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Team Interest Rates */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-6">Team Interest Performance</h3>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={teamData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} formatter={(val: number) => [`${val}%`, 'Interest Rate']} />
                                        <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
                                            {teamData.map((entry, index) => (
                                                <Cell key={index} fill={entry.color} />
                                            ))}
                                            <LabelList dataKey="rate" position="right" fill="#64748b" fontSize={11} fontWeight={600} formatter={(v: number) => `${v}%`} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Distribution */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-6">Lead Status Distribution</h3>
                            <div className="flex gap-6 items-center">
                                <div className="h-[220px] w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 space-y-3">
                                    {statusData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                                                <span className="text-slate-600 font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{item.value}</span>
                                                <span className="text-slate-400">({Math.round((item.value / totalStatus) * 100)}%)</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Activity Stacked Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Daily Lead Volume & Quality</h3>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button onClick={() => setViewBy('team')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md ${viewBy === 'team' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>By Team</button>
                                <button onClick={() => setViewBy('agent')} className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md ${viewBy === 'agent' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'}`}>By Agent</button>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={activeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: viewBy === 'agent' ? 9 : 12, fill: '#64748b' }} interval={viewBy === 'agent' ? 0 : 'preserveEnd'} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                                        content={({ active, payload, label }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                                                        <p className="font-bold text-slate-800 mb-2">{label}</p>
                                                        <div className="space-y-1 text-xs">
                                                            <div className="flex justify-between gap-4"><span className="text-blue-600 font-medium">Interested:</span> <span>{data.interested} ({data.rate}%)</span></div>
                                                            <div className="flex justify-between gap-4"><span className="text-slate-400 font-medium">Total Volume:</span> <span>{data.total}</span></div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend iconType="circle" payload={[{ value: 'Interested', type: 'circle', color: '#3b82f6' }, { value: 'Other Leads', type: 'circle', color: '#e2e8f0' }]} />
                                    <Bar dataKey="interested" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} barSize={viewBy === 'agent' ? 12 : 40}>
                                        {viewBy === 'team' && <LabelList dataKey="rate" position="center" fill="#fff" fontSize={11} fontWeight={600} formatter={(v: number) => `${v}%`} />}
                                    </Bar>
                                    <Bar dataKey="remaining" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={viewBy === 'agent' ? 12 : 40}>
                                        {viewBy === 'team' && <LabelList dataKey="total" position="top" fill="#64748b" fontSize={11} fontWeight={600} />}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
