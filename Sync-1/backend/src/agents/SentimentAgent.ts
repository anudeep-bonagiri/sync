/**
 * SentimentAgent - Performs real LLM-based sentiment analysis
 * Analyzes customer feedback and scores sentiment
 */

import { BaseAgent } from './BaseAgent.js';
import type { CustomerInsight } from '../types/index.js';
import { getLLMClient } from '../llm/llmClient.js';

interface SentimentInput {
  text: string;
  source?: string;
}

export class SentimentAgent extends BaseAgent<SentimentInput, CustomerInsight> {
  constructor() {
    super('sentiment');
  }

  async execute(input: SentimentInput): Promise<CustomerInsight> {
    this.updateState('running', 'Analyzing sentiment...', 30);

    const llmClient = getLLMClient();

    const systemPrompt = `You are an expert sentiment analyst specializing in customer feedback analysis.
Analyze the provided text and determine:
1. Whether it's positive or negative
2. A sentiment score from 0-100 (0 = very negative, 50 = neutral, 100 = very positive)
3. A brief summary of the key points
4. The trend (is this getting better or worse)

Be objective and precise in your analysis.`;

    const userPrompt = `Analyze this customer feedback:

"${input.text}"

Provide your analysis in this format:
Type: [positive/negative]
Score: [0-100]
Summary: [one sentence summary]
Trend: [up/down/stable]`;

    this.updateState('running', 'Requesting LLM sentiment analysis...', 60);

    const response = await llmClient.generate({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxTokens: 300,
    });

    this.updateState('running', 'Processing sentiment results...', 85);

    const insight = this.parseSentimentResponse(response.content, input);

    this.log('info', 'Sentiment analysis completed', {
      type: insight.type,
      score: insight.sentiment,
    });

    return insight;
  }

  /**
   * Parse LLM response into CustomerInsight
   */
  private parseSentimentResponse(content: string, input: SentimentInput): CustomerInsight {
    const lines = content.split('\n');

    let type: 'positive' | 'negative' = 'positive';
    let score = 50;
    let summary = input.text.substring(0, 100);
    let trend: 'up' | 'down' | 'stable' = 'stable';

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.includes('type:')) {
        type = lower.includes('negative') ? 'negative' : 'positive';
      } else if (lower.includes('score:')) {
        const match = line.match(/\d+/);
        if (match) {
          score = Math.min(100, Math.max(0, parseInt(match[0], 10)));
        }
      } else if (lower.includes('summary:')) {
        summary = line.replace(/summary:/i, '').trim();
      } else if (lower.includes('trend:')) {
        if (lower.includes('up')) trend = 'up';
        else if (lower.includes('down')) trend = 'down';
        else trend = 'stable';
      }
    }

    // Generate a description from the input
    const description = input.text.length > 100
      ? input.text.substring(0, 97) + '...'
      : input.text;

    return {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      description,
      sentiment: score,
      mentions: Math.floor(Math.random() * 500) + 50, // Simulated
      trend,
      summary,
      sources: input.source ? [input.source] : undefined,
    };
  }
}
