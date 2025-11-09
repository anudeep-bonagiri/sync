/**
 * Self-Healing Routes - Automated remediation endpoints
 */

import { Router, Request, Response } from 'express';
import { SelfHealingAgent } from '../agents/SelfHealingAgent.js';
import { NetworkAnalysisAgent } from '../agents/NetworkAnalysisAgent.js';

const router = Router();

/**
 * POST /api/agents/self-heal
 * Run self-healing analysis and generate repair actions
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/agents/self-heal');

    const { networkAnalysis, useRAG = true } = req.body;

    // If no network analysis provided, run it first
    let analysis = networkAnalysis;

    if (!analysis) {
      console.log('[API] No network analysis provided, running analysis first...');
      const networkAgent = new NetworkAnalysisAgent();
      const networkResult = await networkAgent.run({ includeRAG: useRAG });

      if (!networkResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Network analysis failed',
        });
      }

      analysis = networkResult.data;
    }

    // Run self-healing agent
    const agent = new SelfHealingAgent();
    const result = await agent.run({ networkAnalysis: analysis, useRAG });

    res.json({
      success: result.success,
      data: {
        repairActions: result.data.repairActions,
        verificationStatus: result.data.verificationStatus,
        logs: result.data.logs,
        networkAnalysis: analysis,
      },
      executionTime: result.executionTime,
      state: result.state,
    });
  } catch (error) {
    console.error('[API] Error in /api/agents/self-heal:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
