/**
 * BaseAgent - Abstract base class for all agents in the system
 * Provides common functionality for logging, state management, and execution tracking
 */

import type {
  AgentRole,
  AgentState,
  AgentLog,
  AgentResult,
  AgentStatus,
} from '../types/index.js';

export abstract class BaseAgent<TInput = any, TOutput = any> {
  protected state: AgentState;
  protected logs: AgentLog[] = [];

  constructor(protected role: AgentRole) {
    this.state = {
      role,
      status: 'idle',
      message: 'Agent initialized',
      progress: 0,
    };
  }

  /**
   * Main execution method - must be implemented by all agents
   */
  abstract execute(input: TInput): Promise<TOutput>;

  /**
   * Run the agent with full state tracking and logging
   */
  async run(input: TInput): Promise<AgentResult<TOutput>> {
    const startTime = Date.now();
    this.state.startTime = startTime;
    this.state.status = 'running';
    this.state.progress = 0;

    this.log('info', `Starting ${this.role} agent`, { input });

    try {
      const data = await this.execute(input);

      this.state.status = 'complete';
      this.state.progress = 100;
      this.state.endTime = Date.now();
      this.state.message = 'Execution completed successfully';

      this.log('info', `Completed ${this.role} agent`, { output: data });

      return {
        success: true,
        data,
        logs: this.logs,
        state: { ...this.state },
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      this.state.status = 'error';
      this.state.message = error instanceof Error ? error.message : 'Unknown error';
      this.state.endTime = Date.now();

      this.log('error', `Error in ${this.role} agent`, { error });

      return {
        success: false,
        data: null as any,
        logs: this.logs,
        state: { ...this.state },
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Log a message with the agent's context
   */
  protected log(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    data?: any
  ): void {
    const logEntry: AgentLog = {
      timestamp: Date.now(),
      level,
      agent: this.role,
      message,
      data,
    };

    this.logs.push(logEntry);

    // Also log to console for debugging
    const prefix = `[${this.role.toUpperCase()}]`;
    switch (level) {
      case 'error':
        console.error(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      default:
        console.log(prefix, message, data || '');
    }
  }

  /**
   * Update agent state and message
   */
  protected updateState(status: AgentStatus, message: string, progress?: number): void {
    this.state.status = status;
    this.state.message = message;
    if (progress !== undefined) {
      this.state.progress = progress;
    }
    this.log('debug', `State updated: ${message}`, { status, progress });
  }

  /**
   * Simulate processing delay (for non-LLM agents)
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get current state snapshot
   */
  getState(): AgentState {
    return { ...this.state };
  }

  /**
   * Get all logs
   */
  getLogs(): AgentLog[] {
    return [...this.logs];
  }

  /**
   * Reset agent to initial state
   */
  reset(): void {
    this.state = {
      role: this.role,
      status: 'idle',
      message: 'Agent reset',
      progress: 0,
    };
    this.logs = [];
  }
}
