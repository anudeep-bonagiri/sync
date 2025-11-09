// Fix: Create full content for types.ts to define all data structures.
export type RegionStatus = 'healthy' | 'warning' | 'critical';

export interface NetworkRegion {
  id: string;
  name: string;
  status: RegionStatus;
  details: string;
}

export interface CustomerIssue {
  id: number;
  type: 'positive' | 'negative';
  description: string;
  mentions: number;
  sentiment: number; // For negative issues, higher is worse
  trend: 'up' | 'down';
  summary: string;
}

export interface Agent {
  name: 'Traffic Rerouter' | 'Cost Analysis' | 'Uptime Impact' | 'Customer Impact';
  status: 'running' | 'complete';
  message: string;
}

export interface Simulation {
  stage: string;
  progress: number;
  isActive: boolean;
  agents: Agent[];
}

export interface RepairPlan {
  id: number;
  name: string;
  cost: number;
  downtime: number;
  affectedCustomers: number;
  isRecommended: boolean;
}

export interface CustomerTrendDataPoint {
  date: string;
  leaving: number;
  loyalty: number;
}

export type TimeRange = '24h' | '7d' | '1m' | '1y';

export type CustomerTrendData = Record<TimeRange, CustomerTrendDataPoint[]>;

export interface Metrics {
    activeIssues: number;
    aiAgentsRunning: number;
    costSavings: number;
    avgResolutionTime: number;
}

export interface ToastState {
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
    isVisible: boolean;
}