/**
 * Sync Backend Server
 * Multi-agent AI operations platform with agentic RAG and ReAct workflows
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
dotenv.config();

// Import routes
import analyzeRoutes from './routes/analyzeRoutes.js';
import ragRoutes from './routes/ragRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import selfHealRoutes from './routes/selfHealRoutes.js';
import externalRoutes from './routes/externalRoutes.js';
import regionRoutes from './routes/regionRoutes.js';

// Import systems to initialize
import { getRAGSystem } from './rag/ragSystem.js';
import { getLLMClient } from './llm/llmClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: Date.now(),
    service: 'Sync Backend',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/agents/self-heal', selfHealRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/regions', regionRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Sync Backend',
    description: 'Multi-agent AI operations platform',
    version: '1.0.0',
    endpoints: {
      analyze: {
        'POST /api/analyze/network': 'Run network health analysis',
      },
      rag: {
        'POST /api/rag/context': 'Retrieve context from knowledge store',
        'GET /api/rag/stats': 'Get RAG system statistics',
      },
      analytics: {
        'POST /api/analytics/top': 'Extract top customer insights',
        'POST /api/analytics/react': 'Run ReAct workflow for analytics',
        'POST /api/analytics/customer-voices': 'Add live customer voices to RAG system',
        'POST /api/analytics/churn-insights': 'Generate AI-powered churn and loyalty insights using LLM + RAG',
      },
      agents: {
        'POST /api/agents/self-heal': 'Run self-healing agent',
      },
      external: {
        'GET /api/external/youtube/search': 'Search YouTube videos',
        'GET /api/external/youtube/trending': 'Get trending tech videos',
        'GET /api/external/twitter/search': 'Search tweets (requires setup)',
      },
      regions: {
        'GET /api/regions/map': 'Generate geographic network map data',
        'POST /api/regions/map': 'Generate map from custom analysis',
      },
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

/**
 * Initialize backend systems
 */
async function initializeBackend(): Promise<void> {
  console.log('\n=== Sync Backend Initialization ===\n');

  // Initialize LLM Client
  try {
    console.log('[Init] Initializing LLM client...');
    const llmClient = getLLMClient();
    console.log(`[Init] ✓ LLM Client initialized (Provider: ${llmClient.getProviderType()})\n`);
  } catch (error) {
    console.error('[Init] ✗ Failed to initialize LLM client:', error);
    throw error;
  }

  // Initialize RAG System
  try {
    console.log('[Init] Initializing RAG system...');
    const ragSystem = getRAGSystem();
    await ragSystem.initialize();
    console.log(`[Init] ✓ RAG System initialized (${ragSystem.getDocumentCount()} chunks loaded)\n`);
    console.log(`[Init] Sources: ${ragSystem.getSources().join(', ')}\n`);
  } catch (error) {
    console.error('[Init] ✗ Failed to initialize RAG system:', error);
    console.warn('[Init] ! Backend will continue without RAG (knowledge retrieval disabled)\n');
  }

  console.log('=== Initialization Complete ===\n');
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Initialize backend systems
    await initializeBackend();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Sync Backend running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/\n`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`LLM Provider: ${process.env.LLM_PROVIDER || 'gemini'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n[Server] Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n[Server] Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

export default app;
