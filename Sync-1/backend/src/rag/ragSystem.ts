/**
 * RAG System - Agentic Retrieval Augmented Generation
 * Loads documents from filesystem, chunks them, and provides context-aware retrieval
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { RAGContext, RetrievedDocument } from '../types/index.js';
import { getEmbeddingService } from './embeddings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DocumentChunk {
  content: string;
  source: string;
  index: number;
  metadata: Record<string, any>;
}

export class RAGSystem {
  private documents: DocumentChunk[] = [];
  private embeddingService = getEmbeddingService();
  private docsPath: string;
  private chunkSize: number;
  private chunkOverlap: number;
  private isInitialized = false;

  constructor(docsPath?: string, chunkSize = 500, chunkOverlap = 100) {
    this.docsPath = docsPath || path.join(__dirname, 'docs');
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  /**
   * Initialize the RAG system by loading all documents
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[RAG System] Already initialized');
      return;
    }

    console.log(`[RAG System] Initializing with docs from: ${this.docsPath}`);

    try {
      // Create docs directory if it doesn't exist
      if (!fs.existsSync(this.docsPath)) {
        console.log(`[RAG System] Creating docs directory: ${this.docsPath}`);
        fs.mkdirSync(this.docsPath, { recursive: true });
      }

      // Load all .txt files from docs directory
      const files = fs.readdirSync(this.docsPath).filter((file) => file.endsWith('.txt'));

      console.log(`[RAG System] Found ${files.length} documents to load`);

      for (const file of files) {
        const filePath = path.join(this.docsPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Chunk the document
        const chunks = this.chunkDocument(content, file);
        this.documents.push(...chunks);

        console.log(`[RAG System] Loaded ${chunks.length} chunks from ${file}`);
      }

      this.isInitialized = true;
      console.log(`[RAG System] Initialized with ${this.documents.length} total chunks`);
    } catch (error) {
      console.error('[RAG System] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Decide whether to retrieve context based on the query
   * This is the "agentic" part - not all queries need retrieval
   */
  shouldRetrieve(query: string): boolean {
    const retrievalKeywords = [
      'history',
      'past',
      'previous',
      'similar',
      'outage',
      'pattern',
      'customer',
      'feedback',
      'sentiment',
      'complaint',
      'issue',
      'problem',
      'competitor',
      'repair',
      'telemetry',
      'data',
      'analysis',
    ];

    const queryLower = query.toLowerCase();
    return retrievalKeywords.some((keyword) => queryLower.includes(keyword));
  }

  /**
   * Retrieve relevant context for a query
   */
  async retrieve(query: string, topK: number = 3): Promise<RAGContext> {
    const startTime = Date.now();

    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log(`[RAG System] Retrieving context for query: "${query.substring(0, 100)}..."`);

    if (!this.shouldRetrieve(query)) {
      console.log('[RAG System] Query does not require retrieval, skipping...');
      return {
        query,
        documents: [],
        totalRetrieved: 0,
        retrievalTime: Date.now() - startTime,
      };
    }

    // Score all documents
    const scoredDocs = this.documents.map((doc) => ({
      ...doc,
      score: this.embeddingService.calculateRelevance(query, doc.content),
    }));

    // Sort by score and take top K
    scoredDocs.sort((a, b) => b.score - a.score);
    const topDocs = scoredDocs.slice(0, topK);

    const retrievedDocs: RetrievedDocument[] = topDocs.map((doc) => ({
      content: doc.content,
      source: doc.source,
      score: doc.score,
      metadata: doc.metadata,
    }));

    const retrievalTime = Date.now() - startTime;

    console.log(
      `[RAG System] Retrieved ${retrievedDocs.length} documents in ${retrievalTime}ms`
    );
    console.log(
      `[RAG System] Top score: ${retrievedDocs[0]?.score.toFixed(3)}, Sources: ${retrievedDocs.map((d) => d.source).join(', ')}`
    );

    return {
      query,
      documents: retrievedDocs,
      totalRetrieved: retrievedDocs.length,
      retrievalTime,
    };
  }

  /**
   * Chunk a document into smaller pieces with overlap
   */
  private chunkDocument(content: string, source: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];

    // Split by paragraphs first
    const paragraphs = content.split(/\n\n+/);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      // If adding this paragraph would exceed chunk size, save current chunk
      if (currentChunk.length + paragraph.length > this.chunkSize && currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          source,
          index: chunkIndex++,
          metadata: {
            length: currentChunk.length,
            paragraphs: currentChunk.split('\n\n').length,
          },
        });

        // Start new chunk with overlap
        const words = currentChunk.split(' ');
        const overlapWords = Math.floor(this.chunkOverlap / 5); // Rough estimate
        currentChunk = words.slice(-overlapWords).join(' ') + '\n\n' + paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }

    // Add final chunk
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        source,
        index: chunkIndex,
        metadata: {
          length: currentChunk.length,
          paragraphs: currentChunk.split('\n\n').length,
        },
      });
    }

    return chunks;
  }

  /**
   * Get total number of documents loaded
   */
  getDocumentCount(): number {
    return this.documents.length;
  }

  /**
   * Get all sources
   */
  getSources(): string[] {
    return Array.from(new Set(this.documents.map((doc) => doc.source)));
  }

  /**
   * Add a document dynamically (for live customer voices, real-time data, etc.)
   * This allows the RAG system to index new data in real-time without restarting
   */
  addDocument(content: string, source: string, metadata?: Record<string, any>): void {
    // If not initialized, we'll still add the document but log a warning
    // The document will be available once initialization completes
    if (!this.isInitialized) {
      console.warn('[RAG System] System not initialized. Adding document anyway - it will be available after initialization.');
    }

    console.log(`[RAG System] Adding dynamic document from source: ${source}`);

    // Chunk the document
    const chunks = this.chunkDocument(content, source);

    // Add metadata to chunks if provided
    if (metadata) {
      chunks.forEach(chunk => {
        chunk.metadata = { ...chunk.metadata, ...metadata };
      });
    }

    // Add chunks to documents array
    this.documents.push(...chunks);

    console.log(`[RAG System] Added ${chunks.length} chunks from ${source}. Total chunks: ${this.documents.length}`);
  }

  /**
   * Add multiple customer voice issues as documents
   * Formats customer issues into searchable text for RAG
   */
  addCustomerVoices(issues: Array<{
    id: number;
    type: 'positive' | 'negative';
    description: string;
    mentions: number;
    sentiment: number;
    trend: 'up' | 'down';
    summary: string;
  }>): void {
    if (issues.length === 0) {
      return;
    }

    console.log(`[RAG System] Adding ${issues.length} customer voice issues to RAG`);

    // Group by type for better organization
    const positiveIssues = issues.filter(i => i.type === 'positive');
    const negativeIssues = issues.filter(i => i.type === 'negative');

    // Format as document content
    let content = `LIVE CUSTOMER VOICES - ${new Date().toISOString()}\n\n`;
    
    if (negativeIssues.length > 0) {
      content += `PAIN POINTS (${negativeIssues.length} issues):\n\n`;
      negativeIssues.forEach((issue, idx) => {
        content += `${idx + 1}. ${issue.description}\n`;
        content += `   Mentions: ${issue.mentions}\n`;
        content += `   Sentiment: ${issue.sentiment}/100\n`;
        content += `   Trend: ${issue.trend}\n`;
        content += `   Summary: ${issue.summary}\n\n`;
      });
    }

    if (positiveIssues.length > 0) {
      content += `MOMENTS OF DELIGHT (${positiveIssues.length} issues):\n\n`;
      positiveIssues.forEach((issue, idx) => {
        content += `${idx + 1}. ${issue.description}\n`;
        content += `   Mentions: ${issue.mentions}\n`;
        content += `   Sentiment: ${issue.sentiment}/100\n`;
        content += `   Trend: ${issue.trend}\n`;
        content += `   Summary: ${issue.summary}\n\n`;
      });
    }

    // Add as a document with metadata
    const source = `live_customer_voices_${Date.now()}`;
    this.addDocument(content, source, {
      type: 'live_customer_voices',
      timestamp: Date.now(),
      positiveCount: positiveIssues.length,
      negativeCount: negativeIssues.length,
      totalCount: issues.length,
    });
  }

  /**
   * Clear all live customer voice documents (optional cleanup method)
   */
  clearLiveCustomerVoices(): void {
    const beforeCount = this.documents.length;
    this.documents = this.documents.filter(doc => 
      !doc.source.startsWith('live_customer_voices_')
    );
    const afterCount = this.documents.length;
    console.log(`[RAG System] Cleared ${beforeCount - afterCount} live customer voice documents. Remaining: ${afterCount}`);
  }
}

// Singleton instance
let ragSystem: RAGSystem | null = null;

export function getRAGSystem(): RAGSystem {
  if (!ragSystem) {
    const chunkSize = parseInt(process.env.RAG_CHUNK_SIZE || '500', 10);
    const chunkOverlap = parseInt(process.env.RAG_CHUNK_OVERLAP || '100', 10);
    ragSystem = new RAGSystem(undefined, chunkSize, chunkOverlap);
  }
  return ragSystem;
}
