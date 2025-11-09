/**
 * API Client for Sync Backend
 * Provides typed interfaces to the multi-agent AI backend
 */

const API_BASE_URL = 'http://localhost:3001/api';

// Response types matching backend structure
interface AgentLog {
  timestamp: number;
  level: string;
  agent: string;
  message: string;
  data?: any;
}

interface AgentState {
  role: string;
  status: string;
  message: string;
  progress: number;
  startTime: number;
  endTime?: number;
}

interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime?: number;
  logs?: AgentLog[];
  state?: AgentState;
}

// Network Analysis Types
interface NetworkAnalysisRegion {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  details: string;
  metrics?: {
    latency: number;
    errorRate: number;
    throughput: number;
  };
}

interface NetworkAnalysisIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRegions: string[];
  detectedAt: number;
}

export interface NetworkAnalysisResult {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  regions: NetworkAnalysisRegion[];
  issues: NetworkAnalysisIssue[];
  recommendations: string[];
  metrics: {
    activeIssues: number;
    avgLatency: number;
    packetLoss: number;
    uptime: number;
  };
  timestamp: number;
}

// Customer Sentiment Types
export interface CustomerInsight {
  type: 'positive' | 'negative';
  score: number;
  summary: string;
  trend: 'up' | 'down' | 'stable';
  category?: string;
}

// Self-Healing Types
export interface RepairAction {
  step: number;
  action: string;
  expectedDuration: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RemediationPlan {
  planId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  estimatedDowntime: string;
  affectedCustomers: number;
  confidence: number;
  actions: RepairAction[];
  rollbackPlan: string;
}

// API Functions
export const syncAPI = {
  /**
   * Analyze network health using NetworkAnalysisAgent + Gemini LLM
   */
  async analyzeNetwork(params: {
    network_id: string;
    issue_description?: string;
    affected_devices?: string[];
    topology_data?: string;
    includeRAG?: boolean;
    focusRegion?: string;
  }): Promise<AgentResult<NetworkAnalysisResult>> {
    const response = await fetch(`${API_BASE_URL}/analyze/network`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Network analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Analyze customer sentiment using SentimentAgent + Gemini LLM
   */
  async analyzeCustomerSentiment(params: {
    feedback: string;
    context?: string;
  }): Promise<AgentResult<CustomerInsight>> {
    const response = await fetch(`${API_BASE_URL}/analytics/top`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Sentiment analysis failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Generate repair plans using SelfHealingAgent
   */
  async generateRepairPlans(networkAnalysis?: NetworkAnalysisResult): Promise<AgentResult<{ repairActions: RemediationPlan[]; networkAnalysis: NetworkAnalysisResult }>> {
    const response = await fetch(`${API_BASE_URL}/agents/self-heal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        networkAnalysis: networkAnalysis || undefined, // Pass networkAnalysis or undefined to trigger backend analysis
        useRAG: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Repair plan generation failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get RAG system statistics
   */
  async getRAGStats(): Promise<{ totalChunks: number; sources: string[] }> {
    const response = await fetch(`${API_BASE_URL}/rag/stats`);

    if (!response.ok) {
      throw new Error(`RAG stats fetch failed: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);

    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return response.json();
  },

  /**
   * Send live customer voices to backend for RAG indexing
   */
  async sendCustomerVoices(issues: Array<{
    id: number;
    type: 'positive' | 'negative';
    description: string;
    mentions: number;
    sentiment: number;
    trend: 'up' | 'down';
    summary: string;
  }>): Promise<AgentResult<{
    issuesAdded: number;
    totalDocuments: number;
    sources: number;
    message: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/analytics/customer-voices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issues }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Customer voices submission failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get detailed AI analysis breakdown
   */
  async getDetailedAnalysis(networkAnalysis?: NetworkAnalysisResult): Promise<AgentResult<{
    timestamp: number;
    insights: string;
    anomalies: string;
    regionalBreakdown: string;
    sentimentAnalysis: string;
    diagnosticNotes: string;
    fullAnalysis: string;
  }>> {
    const response = await fetch(`${API_BASE_URL}/analyze/details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        networkAnalysis: networkAnalysis || undefined,
        includeRAG: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Detailed analysis failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },

  /**
   * Get churn and loyalty insights using LLM + RAG
   */
  async getChurnInsights(category: string, timeRange?: '24h' | '7d' | '1m' | '1y'): Promise<AgentResult<{
    category: string;
    explanation: string;
    whyLeaving?: string[];
    whyJoining?: string[];
    patterns?: string[];
    sentimentClusters?: string[];
    opportunities?: string[];
    insights?: string[];
    timestamp: number;
  }>> {
    const response = await fetch(`${API_BASE_URL}/analytics/churn-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, timeRange }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Churn insights failed: ${response.statusText} - ${errorText}`);
    }

    return response.json();
  },
};
