/**
 * OutlineAgent - Simulated outline generation agent
 * Creates structured outlines from research data
 */

import { BaseAgent } from './BaseAgent.js';

interface OutlineInput {
  topic: string;
  sections?: number;
}

interface OutlineOutput {
  title: string;
  sections: Array<{
    heading: string;
    subsections: string[];
  }>;
}

export class OutlineAgent extends BaseAgent<OutlineInput, OutlineOutput> {
  constructor() {
    super('outline');
  }

  async execute(input: OutlineInput): Promise<OutlineOutput> {
    this.updateState('running', 'Creating outline structure...', 20);
    await this.delay(1500);

    this.log('info', `Generating outline for: ${input.topic}`);

    this.updateState('running', 'Organizing sections...', 50);
    await this.delay(1000);

    const sectionCount = input.sections || 3;
    const sections = [];

    for (let i = 0; i < sectionCount; i++) {
      sections.push({
        heading: `Section ${i + 1}: ${this.generateSectionHeading(input.topic, i)}`,
        subsections: [
          `${this.generateSectionHeading(input.topic, i)} - Overview`,
          `${this.generateSectionHeading(input.topic, i)} - Analysis`,
          `${this.generateSectionHeading(input.topic, i)} - Recommendations`,
        ],
      });
    }

    this.updateState('running', 'Finalizing outline...', 90);
    await this.delay(500);

    this.log('info', `Outline created with ${sections.length} sections`);

    return {
      title: input.topic,
      sections,
    };
  }

  private generateSectionHeading(topic: string, index: number): string {
    const headings = ['Introduction', 'Analysis', 'Findings', 'Recommendations', 'Conclusion'];
    return headings[index] || `Topic ${index + 1}`;
  }
}
