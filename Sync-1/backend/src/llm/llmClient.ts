/**
 * LLM Client - Pluggable abstraction layer for LLM providers
 * Supports switching between Gemini, NVIDIA NIM, and Nemotron via environment variables
 */

import type { LLMRequest, LLMResponse, LLMProvider } from '../types/index.js';
import { GeminiProvider } from './geminiProvider.js';
import { NvidiaProvider } from './nvidiaProvider.js';
import { NemotronProvider } from './nemotronProvider.js';

export interface ILLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
  getName(): string;
}

export class LLMClient {
  private provider: ILLMProvider;
  private providerType: LLMProvider;

  constructor(providerType: LLMProvider = 'gemini') {
    this.providerType = providerType;

    switch (providerType) {
      case 'nvidia':
        this.provider = new NvidiaProvider();
        break;
      case 'nemotron':
        this.provider = new NemotronProvider();
        break;
      case 'gemini':
      default:
        this.provider = new GeminiProvider();
        break;
    }

    console.log(`[LLM Client] Initialized with provider: ${this.provider.getName()}`);
  }

  /**
   * Generate text completion from the configured LLM provider
   */
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      console.log(`[LLM Client] Sending request to ${this.provider.getName()}...`);

      const response = await this.provider.generate(request);

      const duration = Date.now() - startTime;
      console.log(
        `[LLM Client] Response received from ${this.provider.getName()} in ${duration}ms`
      );

      return response;
    } catch (error) {
      console.error(`[LLM Client] Error from ${this.provider.getName()}:`, error);
      throw error;
    }
  }

  /**
   * Get the current provider type
   */
  getProviderType(): LLMProvider {
    return this.providerType;
  }

  /**
   * Get the provider instance
   */
  getProvider(): ILLMProvider {
    return this.provider;
  }
}

// Singleton instance
let llmClientInstance: LLMClient | null = null;

/**
 * Get or create the singleton LLM client instance
 */
export function getLLMClient(providerType?: LLMProvider): LLMClient {
  if (!llmClientInstance) {
    const provider = providerType || (process.env.LLM_PROVIDER as LLMProvider) || 'gemini';
    llmClientInstance = new LLMClient(provider);
  }
  return llmClientInstance;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetLLMClient(): void {
  llmClientInstance = null;
}
