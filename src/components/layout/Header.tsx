import React, { useState, useRef, useEffect } from 'react';
import {
    Menu,
    Search,
    Calendar,
    ChevronDown,
    Megaphone,
    Globe,
    Users,
    Check,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { ViewType } from '../../../types';
import {
    SOURCE_DATA,
    SOURCE_ICONS,
    TEAMS_LIST,
    AGENTS_LIST
} from '../../../constants';
import { formatDateInput, parseDateInput, isSameDay } from '../../../utils';

// --- Helper Components ---

const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-esvita-primary border-esvita-primary' : 'bg-white border-slate-300'}`}>
        {checked && <Check size={10} className="text-white" />}
    </div>
);

const SourceMultiSelect = ({ selectedSources, setSelectedSources }: { selectedSources: Set<string>, setSelectedSources: (s: Set<string>) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggle = (s: string) => {
        const n = new Set(selectedSources);
        if (n.has(s)) n.delete(s); else n.add(s);
        setSelectedSources(n);
    };

    const handleSelectAll = () => setSelectedSources(new Set(SOURCE_DATA.map(s => s.name)));
    const handleClearAll = () => setSelectedSources(new Set());

    const label = selectedSources.size === SOURCE_DATA.length ? "All Sources" : selectedSources.size === 0 ? "No Sources" : `${selectedSources.size} Selected`;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-colors text-sm font-medium ${isOpen ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                <Megaphone size={14} className={isOpen ? 'text-blue-500' : 'text-slate-500'} />
                {label}
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-2 border-b border-slate-50 bg-slate-50/50">
                        <button onClick={handleSelectAll} className="text-[10px] font-bold text-esvita-primary uppercase tracking-wider px-2 py-1 rounded hover:bg-teal-50">Select All</button>
                        <button onClick={handleClearAll} className="text-[10px] font-bold text-red-500 uppercase tracking-wider px-2 py-1 rounded hover:bg-red-50">Clear All</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
                        {SOURCE_DATA.map(s => {
                            const Icon = SOURCE_ICONS[s.name] || Globe;
                            return (
                                <div key={s.name} onClick={() => toggle(s.name)} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <Icon size={14} className="text-slate-400 group-hover:text-slate-600" />
                                        <span className="text-sm text-slate-700 font-medium">{s.name}</span>
                                    </div>
                                    <Checkbox checked={selectedSources.has(s.name)} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const TeamAgentFilter = ({ selectedItems, setSelectedItems, onFilterChange }: { selectedItems: Set<string>, setSelectedItems: (s: Set<string>) => void, onFilterChange: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setIsOpen(false);
        onFilterChange();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) handleClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const toggleItem = (item: string) => {
        const newSet = new Set(selectedItems);
        if (newSet.has(item)) newSet.delete(item); else newSet.add(item);
        setSelectedItems(newSet);
    };

    const handleSelectAll = () => setSelectedItems(new Set([...TEAMS_LIST, ...AGENTS_LIST]));
    const handleClearAll = () => setSelectedItems(new Set());

    const totalItems = TEAMS_LIST.length + AGENTS_LIST.length;
    let label = selectedItems.size === totalItems ? "All Teams & Agents" : selectedItems.size === 0 ? "No Selection" : selectedItems.size === 1 ? (Array.from(selectedItems)[0] as string) : `${selectedItems.size} Selected`;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => isOpen ? handleClose() : setIsOpen(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors bg-white border-slate-200 text-slate-700 hover:bg-slate-50 ${isOpen ? 'ring-2 ring-esvita-primary/20 border-esvita-primary' : ''}`}>
                <Users size={14} className="text-slate-500" />
                <span className="text-xs font-medium min-w-[100px] text-left truncate max-w-[140px]">{label}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between p-3 border-b border-slate-50 bg-slate-50/50">
                        <button onClick={handleSelectAll} className="text-[10px] font-bold text-esvita-primary uppercase tracking-wider">Select All</button>
                        <button onClick={handleClearAll} className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Clear All</button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                        <div className="mb-2">
                            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teams</div>
                            {TEAMS_LIST.map(team => (
                                <div key={team} onClick={() => toggleItem(team)} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                                    <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900">{team}</span>
                                    <Checkbox checked={selectedItems.has(team)} />
                                </div>
                            ))}
                        </div>
                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                        <div>
                            <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agents</div>
                            {AGENTS_LIST.map(agent => (
                                <div key={agent} onClick={() => toggleItem(agent)} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                                    <span className="text-sm text-slate-700 group-hover:text-slate-900">{agent}</span>
                                    <Checkbox checked={selectedItems.has(agent)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DateRangeModal = ({ isOpen, onClose, onApply }: { isOpen: boolean, onClose: () => void, onApply: (start: string, end: string) => void }) => {
    const [viewDate, setViewDate] = useState(new Date(2023, 9, 1));
    const [startDate, setStartDate] = useState<Date | null>(new Date(2023, 9, 6));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2023, 9, 13));
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const handleMouseDown = (date: Date) => { setStartDate(date); setEndDate(date); setIsDragging(true); };
    const handleMouseEnter = (date: Date) => { if (isDragging) setEndDate(date); };
    const handleMouseUp = () => { setIsDragging(false); if (startDate && endDate && startDate > endDate) { setStartDate(endDate); setEndDate(startDate); } };

    const calendarCells = [];
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarCells.push(new Date(year, month, i));

    const getCellClass = (date: Date | null) => {
        if (!date) return "invisible";
        let s = startDate, e = endDate;
        if (isDragging && s && e && s > e) [s, e] = [e, s];
        const isStart = s && isSameDay(date, s), isEnd = e && isSameDay(date, e), inRange = s && e && date > s && date < e;
        const base = "h-8 w-8 flex items-center justify-center text-xs rounded-lg cursor-pointer select-none transition-all";
        if (isStart || isEnd) return `${base} bg-esvita-primary text-white font-bold`;
        if (inRange) return `${base} bg-teal-50 text-teal-800 rounded-none first:rounded-l-lg last:rounded-r-lg`;
        return `${base} hover:bg-slate-100 text-slate-700`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onMouseUp={handleMouseUp}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between mb-4"><h3 className="font-semibold">Select Date Range</h3><X onClick={onClose} className="cursor-pointer text-slate-400" /></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="date" value={formatDateInput(startDate)} onChange={(e) => setStartDate(parseDateInput(e.target.value))} className="w-full border rounded p-2 text-sm" />
                    <input type="date" value={formatDateInput(endDate)} onChange={(e) => setEndDate(parseDateInput(e.target.value))} className="w-full border rounded p-2 text-sm" />
                </div>
                <div className="border rounded-xl p-4 mb-4 select-none">
                    <div className="flex justify-between mb-2">
                        <ChevronLeft onClick={() => setViewDate(new Date(year, month - 1))} className="cursor-pointer text-slate-400" />
                        <span className="font-bold text-sm">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <ChevronRight onClick={() => setViewDate(new Date(year, month + 1))} className="cursor-pointer text-slate-400" />
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {calendarCells.map((d, i) => <div key={i} className={getCellClass(d)} onMouseDown={() => d && handleMouseDown(d)} onMouseEnter={() => d && handleMouseEnter(d)}>{d?.getDate()}</div>)}
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                    <button onClick={() => { if (startDate && endDate) onApply(formatDateInput(startDate), formatDateInput(endDate)); onClose(); }} className="px-4 py-2 text-sm bg-esvita-primary text-white rounded-lg">Apply</button>
                </div>
            </div>
        </div>
    );
};

// --- Header Component ---

interface HeaderProps {
    onMenuClick: () => void;
    globalFilter: string;
    setGlobalFilter: (v: string) => void;
    onApplyCustomDate: (start: string, end: string) => void;
    selectedTeamAgents: Set<string>;
    setSelectedTeamAgents: (s: Set<string>) => void;
    currentView: ViewType;
    selectedMarketingSources?: Set<string>;
    setSelectedMarketingSources?: (s: Set<string>) => void;
}

const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    globalFilter,
    setGlobalFilter,
    onApplyCustomDate,
    selectedTeamAgents,
    setSelectedTeamAgents,
    currentView,
    selectedMarketingSources,
    setSelectedMarketingSources
}) => {
    const [isDateModalOpen, setIsDateModalOpen] = useState(false);
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm/50">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"><Menu size={24} /></button>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg w-64 border border-transparent focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100 transition-all">
                    <Search size={16} className="text-slate-400" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                {currentView === 'marketing' && selectedMarketingSources && setSelectedMarketingSources && (
                    <div className="hidden md:block">
                        <SourceMultiSelect selectedSources={selectedMarketingSources} setSelectedSources={setSelectedMarketingSources} />
                    </div>
                )}
                <div className="relative group">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-sm">
                        <Calendar size={16} className="text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">{globalFilter}</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block z-50">
                        {['Today', 'This Week', 'This Month'].map(f => <button key={f} onClick={() => setGlobalFilter(f)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{f}</button>)}
                        <div className="h-px bg-slate-100 my-1"></div>
                        <button onClick={() => setIsDateModalOpen(true)} className="w-full text-left px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 font-medium">Custom Range...</button>
                    </div>
                </div>
                <div className="hidden md:block">
                    <TeamAgentFilter
                        selectedItems={selectedTeamAgents}
                        setSelectedItems={setSelectedTeamAgents}
                        onFilterChange={() => { }}
                    />
                </div>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200">SE</div>
            </div>
            <DateRangeModal isOpen={isDateModalOpen} onClose={() => setIsDateModalOpen(false)} onApply={onApplyCustomDate} />
        </header>
    );
};

export default Header;
