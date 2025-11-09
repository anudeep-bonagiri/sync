/**
 * CustomerAnalyticsAgent - Extracts customer insights using sentiment analysis + RAG
 * Combines real LLM sentiment with contextual retrieval
 */

import { BaseAgent } from './BaseAgent.js';
import type { CustomerInsight } from '../types/index.js';
import { SentimentAgent } from './SentimentAgent.js';
import { getRAGSystem } from '../rag/ragSystem.js';

interface CustomerAnalyticsInput {
  query: string;
  topK?: number;
}

interface CustomerAnalyticsOutput {
  positiveInsights: CustomerInsight[];
  negativeInsights: CustomerInsight[];
  totalAnalyzed: number;
}

export class CustomerAnalyticsAgent extends BaseAgent<CustomerAnalyticsInput, CustomerAnalyticsOutput> {
  constructor() {
    super('customer_analytics');
  }

  async execute(input: CustomerAnalyticsInput): Promise<CustomerAnalyticsOutput> {
    this.updateState('running', 'Initializing customer analytics...', 10);
    await this.delay(1000);

    const topK = input.topK || 3;

    // Retrieve customer sentiment data from RAG
    // This query will retrieve both static documents and live customer voices
    this.updateState('running', 'Retrieving customer feedback data (static + live)...', 25);
    const ragSystem = getRAGSystem();
    
    // Query that matches both static customer sentiment logs and live customer voices
    const query = input.query || 'customer sentiment feedback positive negative complaints live customer voices pain points delight moments';
    const context = await ragSystem.retrieve(query, 5); // Increased topK to get more results including live data

    this.log('info', `Retrieved ${context.documents.length} customer feedback documents (includes live customer voices)`);
    
    // Log which sources were retrieved (to confirm live voices are included)
    const sources = context.documents.map(doc => doc.source);
    const liveSources = sources.filter(s => s.startsWith('live_customer_voices_'));
    if (liveSources.length > 0) {
      this.log('info', `Found ${liveSources.length} live customer voice sources in RAG results`);
    }

    this.updateState('running', 'Analyzing sentiment patterns...', 50);

    // Extract feedback items from RAG documents
    const feedbackItems = this.extractFeedbackItems(context.documents.map(d => d.content));

    this.log('info', `Extracted ${feedbackItems.length} feedback items`);

    // Run sentiment analysis on each item
    this.updateState('running', 'Running sentiment analysis...', 70);
    const sentimentAgent = new SentimentAgent();

    const insights: CustomerInsight[] = [];
    for (const item of feedbackItems.slice(0, topK * 2)) {
      const result = await sentimentAgent.run({ text: item, source: 'RAG' });
      if (result.success) {
        insights.push(result.data);
      }
      await this.delay(200); // Small delay between sentiment calls
    }

    this.updateState('running', 'Categorizing insights...', 90);

    // Separate positive and negative
    const positiveInsights = insights
      .filter(i => i.type === 'positive')
      .sort((a, b) => b.sentiment - a.sentiment)
      .slice(0, topK);

    const negativeInsights = insights
      .filter(i => i.type === 'negative')
      .sort((a, b) => a.sentiment - b.sentiment)
      .slice(0, topK);

    this.log('info', 'Customer analytics completed', {
      positive: positiveInsights.length,
      negative: negativeInsights.length,
    });

    return {
      positiveInsights,
      negativeInsights,
      totalAnalyzed: insights.length,
    };
  }

  /**
   * Extract individual feedback items from RAG documents
   * Handles both static documents and live customer voices format
   */
  private extractFeedbackItems(documents: string[]): string[] {
    const items: string[] = [];

    for (const doc of documents) {
      // Check if this is a live customer voices document
      if (doc.includes('LIVE CUSTOMER VOICES') || doc.includes('PAIN POINTS') || doc.includes('MOMENTS OF DELIGHT')) {
        // Extract from live customer voices format
        // Format: "1. Description\n   Mentions: X\n   Sentiment: Y\n   Trend: Z\n   Summary: ..."
        const lines = doc.split('\n');
        let currentItem = '';
        let collectingItem = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Start of a new item (numbered list)
          if (/^\d+\.\s+/.test(line)) {
            // Save previous item if exists
            if (currentItem && collectingItem) {
              items.push(currentItem.trim());
            }
            // Start new item
            currentItem = line.replace(/^\d+\.\s+/, '');
            collectingItem = true;
          }
          // Continue collecting item details
          else if (collectingItem && (line.startsWith('Mentions:') || line.startsWith('Sentiment:') || 
                   line.startsWith('Trend:') || line.startsWith('Summary:'))) {
            // Extract summary which is most useful for sentiment analysis
            if (line.startsWith('Summary:')) {
              const summary = line.replace(/^Summary:\s*/, '');
              if (summary) {
                items.push(`${currentItem}. ${summary}`);
              }
            }
          }
          // End of item section
          else if (line === '' && collectingItem && currentItem) {
            if (currentItem && !items.includes(currentItem.trim())) {
              items.push(currentItem.trim());
            }
            currentItem = '';
            collectingItem = false;
          }
        }
        
        // Add last item if exists
        if (currentItem && collectingItem) {
          items.push(currentItem.trim());
        }
      } else {
        // Handle static document format (original logic)
        const lines = doc.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();

          // Look for quoted feedback or bullet points
          if (
            (trimmed.startsWith('"') || trimmed.startsWith('-') || trimmed.startsWith('*')) &&
            trimmed.length > 20 &&
            trimmed.length < 200
          ) {
            const cleaned = trimmed.replace(/^[-*"]+\s*/, '').replace(/"$/, '');
            if (cleaned.length > 15) {
              items.push(cleaned);
            }
          }
        }
      }
    }

    // Remove duplicates and filter out very short items
    const uniqueItems = Array.from(new Set(items.filter(item => item.length > 15)));
    
    return uniqueItems;
  }
}
