/**
 * Analysis Routes - Network and system analysis endpoints
 */

import { Router, Request, Response } from 'express';
import { NetworkAnalysisAgent } from '../agents/NetworkAnalysisAgent.js';
import { getLLMClient } from '../llm/llmClient.js';
import { getRAGSystem } from '../rag/ragSystem.js';

const router = Router();

/**
 * POST /api/analyze/network
 * Run network analysis with optional RAG context
 */
router.post('/network', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analyze/network');

    const { includeRAG = true, focusRegion } = req.body;

    const agent = new NetworkAnalysisAgent();
    const result = await agent.run({ includeRAG, focusRegion });

    res.json({
      success: result.success,
      data: result.data,
      executionTime: result.executionTime,
      logs: result.logs,
      state: result.state,
    });
  } catch (error) {
    console.error('[API] Error in /api/analyze/network:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/analyze/details
 * Generate detailed AI analysis breakdown with deeper insights, anomalies, regional breakdowns,
 * sentiment explanations, and diagnostic notes
 */
router.post('/details', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analyze/details');

    const { networkAnalysis, includeRAG = true } = req.body;

    const llmClient = getLLMClient();
    const ragSystem = getRAGSystem();

    // Retrieve RAG context if enabled
    let ragContext = '';
    if (includeRAG) {
      const query = 'network analysis patterns, anomaly detection, diagnostic procedures, regional network health';
      const retrieved = await ragSystem.retrieve(query, 3);
      
      if (retrieved.documents.length > 0) {
        ragContext = '\n\nHistorical Context and Patterns:\n' + 
          retrieved.documents.map(doc => doc.content.substring(0, 400)).join('\n\n');
      }
    }

    // Build comprehensive prompt for detailed analysis
    const systemPrompt = `You are an expert network operations analyst and diagnostician.
Your job is to provide deep, comprehensive analysis of network infrastructure with:
- Detailed insights into root causes and patterns
- Anomaly detection and explanation
- Regional breakdowns with specific technical details
- Sentiment and impact analysis
- Diagnostic notes and recommendations
Be specific, technical, and actionable. Format your response as structured sections.`;

    const networkSummary = networkAnalysis 
      ? `Current Network Analysis Summary:
- Overall Status: ${networkAnalysis.overallStatus}
- Active Issues: ${networkAnalysis.metrics?.activeIssues || 0}
- Average Latency: ${networkAnalysis.metrics?.avgLatency?.toFixed(2) || 'N/A'}ms
- Regions Analyzed: ${networkAnalysis.regions?.length || 0}
- Issues Found: ${networkAnalysis.issues?.length || 0}
`
      : '';

    const userPrompt = `Generate a comprehensive detailed analysis of the network infrastructure.

${networkSummary}

${ragContext}

Provide a detailed breakdown including:

1. **Deeper Insights**: Explain the root causes, underlying patterns, and systemic factors affecting network health.

2. **Anomalies Detected**: Identify any unusual patterns, deviations from baseline, or emerging issues that warrant attention.

3. **Regional Breakdowns**: For each region, provide:
   - Specific technical details about performance
   - Comparison to historical baselines
   - Regional-specific challenges or strengths
   - Impact on customer experience

4. **Sentiment Explanations**: Analyze how network conditions affect:
   - Customer experience and satisfaction
   - Business impact
   - Service quality perceptions

5. **Diagnostic Notes**: Provide:
   - Technical diagnostic information
   - Troubleshooting recommendations
   - Prevention strategies
   - Long-term optimization suggestions

Format your response in clear sections with headings. Be thorough, technical, and actionable.`;

    const response = await llmClient.generate({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Parse and structure the response
    const insights = extractSection(response.content, ['insights', 'deeper insights', 'root causes']);
    const anomalies = extractSection(response.content, ['anomalies', 'anomaly', 'unusual', 'deviations']);
    const regionalBreakdown = extractSection(response.content, ['regional', 'region', 'geographic', 'regions']);
    const sentimentAnalysis = extractSection(response.content, ['sentiment', 'customer impact', 'experience', 'satisfaction']);
    const diagnosticNotes = extractSection(response.content, ['diagnostic', 'troubleshooting', 'recommendations', 'suggestions']);

    const detailedAnalysis = {
      timestamp: Date.now(),
      insights: insights || '',
      anomalies: anomalies || '',
      regionalBreakdown: regionalBreakdown || '',
      sentimentAnalysis: sentimentAnalysis || '',
      diagnosticNotes: diagnosticNotes || '',
      fullAnalysis: response.content,
    };

    res.json({
      success: true,
      data: detailedAnalysis,
      executionTime: 0, // Could track this if needed
    });
  } catch (error) {
    console.error('[API] Error in /api/analyze/details:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Helper function to extract sections from LLM response
 */
function extractSection(content: string, keywords: string[]): string {
  const lines = content.split('\n');
  let sectionStartIdx = -1;
  let sectionEndIdx = -1;

  // Find section start (header with keyword)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    const matchesKeyword = keywords.some(kw => lowerLine.includes(kw.toLowerCase()));
    
    if (matchesKeyword && (line.match(/^#{1,3}\s/) || line.match(/^\*\*[^*]+\*\*/) || line.trim().length < 100)) {
      sectionStartIdx = i;
      break;
    }
  }

  // If no header found, search paragraphs
  if (sectionStartIdx === -1) {
    const paragraphs = content.split('\n\n');
    for (const para of paragraphs) {
      if (keywords.some(kw => para.toLowerCase().includes(kw.toLowerCase()))) {
        return para.trim();
      }
    }
    // If still nothing, return empty (will use fullAnalysis as fallback)
    return '';
  }

  // Find section end (next header or end of content)
  for (let i = sectionStartIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    // Stop at next header (but not the first line after our header)
    if (i > sectionStartIdx + 2 && (line.match(/^#{1,3}\s/) || line.match(/^\*\*[^*]+\*\*/))) {
      sectionEndIdx = i;
      break;
    }
  }

  // Extract section
  const sectionLines = sectionEndIdx === -1
    ? lines.slice(sectionStartIdx)
    : lines.slice(sectionStartIdx, sectionEndIdx);

  return sectionLines.join('\n').trim();
}

export default router;
