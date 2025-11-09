/**
 * Analytics Routes - Customer analytics and insights endpoints
 */

import { Router, Request, Response } from 'express';
import { CustomerAnalyticsAgent } from '../agents/CustomerAnalyticsAgent.js';
import { runReActWorkflow } from '../workflows/reactWorkflow.js';
import { getRAGSystem } from '../rag/ragSystem.js';
import { getLLMClient } from '../llm/llmClient.js';

const router = Router();

/**
 * POST /api/analytics/top
 * Extract top positive and negative customer insights
 */
router.post('/top', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analytics/top');

    const { topK = 3 } = req.body;

    const agent = new CustomerAnalyticsAgent();
    const result = await agent.run({
      query: 'customer sentiment feedback analytics',
      topK,
    });

    res.json({
      success: result.success,
      data: {
        positive: result.data.positiveInsights,
        negative: result.data.negativeInsights,
        analysisTimestamp: Date.now(),
        dataSource: 'RAG + LLM Sentiment Analysis',
      },
      executionTime: result.executionTime,
    });
  } catch (error) {
    console.error('[API] Error in /api/analytics/top:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/react/analytics
 * Run full ReAct workflow for analytics
 */
router.post('/react', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analytics/react');

    const { query, enableRAG = true } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required',
      });
    }

    const result = await runReActWorkflow(query, enableRAG);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[API] Error in /api/analytics/react:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/analytics/customer-voices
 * Add live customer voices to RAG system for real-time indexing
 */
router.post('/customer-voices', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analytics/customer-voices');

    const { issues } = req.body;

    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({
        success: false,
        error: 'Issues array is required',
      });
    }

    if (issues.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Issues array cannot be empty',
      });
    }

    // Validate issue structure
    const validIssues = issues.filter((issue: any) => {
      return (
        issue.id !== undefined &&
        issue.type &&
        (issue.type === 'positive' || issue.type === 'negative') &&
        issue.description &&
        issue.mentions !== undefined &&
        issue.sentiment !== undefined &&
        issue.trend &&
        issue.summary
      );
    });

    if (validIssues.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid customer issues provided',
      });
    }

    // Add customer voices to RAG system
    const ragSystem = getRAGSystem();
    
    // Ensure RAG system is initialized (safe to call multiple times)
    await ragSystem.initialize();

    // Clear old live customer voices to avoid duplicates (optional - you might want to keep history)
    // Uncomment the line below if you want to replace old live voices with new ones
    // ragSystem.clearLiveCustomerVoices();

    // Add new customer voices
    ragSystem.addCustomerVoices(validIssues);

    const documentCount = ragSystem.getDocumentCount();
    const sources = ragSystem.getSources();

    console.log(`[API] Successfully added ${validIssues.length} customer voices to RAG`);
    console.log(`[API] Total RAG documents: ${documentCount}`);
    console.log(`[API] RAG sources: ${sources.join(', ')}`);

    res.json({
      success: true,
      data: {
        issuesAdded: validIssues.length,
        totalDocuments: documentCount,
        sources: sources.filter(s => s.startsWith('live_customer_voices_')).length,
        message: 'Customer voices successfully indexed in RAG system',
      },
    });
  } catch (error) {
    console.error('[API] Error in /api/analytics/customer-voices:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/analytics/churn-insights
 * Generate AI-powered churn and loyalty insights using LLM + RAG
 */
router.post('/churn-insights', async (req: Request, res: Response) => {
  try {
    console.log('[API] POST /api/analytics/churn-insights');

    const { category, timeRange } = req.body;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Category is required and must be a string',
      });
    }

    const ragSystem = getRAGSystem();
    const llmClient = getLLMClient();

    // Ensure RAG system is initialized
    await ragSystem.initialize();

    // Build RAG query based on category and time range
    let ragQuery = '';
    const timeRangeContext = timeRange ? ` in the last ${timeRange}` : '';
    
    // Clean category name (remove time range suffix if present)
    const cleanCategory = category.replace(/\s*\(.*?\)$/, '').trim();
    
    switch (cleanCategory.toLowerCase()) {
      case 'churn':
      case 'churn & loyalty':
        ragQuery = `customer churn leaving competitors reasons complaints dissatisfaction network issues service quality${timeRangeContext}`;
        break;
      case 'customer loyalty':
        ragQuery = `customer loyalty retention satisfaction positive feedback happy customers long-term relationships${timeRangeContext}`;
        break;
      case 'competitor loss':
        ragQuery = `competitors losing customers switching carriers AT&T Verizon customer complaints competitor issues${timeRangeContext}`;
        break;
      case 't-mobile gains':
        ragQuery = `T-Mobile new customers joining switching from competitors network quality customer satisfaction competitive advantages${timeRangeContext}`;
        break;
      default:
        ragQuery = `customer ${cleanCategory.toLowerCase()} sentiment feedback patterns trends${timeRangeContext}`;
    }

    // Retrieve relevant context from RAG
    console.log(`[API] Retrieving RAG context for category: ${category}`);
    const ragContext = await ragSystem.retrieve(ragQuery, 5);

    // Build LLM prompt
    const systemPrompt = `You are an expert customer analytics and churn analysis specialist for T-Mobile, a major telecommunications carrier.
Your role is to analyze customer churn patterns, loyalty trends, and competitor dynamics to provide actionable insights.
Generate detailed, realistic, and contextually grounded analysis based on the provided customer data and feedback.
Always provide specific, actionable insights that help with retention and acquisition strategies.`;

    const contextSummary = ragContext.documents.length > 0
      ? ragContext.documents.map(doc => doc.content.substring(0, 300)).join('\n\n')
      : 'Limited historical data available. Provide general insights based on industry best practices.';

    const timeRangeText = timeRange 
      ? `\n\nTime Range: Analyze trends and patterns specifically for the ${timeRange} time period. Focus on recent changes, short-term patterns, and immediate actionable insights.`
      : '\n\nTime Range: Analyze overall trends and long-term patterns.';

    const userPrompt = `Analyze the following category: "${cleanCategory}"${timeRangeText}

Context from knowledge store:
${contextSummary}

Provide a comprehensive analysis that includes:

1. **Overview/Explanation**: A clear 2-3 paragraph summary explaining the current state and trends for ${cleanCategory}${timeRange ? ` during the ${timeRange} period` : ''}

2. **Why Customers Are Leaving Competitor Carriers** (if relevant to category):
   - List 4-6 specific reasons based on the data
   - Include patterns like network issues, pricing, customer service problems, etc.
   - Be specific and actionable

3. **Why Customers Are Joining T-Mobile** (if relevant to category):
   - List 4-6 specific reasons
   - Include competitive advantages, network quality, customer experience improvements
   - Highlight T-Mobile's strengths

4. **Common Patterns & Motivations**:
   - Identify 4-6 recurring patterns in customer behavior
   - Include sentiment clusters and behavioral trends
   - Focus on actionable patterns

5. **Sentiment Clusters**:
   - Identify 3-5 distinct sentiment groups or customer segments
   - Describe the characteristics of each cluster

6. **Opportunities for Retention & Acquisition**:
   - List 5-7 specific, actionable opportunities
   - Focus on both retention of existing customers and acquisition of new ones
   - Include strategic recommendations

7. **Additional Insights from RAG System**:
   - Any unique insights derived from the retrieved context
   - Patterns that stand out from the data

Format your response as a JSON object with the following structure:
{
  "explanation": "Overview text here",
  "whyLeaving": ["reason1", "reason2", ...],
  "whyJoining": ["reason1", "reason2", ...],
  "patterns": ["pattern1", "pattern2", ...],
  "sentimentClusters": ["cluster1", "cluster2", ...],
  "opportunities": ["opportunity1", "opportunity2", ...],
  "insights": ["insight1", "insight2", ...]
}

Make sure the analysis is:
- Contextually grounded in the provided data
- Realistic and specific
- Actionable and strategic
- Varied enough to feel authentic (not repetitive)
- Focused on T-Mobile's competitive position`;

    // Generate LLM response
    console.log(`[API] Generating LLM insights for category: ${category}`);
    const llmResponse = await llmClient.generate({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.7, // Balance between creativity and consistency
      maxTokens: 2000,
    });

    // Parse LLM response (try to extract JSON)
    let insightData: any = {};
    try {
      // Try to extract JSON from response
      const responseText = llmResponse.content.trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insightData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: parse as structured text
        insightData = parseStructuredResponse(responseText);
      }
    } catch (parseError) {
      console.warn('[API] Failed to parse LLM response as JSON, using fallback parsing');
      insightData = parseStructuredResponse(llmResponse.content);
    }

    // Ensure all required fields exist
    const response: any = {
      category: cleanCategory,
      explanation: insightData.explanation || `Analysis of ${cleanCategory}${timeRange ? ` for the ${timeRange} period` : ''} based on customer data and industry trends.`,
      whyLeaving: Array.isArray(insightData.whyLeaving) ? insightData.whyLeaving : [],
      whyJoining: Array.isArray(insightData.whyJoining) ? insightData.whyJoining : [],
      patterns: Array.isArray(insightData.patterns) ? insightData.patterns : [],
      sentimentClusters: Array.isArray(insightData.sentimentClusters) ? insightData.sentimentClusters : [],
      opportunities: Array.isArray(insightData.opportunities) ? insightData.opportunities : [],
      insights: Array.isArray(insightData.insights) ? insightData.insights : [],
      timestamp: Date.now(),
    };

    // Add default values if arrays are empty (for demo purposes)
    if (response.whyLeaving.length === 0 && (category.toLowerCase().includes('churn') || category.toLowerCase().includes('competitor'))) {
      response.whyLeaving = [
        'Network reliability issues causing frequent dropped calls and slow data speeds',
        'Higher pricing compared to T-Mobile\'s competitive plans',
        'Poor customer service experiences with long wait times',
        'Limited 5G coverage in key metropolitan areas',
        'Complex billing and hidden fees frustrating customers',
      ];
    }

    if (response.whyJoining.length === 0 && (category.toLowerCase().includes('loyalty') || category.toLowerCase().includes('gains'))) {
      response.whyJoining = [
        'Superior 5G network coverage and performance in urban areas',
        'Competitive pricing with transparent billing and no hidden fees',
        'Excellent customer service with quick resolution times',
        'Innovative features like T-Mobile Tuesdays and family plans',
        'Strong network reliability and consistent data speeds',
      ];
    }

    if (response.patterns.length === 0) {
      response.patterns = [
        'Price-sensitive customers switching during promotional periods',
        'Network quality complaints correlate with geographic regions',
        'Customer service interactions significantly impact retention rates',
        'Family plan customers show higher loyalty than individual plans',
      ];
    }

    if (response.opportunities.length === 0) {
      response.opportunities = [
        'Target competitor customers during network outage events',
        'Offer competitive family plan promotions',
        'Enhance customer service training and response times',
        'Expand 5G coverage in under-served markets',
        'Launch retention campaigns for at-risk customer segments',
      ];
    }

    console.log(`[API] Successfully generated insights for category: ${category}`);

    res.json({
      success: true,
      data: response,
      executionTime: Date.now() - (ragContext.retrievalTime || 0),
    });
  } catch (error) {
    console.error('[API] Error in /api/analytics/churn-insights:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Parse structured text response into JSON-like object
 * Fallback parser for when LLM doesn't return valid JSON
 */
function parseStructuredResponse(text: string): any {
  const result: any = {
    explanation: '',
    whyLeaving: [],
    whyJoining: [],
    patterns: [],
    sentimentClusters: [],
    opportunities: [],
    insights: [],
  };

  // Extract explanation (first paragraph or section)
  const explanationMatch = text.match(/(?:explanation|overview)[:\s]*(.+?)(?=\n\n|\n\d+\.|$)/is);
  if (explanationMatch) {
    result.explanation = explanationMatch[1].trim();
  } else {
    // Take first paragraph as explanation
    const firstPara = text.split('\n\n')[0];
    if (firstPara && firstPara.length > 50) {
      result.explanation = firstPara.trim();
    }
  }

  // Extract lists (bullet points or numbered lists)
  const sections = text.split(/\n\d+\.\s+/);
  for (const section of sections) {
    const lines = section.split('\n').filter(line => line.trim());
    for (const line of lines) {
      const trimmed = line.replace(/^[-*•]\s*/, '').trim();
      if (trimmed.length > 20 && trimmed.length < 200) {
        // Categorize based on keywords
        if (section.toLowerCase().includes('leaving') || section.toLowerCase().includes('churn')) {
          result.whyLeaving.push(trimmed);
        } else if (section.toLowerCase().includes('joining') || section.toLowerCase().includes('gains')) {
          result.whyJoining.push(trimmed);
        } else if (section.toLowerCase().includes('pattern')) {
          result.patterns.push(trimmed);
        } else if (section.toLowerCase().includes('opportunity') || section.toLowerCase().includes('recommendation')) {
          result.opportunities.push(trimmed);
        } else {
          result.insights.push(trimmed);
        }
      }
    }
  }

  return result;
}

export default router;
