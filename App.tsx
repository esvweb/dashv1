
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
    Line,
    Legend,
    Cell
} from 'recharts';
import {
    LayoutDashboard,
    Users,
    Menu,
    X,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ChevronDown,
    Check,
    ArrowRight,
    Home,
    Globe,
    Target,
    Megaphone,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Clock,
    Briefcase,
    TrendingUp,
    Banknote,
    UserCheck,
    Search,
    Filter
} from 'lucide-react';
import {
    KPI_DATA,
    COUNTRY_DATA,
    AGENT_DATA,
    TEAM_DATA,
    SOURCE_DATA,
    TEAMS_LIST,
    AGENTS_LIST,
    SOURCE_ICONS,
    AD_PERFORMANCE_DATA,
    ACTIVITY_METRICS,
    FUNNEL_DATA,
    FORECAST_DATA,
    LANGUAGE_DATA
} from './constants';
import { TimeFilter, KPIMetric, ViewType, TreatmentFilterType, SalesByCountry, AgentPerformance, ActivityMetric, AdPerformance, SalesForecast, LanguageMetric } from './types';
import Sidebar from './src/components/layout/Sidebar';
import Header from './src/components/layout/Header';
import { getTimeMultiplier, getComparisonLabel } from './utils';
import { useDashboardData } from './src/hooks/useDashboardData';
import { LeadsDrilldownModal } from './src/components/modals/LeadsDrilldownModal';
import { InterestedLeadsDrilldownModal } from './src/components/modals/InterestedLeadsDrilldownModal';
import { LoginScreen } from './src/components/auth/LoginScreen';

// --- Utility Functions ---



// --- Animation Components ---
const AnimatedNumber = ({ value, formatter, duration = 1000 }: { value: number, formatter?: (v: number) => string, duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
        let startTime: number;
        const startValue = 0;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = startValue + (value - startValue) * ease;
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value, duration]);
    return <>{formatter ? formatter(displayValue) : Math.floor(displayValue).toLocaleString()}</>;
};

const AnimatedBar = ({ width, colorClass }: { width: number, colorClass: string }) => {
    const [currentWidth, setCurrentWidth] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setCurrentWidth(width), 100);
        return () => clearTimeout(timer);
    }, [width]);
    return (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} style={{ width: `${currentWidth}%` }}></div>
        </div>
    );
};

// --- Basic UI Components ---
const TreatmentSwitch = ({ active, onSelect }: { active: TreatmentFilterType, onSelect: (val: TreatmentFilterType) => void }) => (
    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
        {['All', 'Hair', 'Dental'].map((filter) => (
            <button key={filter} onClick={() => onSelect(filter as TreatmentFilterType)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${active === filter ? 'bg-white text-esvita-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                {filter}
            </button>
        ))}
    </div>
);

const CardFilter = ({ active, onSelect }: { active: TimeFilter, onSelect: (val: TimeFilter) => void }) => (
    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
        {['Today', 'Week', 'Month'].map((filter) => (
            <button key={filter} onClick={() => onSelect(filter as TimeFilter)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${active === filter ? 'bg-white text-esvita-primary shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
                {filter}
            </button>
        ))}
    </div>
);



// --- Complex Components ---







const FullScreenModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><ChevronLeft size={24} /></button>
                    <div><h2 className="text-xl font-bold text-slate-900">{title}</h2><p className="text-xs text-slate-500">Full detailed view</p></div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-500"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar"><div className="max-w-7xl mx-auto">{children}</div></div>
        </div>
    );
};

// --- KPI & Widget Components ---

const BreakdownBar = ({ hair, dental, total, hairChange, dentalChange }: { hair: number, dental: number, total: number, hairChange?: number, dentalChange?: number }) => {
    const p_hair = (hair / (total || 1)) * 100;
    const p_dental = (dental / (total || 1)) * 100;
    const ChangeBadge = ({ value }: { value: number }) => <span className={`text-[9px] font-bold ml-1.5 px-1 py-0.5 rounded flex items-center gap-0.5 ${value >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{value >= 0 ? '↑' : '↓'} {Math.abs(value)}%</span>;
    return (
        <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hair</span><div className="flex items-center"><span className="text-xs font-bold text-slate-700"><AnimatedNumber value={hair} /></span>{hairChange !== undefined && <ChangeBadge value={hairChange} />}</div></div>
                <AnimatedBar width={p_hair} colorClass="bg-teal-600" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dental</span><div className="flex items-center"><span className="text-xs font-bold text-slate-700"><AnimatedNumber value={dental} /></span>{dentalChange !== undefined && <ChangeBadge value={dentalChange} />}</div></div>
                <AnimatedBar width={p_dental} colorClass="bg-blue-500" />
            </div>
        </div>
    );
};

const ComplexBreakdown = ({
    hair, dental,
    hairCount, dentalCount,
    hairAvg, dentalAvg
}: {
    hair: number, dental: number, // Revenue
    hairCount: number, dentalCount: number,
    hairAvg: number, dentalAvg: number
}) => {
    const totalRev = hair + dental;
    const p_hair = (hair / (totalRev || 1)) * 100;
    const p_dental = (dental / (totalRev || 1)) * 100;

    const fmtVal = (v: number) => v >= 1000000 ? `€${(v / 1000000).toFixed(1)}M` : `€${(v / 1000).toFixed(0)}k`;

    return (
        <div className="pt-4 border-t border-slate-50 space-y-4">
            {/* Hair */}
            <div>
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hair</span>
                    <div className="text-right flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">{hairCount} Patient</span>
                        <span className="w-px h-3 bg-slate-200"></span>
                        <span>Avg: €{hairAvg.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800">{fmtVal(hair)}</span>
                </div>
                <AnimatedBar width={p_hair} colorClass="bg-teal-600" />
            </div>

            {/* Dental */}
            <div>
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dental</span>
                    <div className="text-right flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">{dentalCount} Patient</span>
                        <span className="w-px h-3 bg-slate-200"></span>
                        <span>Avg: €{dentalAvg.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800">{fmtVal(dental)}</span>
                </div>
                <AnimatedBar width={p_dental} colorClass="bg-blue-500" />
            </div>
        </div>
    );
};

const KPICard: React.FC<{ data: KPIMetric, globalTimeframe: string, onViewDetails: (id: string) => void }> = ({ data, globalTimeframe, onViewDetails }) => {
    // Determine initial state based on global timeframe to match, or default to generic if custom
    const initialFilter = ['Today', 'This Week', 'This Month'].includes(globalTimeframe)
        ? (globalTimeframe === 'This Week' ? 'Week' : globalTimeframe === 'This Month' ? 'Month' : 'Today')
        : 'Month';

    const [filter, setFilter] = useState<string>(initialFilter);

    // Sync if global changes
    useEffect(() => {
        if (['Today', 'This Week', 'This Month'].includes(globalTimeframe)) {
            setFilter(globalTimeframe === 'This Week' ? 'Week' : globalTimeframe === 'This Month' ? 'Month' : 'Today');
        }
    }, [globalTimeframe]);

    // Scaling Logic:
    const globalMult = getTimeMultiplier(globalTimeframe);
    const localMult = (f: string) => f === 'Today' ? 0.04 : f === 'Week' ? 0.22 : 1;
    const factor = localMult(filter);
    const scaleFactor = globalMult ? (factor / globalMult) : 1;

    let mainValueNode, breakdownNode;

    // Constants for estimation
    const HAIR_AVG = 2850;
    const DENTAL_AVG = 4800;

    // For changes, we just mock something based on timeframe to look dynamic
    const hairChange = data.change + (Math.random() > 0.5 ? 1 : -1);
    const dentalChange = data.change - (Math.random() > 0.5 ? 1 : 0);

    if (data.id === 'leads') {
        const total = Math.floor(data.value * scaleFactor);
        mainValueNode = <h3 className="text-3xl font-bold text-slate-900 tracking-tight"><AnimatedNumber value={total} /></h3>;
        breakdownNode = <BreakdownBar hair={Math.floor(total * 0.55)} dental={Math.floor(total * 0.35)} total={total} hairChange={hairChange} dentalChange={dentalChange} />;

    } else if (data.id === 'interested') {
        const rate = 46; // Static for demo
        const count = Math.floor(data.value * scaleFactor);
        mainValueNode = <div className="flex items-baseline gap-2"><h3 className="text-3xl font-bold text-slate-900 tracking-tight"><AnimatedNumber value={rate} />%</h3><span className="text-sm text-slate-400 font-medium">Interest Rate</span></div>;
        breakdownNode = <BreakdownBar hair={Math.floor(count * 0.50)} dental={Math.floor(count * 0.30)} total={count} hairChange={hairChange} dentalChange={dentalChange} />;

    } else if (data.id === 'tickets') {
        // Tickets Received
        // Show Revenue (Main) and Count (Sub)
        const totalCount = Math.floor(data.value * scaleFactor);

        // Distribution
        const hairCount = Math.floor(totalCount * 0.65);
        const dentalCount = Math.floor(totalCount * 0.35);

        const hairRev = hairCount * HAIR_AVG;
        const dentalRev = dentalCount * DENTAL_AVG;
        const totalRev = hairRev + dentalRev;

        mainValueNode = (
            <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">€<AnimatedNumber value={totalRev} formatter={(v) => v >= 1000000 ? (v / 1000000).toFixed(2) + 'M' : (v / 1000).toFixed(0) + 'k'} /></h3>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-bold">{totalCount} Tickets</span>
                    <span className={`px-1 rounded font-bold ${data.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {data.isPositive ? '+' : ''}{data.change}%
                    </span>
                </div>
            </div>
        );

        breakdownNode = (
            <ComplexBreakdown
                hair={hairRev} dental={dentalRev}
                hairCount={hairCount} dentalCount={dentalCount}
                hairAvg={HAIR_AVG} dentalAvg={DENTAL_AVG}
            />
        );

    } else if (data.id === 'revenue') {
        // Total Revenue
        // Show Revenue (Main) and Patient Count (Sub)
        const totalRev = data.value * scaleFactor * 1000000; // Original val is in millions

        // Back calculate counts
        // Assume split of revenue
        const hairRev = totalRev * 0.60;
        const dentalRev = totalRev * 0.40;

        const hairCount = Math.floor(hairRev / HAIR_AVG);
        const dentalCount = Math.floor(dentalRev / DENTAL_AVG);
        const totalCount = hairCount + dentalCount;

        mainValueNode = (
            <div className="space-y-1">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">€<AnimatedNumber value={totalRev} formatter={(v) => v >= 1000000 ? (v / 1000000).toFixed(2) + 'M' : (v / 1000).toFixed(0) + 'k'} /></h3>
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-bold">{totalCount} Patients</span>
                    <span className={`px-1 rounded font-bold ${data.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {data.isPositive ? '+' : ''}{data.change}%
                    </span>
                </div>
            </div>
        );

        breakdownNode = (
            <ComplexBreakdown
                hair={hairRev} dental={dentalRev}
                hairCount={hairCount} dentalCount={dentalCount}
                hairAvg={HAIR_AVG} dentalAvg={DENTAL_AVG}
            />
        );
    }

    // Determine label for comparison
    const comparisonLabel = filter === 'Today' ? 'yesterday' : filter === 'Week' ? 'prev. week' : 'prev. month';

    return (
        <div onClick={() => onViewDetails(data.id)} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${data.isPositive ? 'bg-esvita-light text-esvita-primary' : 'bg-red-50 text-red-600'}`}><data.icon size={20} /></div><span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{data.title}</span></div>
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100" onClick={(e) => e.stopPropagation()}>
                    {['Today', 'Week', 'Month'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${filter === f ? 'bg-white text-esvita-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            {/* Main Value Node replaces the default standard display */}
            <div className="mb-4">
                {mainValueNode}
                {/* Fallback for leads/interested who use standard display style below main value, 
                    but tickets/revenue now embed the badge in mainValueNode. 
                    We can conditionalize rendering the standard badge row.
                */}
                {['leads', 'interested'].includes(data.id) && (
                    <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${data.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {data.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{Math.abs(data.change)}%</span>
                        <span className="text-slate-400 font-normal">vs {comparisonLabel}</span>
                    </div>
                )}
            </div>

            {breakdownNode}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><div className="bg-slate-50 p-1.5 rounded-full text-slate-400 hover:text-esvita-primary hover:bg-esvita-light"><ArrowRight size={14} /></div></div>
        </div>
    );
};

const MarketingWidget = ({ data, onViewDetails }: { data: AdPerformance[], onViewDetails: () => void }) => {
    const [treatment, setTreatment] = useState<TreatmentFilterType>('All');

    // Aggregate data for widget
    const aggregated = useMemo(() => {
        const result: Record<string, any> = {};
        data.forEach(item => {
            if (!result[item.source]) {
                result[item.source] = {
                    name: item.source,
                    adSpend: 0,
                    revenue: 0,
                    salesCount: 0,
                    leadCount: 0,
                    color: SOURCE_DATA.find(s => s.name === item.source)?.color || '#ccc'
                };
            }
            result[item.source].adSpend += item.spend;
            result[item.source].revenue += item.revenue;
            result[item.source].salesCount += item.salesCount;
            result[item.source].leadCount += item.leads;
        });
        return Object.values(result);
    }, [data]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Megaphone size={20} /></div><h3 className="font-bold text-slate-800">Marketing Intelligence</h3></div>
                <div className="flex items-center gap-3"><TreatmentSwitch active={treatment} onSelect={setTreatment} /><button onClick={onViewDetails} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-esvita-primary"><ArrowRight size={18} /></button></div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead><tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase"><th className="pb-3 pl-2">Source</th><th className="pb-3 text-right">Ad Spend</th><th className="pb-3 text-right">Revenue</th><th className="pb-3 text-right">ROAS</th><th className="pb-3 text-right">Conv. Rate</th></tr></thead>
                    <tbody className="divide-y divide-slate-50">
                        {aggregated.map((source) => {
                            const Icon = SOURCE_ICONS[source.name] || Globe;
                            const roas = (source.revenue / (source.adSpend || 1)).toFixed(1);
                            const cvr = ((source.salesCount / (source.leadCount || 1)) * 100).toFixed(1);
                            // Treatment filter logic mock
                            const mult = treatment === 'All' ? 1 : treatment === 'Hair' ? 0.6 : 0.4;
                            return (
                                <tr key={source.name} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 pl-2"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: source.color }}><Icon size={16} /></div><button onClick={onViewDetails} className="font-semibold text-sm text-slate-700 hover:text-esvita-primary hover:underline">{source.name}</button></div></td>
                                    <td className="py-3 text-right font-medium text-slate-600">€{(source.adSpend * mult).toLocaleString()}</td>
                                    <td className="py-3 text-right font-bold text-slate-800">€{(source.revenue * mult).toLocaleString()}</td>
                                    <td className="py-3 text-right"><span className={`font-bold ${Number(roas) > 3 ? 'text-green-600' : Number(roas) > 2 ? 'text-yellow-600' : 'text-red-600'}`}>{roas}x</span></td>
                                    <td className="py-3 text-right text-sm text-slate-600">{cvr}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DemographicsWidget = ({ countryData, languageData, onViewDetails }: { countryData: SalesByCountry[], languageData: LanguageMetric[], onViewDetails: () => void }) => {
    const [treatment, setTreatment] = useState<TreatmentFilterType>('All');
    const [viewMode, setViewMode] = useState<'Country' | 'Language'>('Country');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-auto">
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Globe size={20} /></div>
                        <h3 className="font-bold text-slate-800">Demographics</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-2">
                            <button onClick={() => setViewMode('Country')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'Country' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500'}`}>Country</button>
                            <button onClick={() => setViewMode('Language')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'Language' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500'}`}>Language</button>
                        </div>
                        <TreatmentSwitch active={treatment} onSelect={setTreatment} />
                        <button onClick={onViewDetails} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-esvita-primary"><ArrowRight size={18} /></button>
                    </div>
                </div>
                <div className={`${viewMode === 'Country' ? 'h-full' : 'h-auto'} overflow-x-auto custom-scrollbar`}>
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b border-slate-100 text-slate-400 text-xs uppercase"><th className="pb-2">{viewMode}</th><th className="pb-2 text-right">Leads</th><th className="pb-2 text-right">Interest</th><th className="pb-2 text-right">Ticket Value</th><th className="pb-2 text-right">Revenue</th><th className="pb-2 text-right">Conv.</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                            {viewMode === 'Country' ? (
                                countryData.slice(0, 5).map(c => {
                                    const mult = treatment === 'All' ? 1 : treatment === 'Hair' ? 0.6 : 0.4;
                                    const leads = Math.floor(c.leads * mult);
                                    const interested = Math.floor(c.interested * mult);
                                    const sales = Math.floor(c.sales * mult);
                                    const ticketVal = sales * 3500;
                                    const revenue = sales * 5000;
                                    return (
                                        <tr key={c.country} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 font-medium flex items-center gap-2"><img src={`https://flagcdn.com/24x18/${c.flagCode}.png`} alt="" className="w-5 rounded-sm shadow-sm" /> <span className="text-slate-700">{c.country}</span></td>
                                            <td className="py-3 text-right font-medium text-slate-700">{leads}</td>
                                            <td className="py-3 text-right text-slate-600">{Math.floor((interested / leads || 0) * 100)}%</td>
                                            <td className="py-3 text-right text-slate-600">€{(ticketVal / 1000).toFixed(1)}k</td>
                                            <td className="py-3 text-right font-bold text-slate-800">€{(revenue / 1000).toFixed(1)}k</td>
                                            <td className="py-3 text-right font-medium text-esvita-primary">{c.conversionRate}%</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                languageData.map(l => {
                                    const mult = treatment === 'All' ? 1 : treatment === 'Hair' ? 0.6 : 0.4;
                                    const leads = Math.floor(l.count * mult);
                                    const interested = Math.floor(l.interested * mult);
                                    const sales = Math.floor(l.sales * mult);
                                    const ticketVal = sales * 3500;
                                    const revenue = sales * 5000;
                                    const cvr = ((sales / leads || 0) * 100).toFixed(1);

                                    return (
                                        <tr key={l.language} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 font-medium text-slate-700">{l.language}</td>
                                            <td className="py-3 text-right font-medium text-slate-700">{leads}</td>
                                            <td className="py-3 text-right text-slate-600">{Math.floor((interested / leads || 0) * 100)}%</td>
                                            <td className="py-3 text-right text-slate-600">€{(ticketVal / 1000).toFixed(1)}k</td>
                                            <td className="py-3 text-right font-bold text-slate-800">€{(revenue / 1000).toFixed(1)}k</td>
                                            <td className="py-3 text-right font-medium text-esvita-primary">{cvr}%</td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Detailed Views Logic ---
const MarketingIntelligenceView = ({ adData }: { adData: AdPerformance[] }) => {
    const [treatment, setTreatment] = useState<TreatmentFilterType>('All');

    // Filter/Scale data based on treatment
    const processedData = useMemo(() => {
        const mult = treatment === 'All' ? 1 : treatment === 'Hair' ? 0.6 : 0.4;
        return adData.map(d => ({
            ...d,
            spend: d.spend * mult,
            revenue: d.revenue * mult,
            leads: Math.floor(d.leads * mult),
            interested: Math.floor(d.interested * mult),
            salesCount: Math.floor(d.salesCount * mult)
        }));
    }, [adData, treatment]);

    // Calculate stats from dynamic data
    const stats = useMemo(() => {
        let spend = 0, rev = 0, leads = 0, interested = 0;
        processedData.forEach(d => { spend += d.spend; rev += d.revenue; leads += d.leads; interested += d.interested; });
        return {
            spend: `€${Math.round(spend / 1000)}k`,
            cpl: `€${leads ? (spend / leads).toFixed(1) : 0}`,
            rate: `${leads ? Math.round((interested / leads) * 100) : 0}%`,
            roas: `${spend ? (rev / spend).toFixed(1) : 0}x`
        };
    }, [processedData]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[{ label: "Total Ad Spend", val: stats.spend, icon: Banknote }, { label: "Avg Cost Per Lead", val: stats.cpl, icon: Target }, { label: "Interested Lead Rate", val: stats.rate, icon: UserCheck }, { label: "Global ROAS", val: stats.roas, icon: TrendingUp }].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4"><div className="p-3 bg-esvita-light text-esvita-primary rounded-lg"><stat.icon size={24} /></div><div><p className="text-xs text-slate-500 font-bold uppercase">{stat.label}</p><h4 className="text-xl font-bold text-slate-900">{stat.val}</h4></div></div>
                ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="font-bold text-slate-800 text-lg">Detailed Campaign Performance</h3>
                    <TreatmentSwitch active={treatment} onSelect={setTreatment} />
                </div>
                <div className="overflow-x-auto custom-scrollbar"><table className="w-full text-left"><thead><tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-500 uppercase tracking-wider"><th className="py-3 pl-4">Campaign</th><th className="py-3">Status</th><th className="py-3 text-right">Spend</th><th className="py-3 text-right">Leads</th><th className="py-3 text-right">CPL</th><th className="py-3 text-right">Interest</th><th className="py-3 text-right">Sales</th><th className="py-3 text-right">Revenue</th><th className="py-3 text-right pr-4">ROAS</th></tr></thead><tbody className="divide-y divide-slate-100">{processedData.map(ad => (<tr key={ad.id} className="hover:bg-slate-50 transition-colors"><td className="py-3 pl-4"><div className="font-medium text-slate-900 text-sm">{ad.campaignName}</div><div className="text-xs text-slate-500">{ad.source}</div></td><td className="py-3"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ad.status === 'Active' ? 'bg-green-100 text-green-700' : ad.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>{ad.status}</span></td><td className="py-3 text-right text-sm text-slate-600">€{ad.spend.toLocaleString()}</td><td className="py-3 text-right text-sm font-medium">{ad.leads}</td><td className="py-3 text-right text-sm text-slate-600">€{(ad.spend / (ad.leads || 1)).toFixed(1)}</td><td className="py-3 text-right text-sm font-medium">{Math.round((ad.interested / (ad.leads || 1)) * 100)}%</td><td className="py-3 text-right text-sm font-medium">{ad.salesCount}</td><td className="py-3 text-right text-sm font-bold text-slate-900">€{ad.revenue.toLocaleString()}</td><td className="py-3 text-right pr-4 text-sm font-bold text-esvita-primary">{(ad.revenue / (ad.spend || 1)).toFixed(1)}x</td></tr>))}</tbody></table></div>
            </div>
        </div>
    );
};

const DailyActivityMetrics = ({ data, fullScreen }: { data: ActivityMetric[], fullScreen?: boolean }) => {
    const [teamFilter, setTeamFilter] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // In real app, you'd map agents to teams. Here we just mock filter since ACTIVITY_METRICS lacks teamId
    // We will assume a random distribution for the mock or check name includes
    const filteredData = useMemo(() => {
        if (teamFilter === 'All') return data;
        // Mock filtering: just picking some agents based on hash of name length or similar for demo
        // In reality, ActivityMetric should have teamId
        return data.filter((_, i) => i % 2 === 0);
    }, [data, teamFilter]);

    const displayData = fullScreen ? filteredData : filteredData.slice(0, 5);

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${fullScreen ? '' : ''}`}>
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Clock size={18} className="text-esvita-primary" /> Daily Activity Metrics</h3>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select
                            value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)}
                            className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-esvita-primary/20"
                        >
                            <option value="All">All Teams</option>
                            {TEAMS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="p-4 space-y-3">
                {displayData.map((am, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-esvita-primary shadow-sm">{am.agentName.charAt(0)}</div>
                            <div>
                                <div className="text-sm font-bold text-slate-800">{am.agentName}</div>
                                <div className="text-xs text-slate-500">Online</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 sm:gap-12 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-center">
                                <div className="font-bold text-slate-900 text-lg">{am.calls}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Calls</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-900 text-lg">{am.messages}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Msgs</div>
                            </div>
                            <div className="text-center">
                                <div className={`font-bold text-lg ${am.avgResponseTime < 5 ? 'text-green-600' : 'text-red-600'}`}>{am.avgResponseTime}m</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Resp.</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {!fullScreen && (
                <div className="p-3 border-t border-slate-100 text-center bg-slate-50/30">
                    <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-esvita-primary hover:underline">See All Activity</button>
                </div>
            )}

            <FullScreenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agent Activity Logs">
                <DailyActivityMetrics data={data} fullScreen />
            </FullScreenModal>
        </div>
    );
};

const SalesFunnelVisual = () => {
    // Calculate layers from FUNNEL_DATA
    // Layer 0 (Total): Sum of everything
    const totalMarket = FUNNEL_DATA.reduce((acc, curr) => acc + curr.count, 0);

    // Layer 1 (First Touch): New Lead + NR
    const firstTouch = FUNNEL_DATA.filter(d => ['New Lead', 'NR'].includes(d.stage)).reduce((acc, curr) => acc + curr.count, 0);

    // Layer 2 (Understanding): Waiting for Photo, Offer Sent, Interested No Details
    const understanding = FUNNEL_DATA.filter(d => ['Waiting for Photo', 'Offer Sent', 'Interested No Details'].includes(d.stage)).reduce((acc, curr) => acc + curr.count, 0);

    // Layer 3 (Closing): Waiting For Ticket, Ticket Received, Pre-Payment Received
    const closing = FUNNEL_DATA.filter(d => ['Waiting For Ticket', 'Ticket Received', 'Pre-Payment Received'].includes(d.stage)).reduce((acc, curr) => acc + curr.count, 0);

    // Layer 4 (Success): Operation Done
    const operation = FUNNEL_DATA.find(d => d.stage === 'Operation Done')?.count || 0;

    const layers = [
        { label: "Total Leads", count: totalMarket, color: "bg-slate-800", width: "100%", subtext: "All Statuses" },
        { label: "First Touch", count: firstTouch, color: "bg-teal-700", width: "85%", subtext: "New Lead, NR" },
        { label: "Understanding The Patient", count: understanding, color: "bg-teal-600", width: "65%", subtext: "Waiting for Photo, Offer Sent, Interested No Details" },
        { label: "Closing the Deal", count: closing, color: "bg-teal-500", width: "45%", subtext: "Waiting For Ticket, Ticket Received, Pre-Payment Received" },
        { label: "Operation Done", count: operation, color: "bg-yellow-500", width: "25%", subtext: "Operation Done" },
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 mb-6">
            <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2"><Filter size={18} className="text-esvita-primary" /> Sales Funnel Analysis</h3>
            <div className="flex flex-col items-center space-y-1">
                {layers.map((layer, index) => (
                    <div
                        key={index}
                        className={`relative flex items-center justify-center p-3 text-white transition-all hover:scale-[1.01] cursor-default group`}
                        style={{
                            width: layer.width,
                            backgroundColor: '', // Handled by class
                            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
                            minHeight: '60px'
                        }}
                    >
                        <div className={`absolute inset-0 ${layer.color} shadow-lg`}></div>
                        <div className="relative z-10 text-center flex flex-col items-center">
                            <div className="font-bold text-lg leading-none mb-1 flex items-baseline gap-2">
                                {layer.count.toLocaleString()}
                                {totalMarket > 0 && (
                                    <span className="text-sm font-medium opacity-80">
                                        ({((layer.count / totalMarket) * 100).toFixed(1)}%)
                                    </span>
                                )}
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wide opacity-90">{layer.label}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {layers.map((l, i) => (
                    <div key={i} className="flex flex-col items-center group relative cursor-help">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-2 px-3 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg text-center">
                            <div className="font-bold mb-1 opacity-50 uppercase text-[10px]">Included Statuses</div>
                            <div className="font-medium">{l.subtext}</div>
                            {/* Little arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>

                        <div className={`w-3 h-3 rounded-full mb-2 ${l.color}`}></div>
                        <span className="text-xs font-bold text-slate-500 uppercase">{l.label}</span>
                        <span className="text-sm font-bold text-slate-800">{l.count.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AgentActivityView = ({ activityData, agentPerfData }: { activityData: ActivityMetric[], agentPerfData: AgentPerformance[] }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DailyActivityMetrics data={activityData} />

            <SalesFunnelVisual />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Filter size={18} className="text-esvita-primary" /> Lead Status Analysis</h3>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 100, right: 30, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="stage" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                            {FUNNEL_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < 3 ? '#0F766E' : index < 6 ? '#14B8A6' : index < 10 ? '#2DD4BF' : '#5EEAD4'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <PerformanceMonitorWidget agentData={agentPerfData} />
        </div>
    );
};

const SalesPerformanceView = ({ countryData, languageData }: { countryData: SalesByCountry[], languageData: LanguageMetric[] }) => {
    const [isFullDemographicsOpen, setIsFullDemographicsOpen] = useState(false);

    // Dynamic chart data generator
    const generateChartData = () => {
        return FORECAST_DATA.map(d => ({
            ...d,
            confirmedRevenue: d.confirmedRevenue * (0.8 + Math.random() * 0.4),
            expectedRevenue: d.expectedRevenue * (0.8 + Math.random() * 0.4),
            probabilityWeighted: d.probabilityWeighted * (0.8 + Math.random() * 0.4)
        }));
    };
    const chartData = useMemo(() => generateChartData(), [countryData]); // Regen when data changes

    const DemographicsTable = ({ limit, fullScreen }: { limit?: number, fullScreen?: boolean }) => {
        const [treatment, setTreatment] = useState<TreatmentFilterType>('All');
        const [viewMode, setViewMode] = useState<'Country' | 'Language'>('Country');
        const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

        const sortedData = useMemo(() => {
            let sortable: any[] = viewMode === 'Country' ? [...countryData] : [...languageData];

            if (sortConfig) {
                sortable.sort((a, b) => {
                    let aVal = a[sortConfig.key];
                    let bVal = b[sortConfig.key];
                    if (sortConfig.key === 'leads' && viewMode === 'Language') { aVal = a.count; bVal = b.count; }
                    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                });
            }
            return sortable;
        }, [sortConfig, viewMode, countryData, languageData]);

        const requestSort = (key: string) => {
            let direction: 'asc' | 'desc' = 'desc';
            if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') direction = 'asc';
            setSortConfig({ key, direction });
        };

        const displayData = (limit && viewMode === 'Country') ? sortedData.slice(0, limit) : sortedData;
        const SortIcon = ({ col }: { col: string }) => <div className="inline-block ml-1 text-slate-400">{sortConfig?.key === col ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={12} />}</div>;

        return (
            <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${fullScreen ? '' : 'overflow-hidden'}`}>
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Globe size={20} /></div>
                        <h3 className="font-bold text-slate-800">Regional Breakdown</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            <button onClick={() => setViewMode('Country')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'Country' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500'}`}>Country</button>
                            <button onClick={() => setViewMode('Language')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'Language' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500'}`}>Language</button>
                        </div>
                        <TreatmentSwitch active={treatment} onSelect={setTreatment} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <th onClick={() => requestSort(viewMode === 'Country' ? 'country' : 'language')} className="px-6 py-3 cursor-pointer hover:bg-slate-100">{viewMode} <SortIcon col={viewMode === 'Country' ? 'country' : 'language'} /></th>
                                <th onClick={() => requestSort('leads')} className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100">Leads <SortIcon col="leads" /></th>
                                <th onClick={() => requestSort('interested')} className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100">Interest % <SortIcon col="interested" /></th>
                                <th onClick={() => requestSort('sales')} className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100">Ticket Amount <SortIcon col="sales" /></th>
                                <th onClick={() => requestSort('roas')} className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100">Revenue <SortIcon col="roas" /></th>
                                <th onClick={() => requestSort('conversionRate')} className="px-6 py-3 text-right cursor-pointer hover:bg-slate-100">Conv. Rate <SortIcon col="conversionRate" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayData.map((item, i) => {
                                const mult = treatment === 'All' ? 1 : treatment === 'Hair' ? 0.6 : 0.4;
                                let name, leads, interested, sales, revenue, ticketVal, cvr, flag;

                                if (viewMode === 'Country') {
                                    const c = item as SalesByCountry;
                                    name = c.country;
                                    flag = c.flagCode;
                                    leads = Math.floor(c.leads * mult);
                                    interested = Math.floor((c.interested / c.leads) * 100);
                                    sales = c.sales * mult;
                                    ticketVal = sales * 3500;
                                    revenue = sales * 5000;
                                    cvr = c.conversionRate;
                                } else {
                                    const l = item as any; // LanguageMetric
                                    name = l.language;
                                    leads = Math.floor(l.count * mult);
                                    interested = Math.floor((l.interested / l.count) * 100);
                                    sales = l.sales * mult;
                                    ticketVal = sales * 3500;
                                    revenue = sales * 5000;
                                    cvr = ((sales / leads || 0) * 100).toFixed(1);
                                }

                                return (
                                    <tr key={name} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3 font-medium text-slate-700 flex items-center gap-2">
                                            {flag && <img src={`https://flagcdn.com/24x18/${flag}.png`} alt="" className="rounded-sm shadow-sm" />}
                                            {name}
                                        </td>
                                        <td className="px-6 py-3 text-right text-sm">{leads}</td>
                                        <td className="px-6 py-3 text-right text-sm font-medium">{interested}%</td>
                                        <td className="px-6 py-3 text-right text-sm text-slate-600">€{ticketVal.toLocaleString()}</td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-900">€{(revenue / 1000).toFixed(1)}k</td>
                                        <td className="px-6 py-3 text-right text-sm font-medium text-esvita-primary">{cvr}%</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {!fullScreen && limit && viewMode === 'Country' && (
                        <div className="p-3 border-t border-slate-100 text-center">
                            <button onClick={() => setIsFullDemographicsOpen(true)} className="text-sm font-medium text-esvita-primary hover:underline">See All Countries</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <SalesTrendChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"><h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-esvita-primary" /> Revenue Forecast (6 Months)</h3><ResponsiveContainer width="100%" height={300}><ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}><CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `€${val / 1000}k`} /><Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(val: number) => `€${val.toLocaleString()}`} /><Legend /><Bar dataKey="confirmedRevenue" name="Confirmed Revenue" stackId="a" fill="#0F766E" radius={[0, 0, 4, 4]} barSize={32} /><Bar dataKey="expectedRevenue" name="Expected Pipeline" stackId="a" fill="#99F6E4" radius={[4, 4, 0, 0]} barSize={32} /><Line type="monotone" dataKey="probabilityWeighted" name="Weighted Forecast" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4 }} /></ComposedChart></ResponsiveContainer></div>
                <DemographicsTable limit={10} />
            </div>
            <FullScreenModal isOpen={isFullDemographicsOpen} onClose={() => setIsFullDemographicsOpen(false)} title="Detailed Regional Breakdown"><DemographicsTable fullScreen /></FullScreenModal>
        </div>
    );
};


const SalesTrendChart = () => {
    const [timeframe, setTimeframe] = useState<'Week' | 'Month' | 'Quarter' | 'Half' | 'Year'>('Year');
    const generateData = (tf: string) => {
        const count = tf === 'Week' ? 7 : tf === 'Month' ? 4 : tf === 'Quarter' ? 3 : 6;
        return Array.from({ length: count }, (_, i) => ({
            name: tf === 'Week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : tf === 'Month' ? `Week ${i + 1}` : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
            revenue: Math.floor(Math.random() * 500000) + 100000,
            tickets: Math.floor(Math.random() * 450000) + 50000
        }));
    };
    const data = useMemo(() => generateData(timeframe), [timeframe]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3"><div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div><h3 className="font-bold text-slate-800">Sales Trend Analysis</h3></div>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    {['Week', 'Month', 'Quarter', 'Half', 'Year'].map(t => (
                        <button key={t} onClick={() => setTimeframe(t as any)} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeframe === t ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500'}`}>{t}</button>
                    ))}
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0F766E" stopOpacity={0.1} /><stop offset="95%" stopColor="#0F766E" stopOpacity={0} /></linearGradient><linearGradient id="colorTix" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1} /><stop offset="95%" stopColor="#F59E0B" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `€${val / 1000}k`} domain={[0, 750000]} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `€${val / 1000}k`} domain={[0, 750000]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(val: number) => `€${val.toLocaleString()}`} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0F766E" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} name="Total Revenue" />
                    <Area yAxisId="right" type="monotone" dataKey="tickets" stroke="#F59E0B" fillOpacity={1} fill="url(#colorTix)" strokeWidth={3} name="Ticket Value" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const TargetProgress = ({ actual, target }: { actual: number, target: number }) => {
    const pct = Math.min((actual / target) * 100, 100);
    const isHigh = pct >= 80;
    const isMid = pct >= 50;
    const colorClass = isHigh ? 'bg-green-500' : isMid ? 'bg-yellow-500' : 'bg-red-500';
    return (
        <div className="w-full">
            <div className="flex justify-end items-baseline gap-1.5 mb-2 text-xs">
                <span className="font-bold text-slate-900 text-sm">€{Math.round(actual / 1000)}k</span>
                <span className="text-slate-400 font-medium">/ €{Math.round(target / 1000)}k</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${colorClass}`} style={{ width: `${pct}%` }}></div>
            </div>
        </div>
    );
};

const PerformanceMonitorWidget = ({ agentData }: { agentData?: AgentPerformance[] }) => {
    const [viewMode, setViewMode] = useState<'Agents' | 'Teams'>('Agents');
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('Month');

    // Use dynamic data if provided, else use static Team data for Teams view
    const data = viewMode === 'Agents' ? (agentData || AGENT_DATA) : TEAM_DATA;

    // Apply local time filter visual effect only (actual numbers come from props for Agents)
    // For Teams, we just mock scale since we didn't dynamic-ize Teams fully yet
    const scale = getTimeMultiplier(timeFilter === 'Today' ? 'Today' : timeFilter === 'Week' ? 'This Week' : 'This Month');

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6">
                    <h3 className="font-bold text-lg text-slate-900">Performance Monitor</h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setViewMode('Agents')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${viewMode === 'Agents' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Users size={14} /> Agents
                        </button>
                        <button onClick={() => setViewMode('Teams')} className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${viewMode === 'Teams' ? 'bg-white shadow-sm text-esvita-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                            <Briefcase size={14} /> Teams
                        </button>
                    </div>
                </div>
                <CardFilter active={timeFilter} onSelect={setTimeFilter} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-4 pl-8">{viewMode === 'Agents' ? 'Agent' : 'Team'}</th>
                            <th className="px-6 py-4 text-center">Leads</th>
                            <th className="px-6 py-4 text-center">Interest Rate</th>
                            <th className="px-6 py-4 text-right">Ticket Sales</th>
                            <th className="px-6 py-4 text-right pr-8">Revenue</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((item: any) => {
                            // Apply scaling if it's Team view (since Agent view data is passed down pre-scaled)
                            const displayLeads = viewMode === 'Teams' ? Math.floor(item.totalLeads * scale) : item.totalLeads;
                            const displayTicketVal = viewMode === 'Teams' ? item.ticketValue * scale : item.ticketValue;
                            const displayRevenue = viewMode === 'Teams' ? item.revenue * scale : item.revenue;

                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            {viewMode === 'Agents' ? (
                                                <div className="relative">
                                                    <img src={item.avatar} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${item.status === 'Online' ? 'bg-green-500' : item.status === 'Busy' ? 'bg-yellow-500' : 'bg-slate-300'}`}></span>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                    {item.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center font-medium text-slate-600">{displayLeads}</td>
                                    <td className="px-6 py-5 text-center font-bold text-slate-800">{item.interestRate}%</td>
                                    <td className="px-6 py-5 max-w-[200px]">
                                        <TargetProgress actual={displayTicketVal} target={item.ticketTarget} />
                                    </td>
                                    <td className="px-6 py-5 max-w-[200px] pr-8">
                                        <TargetProgress actual={displayRevenue} target={item.revenueTarget} />
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Layout Components ---





// --- MAIN APP COMPONENT ---
// --- Authenticated Layout ---
const DashboardContent = () => {
    // --- Dashboard Logic ---
    const {
        currentView,
        globalFilter,
        isLoading,
        selectedMarketingSources,
        selectedTeamAgents,
        processedData,
        setGlobalFilter,
        setSelectedTeamAgents,
        setSelectedMarketingSources,
        handleViewChange: hookHandleViewChange,
        handleApplyCustomDate,
        handleKPIClick
    } = useDashboardData();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
    const [isInterestedModalOpen, setIsInterestedModalOpen] = useState(false);

    // Wrap proper handleViewChange to include UI side-effects
    const handleViewChange = (view: ViewType) => {
        hookHandleViewChange(view);
        setIsSidebarOpen(false);
    };

    const onKPIClick = (id: string) => {
        if (id === 'leads') {
            setIsLeadsModalOpen(true);
        } else if (id === 'interested') {
            setIsInterestedModalOpen(true);
        } else {
            handleKPIClick(id);
        }
    };

    // Dashboard View
    const DashboardView = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processedData.kpis.map((kpi) => <KPICard key={kpi.id} data={kpi} globalTimeframe={globalFilter} onViewDetails={onKPIClick} />)}
            </div>
            <SalesTrendChart />
            <MarketingWidget data={processedData.ads} onViewDetails={() => handleViewChange('marketing')} />
            <DemographicsWidget countryData={processedData.countries} languageData={processedData.languages} onViewDetails={() => handleViewChange('sales')} />
            <PerformanceMonitorWidget agentData={processedData.agents} />
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} currentView={currentView} onViewChange={handleViewChange} />

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden md:ml-64">
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    onApplyCustomDate={handleApplyCustomDate}
                    selectedTeamAgents={selectedTeamAgents}
                    setSelectedTeamAgents={setSelectedTeamAgents}
                    currentView={currentView}
                    selectedMarketingSources={selectedMarketingSources}
                    setSelectedMarketingSources={setSelectedMarketingSources}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="animate-spin text-esvita-primary" size={40} />
                                <p className="text-sm font-medium text-slate-600">Updating metrics...</p>
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                            <button onClick={() => handleViewChange('dashboard')} className="hover:text-esvita-primary flex items-center gap-1 font-medium"><Home size={14} /> Dashboard</button>
                            {currentView !== 'dashboard' && (
                                <>
                                    <ChevronRight size={14} />
                                    <span className="font-semibold text-esvita-primary capitalize">
                                        {currentView === 'marketing' ? 'Marketing Intelligence' : currentView === 'agent' ? 'Agent Activity' : 'Sales Performance'}
                                    </span>
                                </>
                            )}
                        </div>

                        {currentView === 'dashboard' && <DashboardView />}
                        {currentView === 'marketing' && <MarketingIntelligenceView adData={processedData.ads} />}
                        {currentView === 'agent' && <AgentActivityView activityData={processedData.activity} agentPerfData={processedData.agents} />}
                        {currentView === 'sales' && <SalesPerformanceView countryData={processedData.countries} languageData={processedData.languages} />}
                    </div>
                </main>
            </div>

            {/* Modals */}
            <LeadsDrilldownModal
                isOpen={isLeadsModalOpen}
                onClose={() => setIsLeadsModalOpen(false)}
                globalTimeframe={globalFilter}
            />
            <InterestedLeadsDrilldownModal
                isOpen={isInterestedModalOpen}
                onClose={() => setIsInterestedModalOpen(false)}
            />
        </div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    // --- Auth State ---
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('executive_auth') === 'true';
    });

    const handleLogin = () => {
        sessionStorage.setItem('executive_auth', 'true');
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return <DashboardContent />;
}
