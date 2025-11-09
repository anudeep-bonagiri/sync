/**
 * Nemotron Provider - Implementation for NVIDIA Nemotron API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMRequest, LLMResponse } from '../types/index.js';
import type { ILLMProvider } from './llmClient.js';

export class NemotronProvider implements ILLMProvider {
  private client: GoogleGenerativeAI;
  private model: string;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEMOTRON_API_KEY || '';

    if (!this.apiKey) {
      console.warn(
        '[Nemotron Provider] WARNING: NEMOTRON_API_KEY not set. Provider will not work until configured.'
      );
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is required for Nemotron provider'
      );
    }

    this.client = new GoogleGenerativeAI(geminiApiKey);
    this.model = 'nemotron-4-340b-instruct';

    console.log(`[Nemotron Provider] Initialized with model: ${this.model}`);
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const model = this.client.getGenerativeModel({
      model: request.model || 'gemini-2.0-flash-exp',
    });

    let fullPrompt = request.prompt;
    if (request.systemPrompt) {
      fullPrompt = `${request.systemPrompt}\n\n${request.prompt}`;
    }

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
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
        metadata: {
          finishReason: response.candidates?.[0]?.finishReason,
        },
      };
    } catch (error) {
      console.error('[Nemotron Provider] Generation error:', error);
      throw new Error(`Nemotron API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getName(): string {
    return 'Nemotron';
  }
}

