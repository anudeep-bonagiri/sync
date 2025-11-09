/**
 * Core type definitions for the Sync multi-agent backend
 */

export type AgentRole =
  | 'network_analysis'
  | 'self_healing'
  | 'customer_analytics'
  | 'sentiment'
  | 'research'
  | 'outline'
  | 'writer'
  | 'editor';

export type AgentStatus = 'idle' | 'running' | 'complete' | 'error';

export type NetworkStatus = 'healthy' | 'warning' | 'critical';

export type LLMProvider = 'gemini' | 'nvidia' | 'nemotron';

/**
 * Base agent state that all agents must maintain
 */
export interface AgentState {
  role: AgentRole;
  status: AgentStatus;
  message: string;
  progress: number;
  startTime?: number;
  endTime?: number;
  metadata?: Record<string, any>;
}

/**
 * Structured log entry from agent execution
 */
export interface AgentLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: AgentRole;
  message: string;
  data?: any;
}

/**
 * Agent execution result
 */
export interface AgentResult<T = any> {
  success: boolean;
  data: T;
  logs: AgentLog[];
  state: AgentState;
  executionTime: number;
}

/**
 * Network analysis output from NetworkAnalysisAgent
 */
export interface NetworkAnalysis {
  overallStatus: NetworkStatus;
  regions: RegionAnalysis[];
  issues: NetworkIssue[];
  recommendations: string[];
  metrics: {
    activeIssues: number;
    avgLatency: number;
    packetLoss: number;
    uptime: number;
  };
  timestamp: number;
}

export interface RegionAnalysis {
  id: string;
  name: string;
  status: NetworkStatus;
  details: string;
  metrics: {
    latency: number;
    errorRate: number;
    throughput: number;
  };
}

export interface NetworkIssue {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedRegions: string[];
  detectedAt: number;
}

/**
 * Self-healing repair action
 */
export interface RepairAction {
  id: string;
  name: string;
  description: string;
  estimatedCost: number;
  estimatedDowntime: number; // minutes
  affectedCustomers: number;
  steps: string[];
  isRecommended: boolean;
  confidence: number;
}

/**
 * Customer sentiment insight
 */
export interface CustomerInsight {
  id: string;
  type: 'positive' | 'negative';
  description: string;
  sentiment: number; // 0-100
  mentions: number;
  trend: 'up' | 'down' | 'stable';
  summary: string;
  sources?: string[];
}

/**
 * RAG retrieval context
 */
export interface RAGContext {
  query: string;
  documents: RetrievedDocument[];
  totalRetrieved: number;
  retrievalTime: number;
}

export interface RetrievedDocument {
  content: string;
  source: string;
  score: number;
  metadata?: Record<string, any>;
}

/**
 * ReAct workflow step
 */
export interface ReActStep {
  stepNumber: number;
  thought: string;
  action: string;
  actionInput: any;
  observation: string;
  agentsInvolved: AgentRole[];
  timestamp: number;
}

/**
 * Complete ReAct workflow result
 */
export interface ReActResult {
  query: string;
  steps: ReActStep[];
  finalAnswer: any;
  totalSteps: number;
  executionTime: number;
  agentsUsed: AgentRole[];
  ragUsed: boolean;
}

/**
 * Top analytics extraction result
 */
export interface TopAnalytics {
  positive: CustomerInsight[];
  negative: CustomerInsight[];
  analysisTimestamp: number;
  dataSource: string;
}

/**
 * LLM request/response types
 */
export interface LLMRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Environment configuration
 */
export interface BackendConfig {
  llmProvider: LLMProvider;
  geminiApiKey?: string;
  nvidiaApiKey?: string;
  nvidiaBaseUrl?: string;
  nemotronApiKey?: string;
  port: number;
  nodeEnv: string;
  ragConfig: {
    chunkSize: number;
    chunkOverlap: number;
    topK: number;
  };
}
