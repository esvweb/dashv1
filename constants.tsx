
import React from 'react';
import { 
  Users, 
  Banknote, 
  Ticket, 
  UserCheck, 
  Facebook, 
  Instagram, 
  Search, 
  Smartphone,
  Globe,
  MessageCircle
} from 'lucide-react';
import { SalesByCountry, AgentPerformance, TeamPerformance, SalesTrendData, SourceData, KPIMetric, LanguageMetric, AdPerformance, ActivityMetric, FunnelStage, SalesForecast } from './types';

export const KPI_DATA: KPIMetric[] = [
  {
    id: "leads",
    title: "Total Leads",
    value: 8120,
    change: 4,
    isPositive: true,
    icon: Users
  },
  {
    id: "interested",
    title: "Interested Leads",
    value: 3765,
    change: 7,
    isPositive: true,
    icon: UserCheck 
  },
  {
    id: "tickets",
    title: "Ticket Received",
    value: 1245,
    change: 15,
    isPositive: true,
    icon: Ticket
  },
  {
    id: "revenue",
    title: "Total Revenue",
    value: 4.58,
    prefix: "€",
    suffix: "M",
    change: 5,
    isPositive: true,
    icon: Banknote
  }
];

export const COUNTRY_DATA: SalesByCountry[] = [
  { country: "Turkey", leads: 2540, interested: 1110, sales: 520, conversionRate: 20.4, roas: 4.2, flagCode: "tr" },
  { country: "Germany", leads: 1830, interested: 855, sales: 255, conversionRate: 13.9, roas: 3.8, flagCode: "de" },
  { country: "United Kingdom", leads: 1340, interested: 590, sales: 210, conversionRate: 15.6, roas: 3.5, flagCode: "gb" },
  { country: "Italy", leads: 920, interested: 455, sales: 150, conversionRate: 16.3, roas: 2.9, flagCode: "it" },
  { country: "Spain", leads: 560, interested: 330, sales: 115, conversionRate: 20.5, roas: 2.4, flagCode: "es" },
  { country: "France", leads: 410, interested: 220, sales: 80, conversionRate: 19.5, roas: 2.1, flagCode: "fr" },
  { country: "USA", leads: 380, interested: 190, sales: 65, conversionRate: 17.1, roas: 3.2, flagCode: "us" },
  { country: "Netherlands", leads: 350, interested: 210, sales: 85, conversionRate: 24.2, roas: 4.1, flagCode: "nl" },
  { country: "Switzerland", leads: 290, interested: 140, sales: 50, conversionRate: 17.2, roas: 4.8, flagCode: "ch" },
  { country: "Belgium", leads: 275, interested: 135, sales: 48, conversionRate: 17.4, roas: 3.6, flagCode: "be" },
  { country: "Austria", leads: 240, interested: 110, sales: 38, conversionRate: 15.8, roas: 3.1, flagCode: "at" },
  { country: "Sweden", leads: 210, interested: 95, sales: 32, conversionRate: 15.2, roas: 2.8, flagCode: "se" },
  { country: "Ireland", leads: 195, interested: 88, sales: 28, conversionRate: 14.3, roas: 2.6, flagCode: "ie" },
  { country: "Denmark", leads: 180, interested: 80, sales: 25, conversionRate: 13.8, roas: 2.5, flagCode: "dk" },
  { country: "Norway", leads: 165, interested: 75, sales: 24, conversionRate: 14.5, roas: 2.7, flagCode: "no" },
  { country: "UAE", leads: 150, interested: 65, sales: 18, conversionRate: 12.0, roas: 2.2, flagCode: "ae" },
  { country: "Saudi Arabia", leads: 140, interested: 55, sales: 15, conversionRate: 10.7, roas: 1.9, flagCode: "sa" },
  { country: "Kuwait", leads: 120, interested: 45, sales: 12, conversionRate: 10.0, roas: 1.8, flagCode: "kw" },
  { country: "Qatar", leads: 110, interested: 40, sales: 10, conversionRate: 9.0, roas: 1.7, flagCode: "qa" },
  { country: "Portugal", leads: 95, interested: 35, sales: 8, conversionRate: 8.4, roas: 1.6, flagCode: "pt" },
];

export const LANGUAGE_DATA: LanguageMetric[] = [
  { language: "English", count: 3250, interested: 1400, sales: 450, roas: 3.9, percentage: 40 },
  { language: "Turkish", count: 2100, interested: 950, sales: 420, roas: 4.5, percentage: 26 },
  { language: "German", count: 1200, interested: 600, sales: 180, roas: 3.6, percentage: 15 },
  { language: "Italian", count: 850, interested: 420, sales: 130, roas: 2.8, percentage: 10 },
  { language: "Spanish", count: 450, interested: 280, sales: 90, roas: 2.5, percentage: 6 },
  { language: "French", count: 270, interested: 115, sales: 45, roas: 2.0, percentage: 3 },
];

export const AGENT_DATA: AgentPerformance[] = [
  { 
    id: '1', name: "Oliver Smith", avatar: "https://picsum.photos/32/32?random=1", status: 'Online',
    totalLeads: 900, interestRate: 48, ticketValue: 22500, ticketTarget: 25000, revenue: 165000, revenueTarget: 180000 
  },
  { 
    id: '2', name: "Emma Wilson", avatar: "https://picsum.photos/32/32?random=2", status: 'Busy',
    totalLeads: 790, interestRate: 52, ticketValue: 21000, ticketTarget: 20000, revenue: 155000, revenueTarget: 140000 
  },
  { 
    id: '3', name: "Noah Brown", avatar: "https://picsum.photos/32/32?random=3", status: 'Online',
    totalLeads: 670, interestRate: 41, ticketValue: 14000, ticketTarget: 18000, revenue: 98000, revenueTarget: 140000 
  },
  { 
    id: '4', name: "Sophia Davis", avatar: "https://picsum.photos/32/32?random=4", status: 'Offline',
    totalLeads: 600, interestRate: 45, ticketValue: 17500, ticketTarget: 17500, revenue: 125000, revenueTarget: 125000 
  },
  { 
    id: '5', name: "James Miller", avatar: "https://picsum.photos/32/32?random=5", status: 'Online',
    totalLeads: 600, interestRate: 38, ticketValue: 12500, ticketTarget: 18000, revenue: 85000, revenueTarget: 125000 
  },
];

export const TEAM_DATA: TeamPerformance[] = [
    { id: 't1', name: "Alex's Team", leadCount: 5, totalLeads: 2400, interestRate: 47, ticketValue: 62500, ticketTarget: 60000, revenue: 460000, revenueTarget: 420000 },
    { id: 't2', name: "Enzo's Team", leadCount: 4, totalLeads: 1850, interestRate: 45, ticketValue: 47500, ticketTarget: 55000, revenue: 340000, revenueTarget: 380000 },
    { id: 't3', name: "Robert's Team", leadCount: 6, totalLeads: 2100, interestRate: 42, ticketValue: 45000, ticketTarget: 50000, revenue: 310000, revenueTarget: 450000 },
    { id: 't4', name: "Mazen's Team", leadCount: 3, totalLeads: 950, interestRate: 51, ticketValue: 30000, ticketTarget: 28000, revenue: 220000, revenueTarget: 210000 },
    { id: 't5', name: "Giovanni's Team", leadCount: 5, totalLeads: 1600, interestRate: 44, ticketValue: 42500, ticketTarget: 45000, revenue: 305000, revenueTarget: 350000 },
];

// Data for Filter
export const TEAMS_LIST = ['Alex', 'Enzo', 'Robert', 'Mazen', 'John', 'Giovanni'];
export const AGENTS_LIST = [
    "Oliver Smith", "Emma Wilson", "Noah Brown", "Sophia Davis", "James Miller",
    "Sarah Connor", "Mike Ross", "Harvey Specter", "Louis Litt", "Rachel Zane"
];

export const TREND_DATA: SalesTrendData[] = [
  { name: 'Jan', tickets: 65, revenue: 240 },
  { name: 'Feb', tickets: 80, revenue: 280 },
  { name: 'Mar', tickets: 95, revenue: 350 },
  { name: 'Apr', tickets: 85, revenue: 310 },
  { name: 'May', tickets: 110, revenue: 420 },
  { name: 'Jun', tickets: 130, revenue: 480 },
  { name: 'Jul', tickets: 145, revenue: 550 },
  { name: 'Aug', tickets: 125, revenue: 490 },
  { name: 'Sep', tickets: 160, revenue: 600 },
];

export const SOURCE_DATA: SourceData[] = [
  { 
    name: 'Facebook', 
    color: '#1877F2',
    adSpend: 45000,
    revenue: 220000,
    leadCount: 2430,
    interestedCount: 980,
    salesCount: 125,
    hairCount: 600,
    dentalCount: 380
  },
  { 
    name: 'Instagram', 
    color: '#E1306C',
    adSpend: 52000,
    revenue: 195000,
    leadCount: 2050,
    interestedCount: 1100,
    salesCount: 98,
    hairCount: 400,
    dentalCount: 700
  },
  { 
    name: 'Google Ads', 
    color: '#4285F4',
    adSpend: 65000,
    revenue: 310000,
    leadCount: 1620,
    interestedCount: 750,
    salesCount: 155,
    hairCount: 650,
    dentalCount: 100
  },
  { 
    name: 'TikTok', 
    color: '#000000',
    adSpend: 25000,
    revenue: 65000,
    leadCount: 1200,
    interestedCount: 240,
    salesCount: 22,
    hairCount: 200,
    dentalCount: 40
  },
  { 
    name: 'Referral', 
    color: '#10B981',
    adSpend: 5000, // Minimal spend for referral program tools
    revenue: 120000,
    leadCount: 810,
    interestedCount: 650,
    salesCount: 140,
    hairCount: 400,
    dentalCount: 250
  },
];

export const SOURCE_ICONS: Record<string, React.ElementType> = {
  'Facebook': Facebook,
  'Instagram': Instagram,
  'Google Ads': Search,
  'TikTok': Smartphone,
  'Referral': Users
};

export const AD_PERFORMANCE_DATA: AdPerformance[] = [
    { id: 'fb1', source: 'Facebook', campaignName: 'Summer Hair Transplant Promo', status: 'Active', spend: 12500, leads: 850, interested: 410, salesCount: 45, revenue: 95000 },
    { id: 'fb2', source: 'Facebook', campaignName: 'Lookalike - Germany', status: 'Active', spend: 8200, leads: 420, interested: 180, salesCount: 22, revenue: 45000 },
    { id: 'fb3', source: 'Facebook', campaignName: 'Retargeting - Site Visitors', status: 'Active', spend: 5400, leads: 310, interested: 160, salesCount: 18, revenue: 38000 },
    { id: 'fb4', source: 'Facebook', campaignName: 'UK General Awareness', status: 'Paused', spend: 14000, leads: 600, interested: 150, salesCount: 8, revenue: 22000 },
    
    { id: 'ig1', source: 'Instagram', campaignName: 'Influencer Reels - Aesthetic', status: 'Active', spend: 15000, leads: 700, interested: 450, salesCount: 40, revenue: 85000 },
    { id: 'ig2', source: 'Instagram', campaignName: 'Before/After Carousel', status: 'Active', spend: 11000, leads: 520, interested: 290, salesCount: 28, revenue: 62000 },
    { id: 'ig3', source: 'Instagram', campaignName: 'Story Ads - Flash Sale', status: 'Ended', spend: 6000, leads: 350, interested: 120, salesCount: 9, revenue: 18000 },

    { id: 'gg1', source: 'Google Ads', campaignName: 'Search - "Hair Transplant Turkey"', status: 'Active', spend: 22000, leads: 450, interested: 310, salesCount: 75, revenue: 140000 },
    { id: 'gg2', source: 'Google Ads', campaignName: 'Search - "Dental Implants Istanbul"', status: 'Active', spend: 18000, leads: 320, interested: 210, salesCount: 45, revenue: 95000 },
    { id: 'gg3', source: 'Google Ads', campaignName: 'Display - Competitor Targeting', status: 'Paused', spend: 8000, leads: 550, interested: 90, salesCount: 10, revenue: 25000 },

    { id: 'tt1', source: 'TikTok', campaignName: 'Viral Challenge - Smile', status: 'Active', spend: 9000, leads: 600, interested: 80, salesCount: 4, revenue: 12000 },
    { id: 'tt2', source: 'TikTok', campaignName: 'Dr. Expert Interview', status: 'Active', spend: 6000, leads: 250, interested: 110, salesCount: 14, revenue: 38000 },
];

export const ACTIVITY_METRICS: ActivityMetric[] = [
    { agentName: "Oliver Smith", calls: 145, messages: 320, avgResponseTime: 4.5, tasksCompleted: 45, tasksOverdue: 2 },
    { agentName: "Emma Wilson", calls: 132, messages: 410, avgResponseTime: 3.2, tasksCompleted: 52, tasksOverdue: 0 },
    { agentName: "Noah Brown", calls: 110, messages: 280, avgResponseTime: 6.1, tasksCompleted: 38, tasksOverdue: 5 },
    { agentName: "Sophia Davis", calls: 95, messages: 240, avgResponseTime: 5.5, tasksCompleted: 35, tasksOverdue: 1 },
    { agentName: "James Miller", calls: 120, messages: 290, avgResponseTime: 4.8, tasksCompleted: 42, tasksOverdue: 3 },
    { agentName: "Sarah Connor", calls: 140, messages: 310, avgResponseTime: 4.2, tasksCompleted: 48, tasksOverdue: 1 },
    { agentName: "Mike Ross", calls: 115, messages: 260, avgResponseTime: 5.8, tasksCompleted: 30, tasksOverdue: 4 },
    { agentName: "Harvey Specter", calls: 160, messages: 350, avgResponseTime: 2.5, tasksCompleted: 60, tasksOverdue: 0 },
    { agentName: "Louis Litt", calls: 105, messages: 230, avgResponseTime: 6.5, tasksCompleted: 28, tasksOverdue: 6 },
    { agentName: "Rachel Zane", calls: 125, messages: 300, avgResponseTime: 3.8, tasksCompleted: 50, tasksOverdue: 2 },
];

export const FUNNEL_DATA: FunnelStage[] = [
    { stage: "New Lead", count: 2500, conversionRate: 100, value: 0 },
    { stage: "NR", count: 800, conversionRate: 32, value: 0 },
    { stage: "Interested No Details", count: 600, conversionRate: 24, value: 0 },
    { stage: "High Price", count: 300, conversionRate: 12, value: 0 },
    { stage: "Lost", count: 200, conversionRate: 8, value: 0 },
    { stage: "Block", count: 100, conversionRate: 4, value: 0 },
    { stage: "Interested Can't Travel", count: 150, conversionRate: 6, value: 0 },
    { stage: "Not Interest / Junk", count: 250, conversionRate: 10, value: 0 },
    { stage: "Waiting for Photo", count: 400, conversionRate: 16, value: 0 },
    { stage: "Offer Sent", count: 350, conversionRate: 88, value: 1200000 },
    { stage: "Waiting For Ticket", count: 280, conversionRate: 80, value: 0 },
    { stage: "Ticket Received", count: 220, conversionRate: 78, value: 0 },
    { stage: "Pre-Payment Received", count: 180, conversionRate: 81, value: 630000 },
    { stage: "Operation Done", count: 150, conversionRate: 83, value: 750000 },
];

export const FORECAST_DATA: SalesForecast[] = [
    { month: "Aug", confirmedRevenue: 490000, expectedRevenue: 510000, probabilityWeighted: 500000 },
    { month: "Sep", confirmedRevenue: 600000, expectedRevenue: 620000, probabilityWeighted: 610000 },
    { month: "Oct (Current)", confirmedRevenue: 450000, expectedRevenue: 750000, probabilityWeighted: 680000 },
    { month: "Nov (Forecast)", confirmedRevenue: 120000, expectedRevenue: 800000, probabilityWeighted: 550000 },
    { month: "Dec (Forecast)", confirmedRevenue: 45000, expectedRevenue: 850000, probabilityWeighted: 480000 },
    { month: "Jan (Forecast)", confirmedRevenue: 15000, expectedRevenue: 900000, probabilityWeighted: 420000 },
];
