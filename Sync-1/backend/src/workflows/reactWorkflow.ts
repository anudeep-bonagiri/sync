/**
 * ReAct Workflow - Reasoning and Acting workflow orchestrator
 * Implements the ReAct pattern: Thought -> Action -> Observation loop
 */

import type { ReActResult, ReActStep, AgentRole } from '../types/index.js';
import { NetworkAnalysisAgent } from '../agents/NetworkAnalysisAgent.js';
import { SelfHealingAgent } from '../agents/SelfHealingAgent.js';
import { CustomerAnalyticsAgent } from '../agents/CustomerAnalyticsAgent.js';
import { ResearchAgent } from '../agents/ResearchAgent.js';
import { getRAGSystem } from '../rag/ragSystem.js';

interface ReActInput {
  query: string;
  maxSteps?: number;
  enableRAG?: boolean;
}

export class ReActWorkflow {
  private steps: ReActStep[] = [];
  private maxSteps: number;
  private enableRAG: boolean;

  constructor(maxSteps = 5, enableRAG = true) {
    this.maxSteps = maxSteps;
    this.enableRAG = enableRAG;
  }

  /**
   * Execute the ReAct workflow
   */
  async execute(input: ReActInput): Promise<ReActResult> {
    const startTime = Date.now();
    console.log(`[ReAct Workflow] Starting for query: "${input.query}"`);

    this.steps = [];
    const agentsUsed: Set<AgentRole> = new Set();
    let ragUsed = false;

    // Step 1: Reason about what needs to be done
    const thought1 = this.reason(input.query, 1);
    const action1 = this.determineAction(thought1, input.query);

    console.log(`[ReAct Workflow] Step 1 - Thought: ${thought1}`);
    console.log(`[ReAct Workflow] Step 1 - Action: ${action1}`);

    let observation1 = '';
    let networkAnalysis = null;

    // Execute first action
    if (action1.includes('network')) {
      const agent = new NetworkAnalysisAgent();
      const result = await agent.run({ includeRAG: this.enableRAG });

      agentsUsed.add('network_analysis');
      networkAnalysis = result.data;
      observation1 = `Network analysis completed. Overall status: ${result.data.overallStatus}. Found ${result.data.issues.length} issues.`;
    } else if (action1.includes('research') || action1.includes('retrieve')) {
      const agent = new ResearchAgent();
      const result = await agent.run({ topic: input.query, depth: 'quick' });

      agentsUsed.add('research');
      ragUsed = true;
      observation1 = `Research completed. Retrieved ${result.data.documents.length} relevant documents.`;
    }

    this.steps.push({
      stepNumber: 1,
      thought: thought1,
      action: action1,
      actionInput: { query: input.query },
      observation: observation1,
      agentsInvolved: Array.from(agentsUsed),
      timestamp: Date.now(),
    });

    // Step 2: Decide if customer analytics is needed
    if (input.query.toLowerCase().includes('customer') || input.query.toLowerCase().includes('sentiment')) {
      const thought2 = 'Need to analyze customer feedback to extract positive and negative insights';
      const action2 = 'Run CustomerAnalyticsAgent to extract top insights';

      console.log(`[ReAct Workflow] Step 2 - Thought: ${thought2}`);
      console.log(`[ReAct Workflow] Step 2 - Action: ${action2}`);

      const agent = new CustomerAnalyticsAgent();
      const result = await agent.run({ query: 'customer feedback sentiment', topK: 3 });

      agentsUsed.add('customer_analytics');
      ragUsed = true;

      const observation2 = `Customer analytics completed. Found ${result.data.positiveInsights.length} positive and ${result.data.negativeInsights.length} negative insights.`;

      this.steps.push({
        stepNumber: 2,
        thought: thought2,
        action: action2,
        actionInput: { query: 'customer feedback' },
        observation: observation2,
        agentsInvolved: ['customer_analytics'],
        timestamp: Date.now(),
      });
    }

    // Step 3: If network issues detected, trigger self-healing
    if (networkAnalysis && (networkAnalysis.overallStatus === 'warning' || networkAnalysis.overallStatus === 'critical')) {
      const thought3 = 'Network issues detected. Should initiate self-healing procedures';
      const action3 = 'Run SelfHealingAgent to generate repair strategies';

      console.log(`[ReAct Workflow] Step 3 - Thought: ${thought3}`);
      console.log(`[ReAct Workflow] Step 3 - Action: ${action3}`);

      const agent = new SelfHealingAgent();
      const result = await agent.run({ networkAnalysis, useRAG: this.enableRAG });

      agentsUsed.add('self_healing');

      const observation3 = `Self-healing analysis completed. Generated ${result.data.repairActions.length} repair actions. Status: ${result.data.verificationStatus}`;

      this.steps.push({
        stepNumber: this.steps.length + 1,
        thought: thought3,
        action: action3,
        actionInput: { networkAnalysis },
        observation: observation3,
        agentsInvolved: ['self_healing'],
        timestamp: Date.now(),
      });
    }

    // Final step: Synthesize results
    const finalThought = 'All necessary analyses completed. Synthesizing final answer.';
    const finalAction = 'Compile results from all agents';
    const finalObservation = `Workflow completed with ${this.steps.length} steps and ${agentsUsed.size} agents.`;

    console.log(`[ReAct Workflow] Final - Thought: ${finalThought}`);

    this.steps.push({
      stepNumber: this.steps.length + 1,
      thought: finalThought,
      action: finalAction,
      actionInput: {},
      observation: finalObservation,
      agentsInvolved: Array.from(agentsUsed),
      timestamp: Date.now(),
    });

    const finalAnswer = this.synthesizeFinalAnswer();
    const executionTime = Date.now() - startTime;

    console.log(`[ReAct Workflow] Completed in ${executionTime}ms`);

    return {
      query: input.query,
      steps: this.steps,
      finalAnswer,
      totalSteps: this.steps.length,
      executionTime,
      agentsUsed: Array.from(agentsUsed),
      ragUsed,
    };
  }

  /**
   * Reasoning step - determine what to think about
   */
  private reason(query: string, stepNumber: number): string {
    const lowerQuery = query.toLowerCase();

    if (stepNumber === 1) {
      if (lowerQuery.includes('network') || lowerQuery.includes('system') || lowerQuery.includes('infrastructure')) {
        return 'The query is about network/system status. I should analyze the current network infrastructure health.';
      } else if (lowerQuery.includes('customer') || lowerQuery.includes('sentiment') || lowerQuery.includes('feedback')) {
        return 'The query is about customer insights. I should analyze customer sentiment and feedback patterns.';
      } else {
        return 'General query. I should gather relevant context from the knowledge base before proceeding.';
      }
    }

    return 'Continue with analysis based on previous observations.';
  }

  /**
   * Determine which action to take based on reasoning
   */
  private determineAction(thought: string, query: string): string {
    if (thought.includes('network') || thought.includes('infrastructure')) {
      return 'Run NetworkAnalysisAgent to assess current system health';
    } else if (thought.includes('customer') || thought.includes('sentiment')) {
      return 'Run CustomerAnalyticsAgent to extract customer insights';
    } else {
      return 'Run ResearchAgent to retrieve relevant context from knowledge base';
    }
  }

  /**
   * Synthesize final answer from all steps
   */
  private synthesizeFinalAnswer(): any {
    return {
      summary: `Completed multi-agent analysis with ${this.steps.length} reasoning steps`,
      steps: this.steps.map(s => ({
        step: s.stepNumber,
        thought: s.thought,
        action: s.action,
        result: s.observation,
      })),
      conclusion: 'Analysis complete. All relevant agents have been consulted and results are available.',
    };
  }

  /**
   * Get the current steps
   */
  getSteps(): ReActStep[] {
    return this.steps;
  }
}

/**
 * Convenience function to run a ReAct workflow
 */
export async function runReActWorkflow(query: string, enableRAG = true): Promise<ReActResult> {
  const workflow = new ReActWorkflow(5, enableRAG);
  return await workflow.execute({ query, maxSteps: 5, enableRAG });
}
