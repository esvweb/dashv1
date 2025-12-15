import React from 'react';

export type TimeFilter = 'Today' | 'Week' | 'Month';
export type ViewType = 'dashboard' | 'marketing' | 'agent' | 'sales';
export type TreatmentFilterType = 'All' | 'Hair' | 'Dental';

export interface KPIMetric {
  id: string;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  isPositive: boolean;
  subtext?: string;
  icon: React.ElementType;
}

export interface SalesByCountry {
  country: string;
  leads: number;
  interested: number;
  sales: number;
  conversionRate: number;
  roas: number;
  flagCode: string;
}

export interface LanguageMetric {
  language: string;
  count: number;
  interested: number;
  sales: number;
  roas: number;
  percentage: number;
}

export interface AgentPerformance {
  id: string;
  name: string;
  avatar: string;
  totalLeads: number;
  interestRate: number;
  ticketValue: number;
  ticketTarget: number;
  revenue: number;
  revenueTarget: number;
  status: 'Online' | 'Offline' | 'Busy';
}

export interface TeamPerformance {
  id: string;
  name: string;
  leadCount: number;
  totalLeads: number;
  interestRate: number;
  ticketValue: number;
  ticketTarget: number;
  revenue: number;
  revenueTarget: number;
}

export interface SalesTrendData {
  name: string;
  tickets: number;
  revenue: number;
}

export interface SourceData {
  name: string;
  color: string;
  adSpend: number;
  revenue: number;
  leadCount: number;
  interestedCount: number;
  salesCount: number;
  hairCount: number;
  dentalCount: number;
}

export interface AdPerformance {
  id: string;
  source: string;
  campaignName: string;
  status: 'Active' | 'Paused' | 'Ended';
  spend: number;
  leads: number;
  interested: number;
  salesCount: number;
  revenue: number;
}

// --- New Interfaces for Agent Activity & Sales Forecast ---

export interface ActivityMetric {
  agentName: string;
  calls: number;
  messages: number;
  avgResponseTime: number; // in minutes
  tasksCompleted: number;
  tasksOverdue: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  conversionRate: number; // conversion from previous stage
  value: number;
}

export interface SalesForecast {
  month: string;
  confirmedRevenue: number;
  expectedRevenue: number; // For future/pipeline
  probabilityWeighted: number;
}

export enum TreatmentType {
  HAIR = 'Hair Transplant',
  DENTAL = 'Dental',
  AESTHETIC = 'Aesthetics',
  OTHER = 'Other'
}