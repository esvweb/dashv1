import { useState, useEffect, useMemo } from 'react';
import { ViewType } from '../../types';
import {
    KPI_DATA,
    COUNTRY_DATA,
    AGENT_DATA,
    TEAM_DATA,
    SOURCE_DATA,
    TEAMS_LIST,
    AGENTS_LIST,
    AD_PERFORMANCE_DATA,
    ACTIVITY_METRICS,
    LANGUAGE_DATA
} from '../../constants';
import { getTimeMultiplier, formatDate } from '../../utils';

export const useDashboardData = () => {
    const [currentView, setCurrentView] = useState<ViewType>('dashboard');
    const [globalFilter, setGlobalFilter] = useState('This Month');
    const [isLoading, setIsLoading] = useState(false);

    // Filter States
    const [marketingSourceFilter, setMarketingSourceFilter] = useState<string | undefined>(undefined);
    const [selectedMarketingSources, setSelectedMarketingSources] = useState<Set<string>>(new Set(SOURCE_DATA.map(s => s.name)));
    const [selectedTeamAgents, setSelectedTeamAgents] = useState<Set<string>>(new Set([...TEAMS_LIST, ...AGENTS_LIST]));

    // Loading simulation when filters change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 400);
        return () => clearTimeout(timer);
    }, [globalFilter, currentView, selectedTeamAgents, selectedMarketingSources]);

    // Sync drilldown state
    useEffect(() => {
        if (marketingSourceFilter) {
            setSelectedMarketingSources(new Set([marketingSourceFilter]));
        }
    }, [marketingSourceFilter]);

    const handleApplyCustomDate = (start: string, end: string) => {
        const startFmt = formatDate(start);
        const endFmt = formatDate(end);
        setGlobalFilter(`${startFmt} - ${endFmt}`);
    };

    const handleViewChange = (view: ViewType) => {
        setCurrentView(view);
        setMarketingSourceFilter(undefined);
        if (view === 'marketing' && !marketingSourceFilter) {
            setSelectedMarketingSources(new Set(SOURCE_DATA.map(s => s.name)));
        }
    };

    const handleKPIClick = (id: string) => {
        if (id === 'leads' || id === 'interested') handleViewChange('marketing');
        else if (id === 'tickets' || id === 'revenue') handleViewChange('sales');
    };

    // --- DATA PROCESSING ENGINE ---
    const processedData = useMemo(() => {
        // 1. Calculate Multipliers based on Time and Filter selections
        const timeMult = getTimeMultiplier(globalFilter);

        const totalAgents = TEAMS_LIST.length + AGENTS_LIST.length; // Approximate logic
        const activeAgentCount = selectedTeamAgents.size;
        const agentFactor = activeAgentCount / totalAgents;

        // Random noise seed based on filter string to make it consistent but different per filter
        const seed = globalFilter.length + activeAgentCount;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const noise = (base: number) => base * (0.9 + (seed % 20) / 100);

        // 2. Process KPIs
        // If fewer agents selected, KPIs drop proportionally
        const kpiMult = timeMult * agentFactor;

        const kpis = KPI_DATA.map(k => ({
            ...k,
            value: k.value * kpiMult, // Scale value
            change: k.change + (seed % 5) - 2 // Randomize change slightly
        }));

        // 3. Process Agent Data
        // Filter list first
        let agents = AGENT_DATA.filter(a => selectedTeamAgents.has(a.name));
        // Then scale numbers
        agents = agents.map(a => ({
            ...a,
            totalLeads: Math.floor(a.totalLeads * timeMult),
            ticketValue: a.ticketValue * timeMult,
            revenue: a.revenue * timeMult
        }));

        // 4. Process Activity Metrics
        let activity = ACTIVITY_METRICS.filter(a => selectedTeamAgents.has(a.agentName));
        activity = activity.map(a => ({
            ...a,
            calls: Math.floor(a.calls * timeMult),
            messages: Math.floor(a.messages * timeMult),
            tasksCompleted: Math.floor(a.tasksCompleted * timeMult)
        }));

        // 5. Process Marketing Data
        // Filter by Source
        let ads = AD_PERFORMANCE_DATA.filter(ad => selectedMarketingSources.has(ad.source));
        // Scale by Time
        ads = ads.map(ad => ({
            ...ad,
            spend: ad.spend * timeMult,
            revenue: ad.revenue * timeMult,
            leads: Math.floor(ad.leads * timeMult),
            interested: Math.floor(ad.interested * timeMult),
            salesCount: Math.floor(ad.salesCount * timeMult)
        }));

        // 6. Process Demographics (Sales Performance)
        // Just scale by Time for now
        const countries = COUNTRY_DATA.map(c => ({
            ...c,
            leads: Math.floor(c.leads * timeMult * agentFactor), // Agents also affect sales
            sales: Math.floor(c.sales * timeMult * agentFactor),
            interested: Math.floor(c.interested * timeMult * agentFactor)
        }));

        const languages = LANGUAGE_DATA.map(l => ({
            ...l,
            count: Math.floor(l.count * timeMult * agentFactor),
            sales: Math.floor(l.sales * timeMult * agentFactor),
            interested: Math.floor(l.interested * timeMult * agentFactor)
        }));

        return { kpis, agents, activity, ads, countries, languages };

    }, [globalFilter, selectedTeamAgents, selectedMarketingSources]);

    return {
        currentView,
        globalFilter,
        isLoading,
        selectedMarketingSources,
        selectedTeamAgents,
        processedData,
        setCurrentView,
        setGlobalFilter,
        setSelectedMarketingSources,
        setSelectedTeamAgents,
        handleViewChange,
        handleApplyCustomDate,
        handleKPIClick
    };
};
