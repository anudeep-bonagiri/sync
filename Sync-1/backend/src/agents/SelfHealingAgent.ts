/**
 * SelfHealingAgent - Simulates automatic network remediation
 * Consumes NetworkAnalysis and RAG context to generate repair actions
 */

import { BaseAgent } from './BaseAgent.js';
import type { RepairAction, NetworkAnalysis } from '../types/index.js';
import { getRAGSystem } from '../rag/ragSystem.js';

interface SelfHealingInput {
  networkAnalysis: NetworkAnalysis;
  useRAG?: boolean;
}

interface SelfHealingOutput {
  repairActions: RepairAction[];
  verificationStatus: 'stable' | 'partial_risk' | 'requires_monitoring';
  logs: string[];
}

export class SelfHealingAgent extends BaseAgent<SelfHealingInput, SelfHealingOutput> {
  constructor() {
    super('self_healing');
  }

  async execute(input: SelfHealingInput): Promise<SelfHealingOutput> {
    this.updateState('running', 'Analyzing network issues...', 10);
    await this.delay(1500);

    const logs: string[] = [];
    logs.push('Initializing self-healing analysis...');

    // Optionally retrieve repair strategies from RAG
    if (input.useRAG) {
      this.updateState('running', 'Retrieving historical repair strategies...', 20);
      const ragSystem = getRAGSystem();
      const context = await ragSystem.retrieve('repair outcomes remediation strategies successful patterns', 2);

      if (context.documents.length > 0) {
        logs.push(`Retrieved ${context.documents.length} repair strategy documents`);
        this.log('info', 'RAG context retrieved for self-healing');
      }
    }

    this.updateState('running', 'Determining repair strategies...', 40);
    await this.delay(1000);

    // Analyze issues and generate repair actions
    const repairActions = this.generateRepairActions(input.networkAnalysis);
    logs.push(`Generated ${repairActions.length} potential repair actions`);

    this.updateState('running', 'Simulating repair execution...', 60);
    await this.delay(1500);

    // Simulate repair execution
    logs.push('Executing recommended repair plan...');
    logs.push('Step 1: Rerouting traffic away from degraded nodes');
    await this.delay(500);

    logs.push('Step 2: Scaling up healthy region capacity');
    await this.delay(500);

    logs.push('Step 3: Initiating rolling restart of affected services');
    await this.delay(500);

    logs.push('Step 4: Adjusting load balancer weights');
    await this.delay(500);

    this.updateState('running', 'Verifying system stability...', 85);
    await this.delay(1000);

    // Simulate verification
    logs.push('Verification pass 1: Checking regional health metrics...');
    logs.push('Verification pass 2: Monitoring error rates...');

    const verificationStatus = this.determineVerificationStatus(input.networkAnalysis);
    logs.push(`System status: ${verificationStatus}`);

    this.updateState('running', 'Finalizing self-healing operations...', 95);

    this.log('info', 'Self-healing completed', {
      actionsGenerated: repairActions.length,
      verificationStatus,
    });

    return {
      repairActions,
      verificationStatus,
      logs,
    };
  }

  private generateRepairActions(analysis: NetworkAnalysis): RepairAction[] {
    // Helper to add ±20% randomization
    const randomize = (base: number): number => {
      const variance = 0.2; // ±20%
      const min = base * (1 - variance);
      const max = base * (1 + variance);
      return Math.floor(min + Math.random() * (max - min));
    };

    // 10 different repair plan templates
    const allRepairPlans = [
      {
        name: 'Full Traffic Reroute & Server Reboot',
        description: 'Completely reroute traffic from affected regions and perform rolling reboot of all service nodes',
        baseCost: 12500,
        baseDowntime: 15,
        baseCustomers: 8500,
        steps: [
          'Drain connections from affected servers',
          'Reroute traffic to healthy regions',
          'Perform rolling reboot of service cluster',
          'Verify health checks pass',
          'Gradually restore traffic',
        ],
        confidence: 0.92,
      },
      {
        name: 'Partial Reroute & Capacity Scaling',
        description: 'Selectively reroute high-priority traffic while scaling up capacity in healthy regions',
        baseCost: 7200,
        baseDowntime: 5,
        baseCustomers: 25000,
        steps: [
          'Identify and prioritize critical traffic paths',
          'Scale up healthy region compute capacity by 30%',
          'Gradually shift traffic using weighted routing',
          'Monitor latency and error rates',
        ],
        confidence: 0.78,
      },
      {
        name: 'DNS Failover & Cache Warmup',
        description: 'Implement DNS-based failover with pre-warmed cache layers to minimize disruption',
        baseCost: 5800,
        baseDowntime: 3,
        baseCustomers: 12000,
        steps: [
          'Configure DNS failover to secondary data centers',
          'Pre-warm cache in target regions',
          'Gradually shift DNS resolution',
          'Monitor cache hit rates and latency',
        ],
        confidence: 0.85,
      },
      {
        name: 'Database Replication Sync & Rollover',
        description: 'Promote replica database to primary and sync replication lag',
        baseCost: 9400,
        baseDowntime: 8,
        baseCustomers: 18000,
        steps: [
          'Verify replica lag is minimal',
          'Promote replica to primary',
          'Update application connection strings',
          'Monitor replication consistency',
        ],
        confidence: 0.88,
      },
      {
        name: 'Load Balancer Reconfiguration',
        description: 'Dynamically adjust load balancer weights to distribute traffic away from degraded nodes',
        baseCost: 4200,
        baseDowntime: 2,
        baseCustomers: 5000,
        steps: [
          'Identify healthy backend nodes',
          'Adjust load balancer weight distribution',
          'Gradually drain traffic from affected nodes',
          'Monitor response times and error rates',
        ],
        confidence: 0.82,
      },
      {
        name: 'CDN Cache Purge & Edge Optimization',
        description: 'Purge stale CDN cache and optimize edge routing to reduce origin load',
        baseCost: 3500,
        baseDowntime: 1,
        baseCustomers: 8000,
        steps: [
          'Identify stale cache entries',
          'Execute coordinated cache purge',
          'Update edge routing rules',
          'Monitor cache hit ratios',
        ],
        confidence: 0.75,
      },
      {
        name: 'Container Orchestration Reschedule',
        description: 'Reschedule affected containers to healthy nodes using orchestration platform',
        baseCost: 6800,
        baseDowntime: 4,
        baseCustomers: 15000,
        steps: [
          'Drain pods from affected nodes',
          'Reschedule workloads to healthy nodes',
          'Verify pod health checks',
          'Monitor cluster resource utilization',
        ],
        confidence: 0.87,
      },
      {
        name: 'Network Path Optimization & BGP Update',
        description: 'Update BGP routing tables to optimize network paths and reduce latency',
        baseCost: 11000,
        baseDowntime: 12,
        baseCustomers: 22000,
        steps: [
          'Analyze current routing topology',
          'Calculate optimal BGP path weights',
          'Update BGP configuration',
          'Monitor routing convergence',
        ],
        confidence: 0.80,
      },
      {
        name: 'Auto-Scaling Trigger & Capacity Boost',
        description: 'Trigger auto-scaling to add capacity and handle increased load',
        baseCost: 8900,
        baseDowntime: 6,
        baseCustomers: 10000,
        steps: [
          'Calculate required capacity increase',
          'Trigger auto-scaling policies',
          'Wait for new instances to become healthy',
          'Gradually distribute load to new capacity',
        ],
        confidence: 0.83,
      },
      {
        name: 'Manual Engineer Intervention',
        description: 'Escalate to on-call engineering team for deep investigation and manual remediation',
        baseCost: 18000,
        baseDowntime: 60,
        baseCustomers: 150000,
        steps: [
          'Page on-call engineers',
          'Conduct root cause analysis',
          'Implement custom fix based on findings',
          'Perform extensive testing',
          'Deploy fix to production',
        ],
        confidence: 0.95,
      },
    ];

    // Randomly select 3 plans
    const shuffled = [...allRepairPlans].sort(() => Math.random() - 0.5);
    const selectedPlans = shuffled.slice(0, 3);

    // Convert to RepairAction format with randomization
    const actions: RepairAction[] = selectedPlans.map((plan, index) => ({
      id: `repair-${index + 1}`,
      name: plan.name,
      description: plan.description,
      estimatedCost: randomize(plan.baseCost),
      estimatedDowntime: randomize(plan.baseDowntime),
      affectedCustomers: randomize(plan.baseCustomers),
      steps: plan.steps,
      isRecommended: index === 0, // First selected plan is recommended
      confidence: plan.confidence,
    }));

    return actions;
  }

  private determineVerificationStatus(analysis: NetworkAnalysis): 'stable' | 'partial_risk' | 'requires_monitoring' {
    if (analysis.overallStatus === 'critical') {
      return 'partial_risk';
    } else if (analysis.overallStatus === 'warning') {
      return 'requires_monitoring';
    }
    return 'stable';
  }
}
