/**
 * Gemini Provider - Implementation for Google's Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMRequest, LLMResponse } from '../types/index.js';
import type { ILLMProvider } from './llmClient.js';

export class GeminiProvider implements ILLMProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is required for Gemini provider'
      );
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = 'gemini-2.0-flash-exp';

    console.log(`[Gemini Provider] Initialized with model: ${this.model}`);
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const model = this.client.getGenerativeModel({
      model: request.model || this.model,
    });

    // Build the full prompt
    let fullPrompt = request.prompt;
    if (request.systemPrompt) {
      fullPrompt = `${request.systemPrompt}\n\n${request.prompt}`;
    }

    // Configure generation parameters
    const generationConfig = {
      temperature: request.temperature ?? 0.7,
      maxOutputTokens: request.maxTokens ?? 2048,
    };

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      return {
        content: text,
        model: this.model,
        usage: {
          promptTokens: 0, // Gemini doesn't provide token counts in free tier
          completionTokens: 0,
          totalTokens: 0,
        },
        metadata: {
          finishReason: response.candidates?.[0]?.finishReason,
        },
      };
    } catch (error) {
      console.error('[Gemini Provider] Generation error:', error);
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getName(): string {
    return 'Gemini';
  }
}
