/**
 * YouTube Service - YouTube Data API v3 integration
 * https://developers.google.com/youtube/v3
 */

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  thumbnailUrl: string;
}

export class YouTubeService {
  private apiKey: string;

  constructor() {
    if (!API_KEY) {
      console.warn('[YouTube Service] API key not configured. Service will not work.');
      this.apiKey = '';
    } else {
      this.apiKey = API_KEY;
      console.log('[YouTube Service] Initialized');
    }
  }

  /**
   * Search for videos
   */
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not configured');
    }

    try {
      const searchUrl = `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${this.apiKey}`;
      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Get video IDs for statistics
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

      // Fetch video statistics
      const statsUrl = `${BASE_URL}/videos?part=statistics,snippet&id=${videoIds}&key=${this.apiKey}`;
      const statsResponse = await fetch(statsUrl);
      const statsData = await statsResponse.json();

      return statsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0',
        thumbnailUrl: item.snippet.thumbnails.medium.url,
      }));
    } catch (error) {
      console.error('[YouTube Service] Search error:', error);
      throw error;
    }
  }

  /**
   * Get trending tech videos
   */
  async getTrendingTechVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
    const queries = ['AI tutorial', 'programming 2025', 'tech news', 'software development'];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    return this.searchVideos(randomQuery, maxResults);
  }

  /**
   * Analyze video sentiment based on engagement
   */
  analyzeSentiment(video: YouTubeVideo): {
    score: number;
    trend: 'positive' | 'negative' | 'neutral';
  } {
    const views = parseInt(video.viewCount);
    const likes = parseInt(video.likeCount);
    const comments = parseInt(video.commentCount);

    // Calculate engagement rate
    const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

    let score = 50; // Neutral baseline

    if (engagementRate > 5) score = 85; // High engagement
    else if (engagementRate > 2) score = 70; // Good engagement
    else if (engagementRate > 0.5) score = 55; // Average engagement
    else score = 35; // Low engagement

    const trend = score > 60 ? 'positive' : score < 45 ? 'negative' : 'neutral';

    return { score, trend };
  }
}

// Singleton instance
let youtubeService: YouTubeService | null = null;

export function getYouTubeService(): YouTubeService {
  if (!youtubeService) {
    youtubeService = new YouTubeService();
  }
  return youtubeService;
}
