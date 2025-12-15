import React from 'react';
import {
    LayoutDashboard,
    Users,
    X,
    TrendingUp,
    Megaphone,
} from 'lucide-react';
import { ViewType } from '../../../types';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    currentView: ViewType;
    onViewChange: (v: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, onViewChange }) => {
    return (
        <>
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 text-slate-800 transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                <div className="h-32 flex items-center justify-center border-b border-slate-100 px-6">
                    <img src="https://esvitaclinic.com/wp-content/uploads/2025/06/esvita-logo.svg" alt="Esvita Clinic" className="h-20 w-auto" />
                    <button onClick={() => setIsOpen(false)} className="ml-auto md:hidden text-slate-400 hover:text-slate-900"><X size={24} /></button>
                </div>
                <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                    <div className="px-6 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main</div>
                    <nav className="space-y-1 px-3 mb-8">
                        <button onClick={() => onViewChange('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                    </nav>
                    <div className="px-6 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Performance Modules</div>
                    <nav className="space-y-1 px-3">
                        <button onClick={() => onViewChange('marketing')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${currentView === 'marketing' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            <Megaphone size={20} /> Marketing Intelligence
                        </button>
                        <button onClick={() => onViewChange('agent')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${currentView === 'agent' ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            <Users size={20} /> Agent Activity
                        </button>
                        <button onClick={() => onViewChange('sales')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${currentView === 'sales' ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                            <TrendingUp size={20} /> Sales Performance
                        </button>
                    </nav>
                </div>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}
        </>
    );
};

export default Sidebar;
