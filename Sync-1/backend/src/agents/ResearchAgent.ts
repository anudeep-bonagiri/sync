/**
 * ResearchAgent - Simulated research agent for gathering information
 * Uses RAG system to find relevant context
 */

import { BaseAgent } from './BaseAgent.js';
import type { RAGContext } from '../types/index.js';
import { getRAGSystem } from '../rag/ragSystem.js';

interface ResearchInput {
  topic: string;
  depth?: 'quick' | 'thorough';
}

export class ResearchAgent extends BaseAgent<ResearchInput, RAGContext> {
  constructor() {
    super('research');
  }

  async execute(input: ResearchInput): Promise<RAGContext> {
    this.updateState('running', 'Initiating research process...', 15);
    await this.delay(800);

    this.log('info', `Researching topic: ${input.topic}`);

    this.updateState('running', 'Searching knowledge base...', 40);
    await this.delay(1000);

    const ragSystem = getRAGSystem();
    const topK = input.depth === 'thorough' ? 5 : 3;

    const context = await ragSystem.retrieve(input.topic, topK);

    this.updateState('running', 'Analyzing retrieved documents...', 70);
    await this.delay(1200);

    this.log('info', `Research completed. Found ${context.documents.length} relevant documents`);

    return context;
  }
}
