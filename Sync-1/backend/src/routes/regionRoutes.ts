/**
 * Region Routes - Geographic network visualization endpoints
 */

import { Router, Request, Response } from 'express';
import { NetworkAnalysisAgent } from '../agents/NetworkAnalysisAgent.js';
import { NetworkRegionAgent } from '../agents/NetworkRegionAgent.js';

const router = Router();

/**
 * GET /api/regions/map
 * Generate geographic map data for network regions
 *
 * This endpoint orchestrates a multi-agent workflow:
 * 1. Runs NetworkAnalysisAgent (real LLM call)
 * 2. Optionally retrieves RAG context
 * 3. Passes through NetworkRegionAgent
 * 4. Returns map-ready regional data
 */
router.get('/map', async (req: Request, res: Response) => {
  try {
    console.log('[API] GET /api/regions/map');

    const includeRAG = req.query.rag !== 'false'; // Default to true

    // Step 1: Run NetworkAnalysisAgent for fresh network data
    console.log('[REGIONS_MAP] Running NetworkAnalysisAgent...');
    const networkAgent = new NetworkAnalysisAgent();
    const networkResult = await networkAgent.run({ includeRAG });

    if (!networkResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Network analysis failed',
      });
    }

    // Step 2: Run NetworkRegionAgent to generate geographic data
    console.log('[REGIONS_MAP] Running NetworkRegionAgent...');
    const regionAgent = new NetworkRegionAgent();
    const regionResult = await regionAgent.run({
      networkAnalysis: networkResult.data,
      includeRAG,
    });

    if (!regionResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Region mapping failed',
      });
    }

    // Return complete workflow result
    res.json({
      success: true,
      data: regionResult.data,
      executionTime: networkResult.executionTime + regionResult.executionTime,
      logs: {
        networkAnalysis: networkResult.logs,
        regionMapping: regionResult.logs,
      },
      state: {
        networkAnalysis: networkResult.state,
        regionMapping: regionResult.state,
      },
    });
  } catch (error) {
    console.error('[API] Error in /api/regions/map:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/regions/map
 * Generate map data with custom network analysis input
 */
router.post('/map', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/regions/map');

    const { networkAnalysis, includeRAG = true } = req.body;

    if (!networkAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'networkAnalysis is required in request body',
      });
    }

    // Run NetworkRegionAgent with provided analysis
    const regionAgent = new NetworkRegionAgent();
    const regionResult = await regionAgent.run({
      networkAnalysis,
      includeRAG,
    });

    res.json({
      success: regionResult.success,
      data: regionResult.data,
      executionTime: regionResult.executionTime,
      logs: regionResult.logs,
      state: regionResult.state,
    });
  } catch (error) {
    console.error('[API] Error in POST /api/regions/map:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
