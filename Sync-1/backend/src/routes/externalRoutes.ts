/**
 * External API Routes - Access to external services
 */

import { Router, Request, Response } from 'express';
import { getYouTubeService } from '../services/youtubeService.js';
import { getTwitterService } from '../services/twitterService.js';

const router = Router();

/**
 * GET /api/external/youtube/search
 * Search YouTube videos
 */
router.get('/youtube/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const maxResults = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    console.log(`[API] GET /api/external/youtube/search?q=${query}&limit=${maxResults}`);

    const service = getYouTubeService();
    const videos = await service.searchVideos(query, maxResults);

    res.json({
      success: true,
      data: videos,
      count: videos.length,
    });
  } catch (error) {
    console.error('[API] Error in /api/external/youtube/search:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/external/youtube/trending
 * Get trending tech videos
 */
router.get('/youtube/trending', async (req: Request, res: Response) => {
  try {
    const maxResults = parseInt(req.query.limit as string) || 10;
    console.log(`[API] GET /api/external/youtube/trending?limit=${maxResults}`);

    const service = getYouTubeService();
    const videos = await service.getTrendingTechVideos(maxResults);

    // Add sentiment analysis
    const videosWithSentiment = videos.map(video => ({
      ...video,
      sentiment: service.analyzeSentiment(video),
    }));

    res.json({
      success: true,
      data: videosWithSentiment,
      count: videos.length,
    });
  } catch (error) {
    console.error('[API] Error in /api/external/youtube/trending:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/external/twitter/search
 * Search tweets (placeholder - requires bearer token)
 */
router.get('/twitter/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    console.log(`[API] GET /api/external/twitter/search?q=${query}`);

    res.json({
      success: false,
      error: 'Twitter API requires bearer token setup. See backend/src/services/twitterService.ts for details.',
      message: 'Visit https://developer.twitter.com/en/portal/dashboard to get credentials',
    });
  } catch (error) {
    console.error('[API] Error in /api/external/twitter/search:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
