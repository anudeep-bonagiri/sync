/**
 * RAG Routes - Knowledge retrieval endpoints
 */

import { Router, Request, Response } from 'express';
import { getRAGSystem } from '../rag/ragSystem.js';

const router = Router();

/**
 * POST /api/rag/context
 * Retrieve context from the knowledge store
 */
router.post('/context', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/rag/context');

    const { query, topK = 3 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
      });
    }

    const ragSystem = getRAGSystem();
    await ragSystem.initialize(); // Ensure initialized

    const context = await ragSystem.retrieve(query, topK);

    res.json({
      success: true,
      data: context,
    });
  } catch (error) {
    console.error('[API] Error in /api/rag/context:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/rag/stats
 * Get RAG system statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    console.log('[API] GET /api/rag/stats');

    const ragSystem = getRAGSystem();
    await ragSystem.initialize();

    res.json({
      success: true,
      data: {
        totalDocuments: ragSystem.getDocumentCount(),
        sources: ragSystem.getSources(),
      },
    });
  } catch (error) {
    console.error('[API] Error in /api/rag/stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
