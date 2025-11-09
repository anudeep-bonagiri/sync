# Sync Backend Integration Guide

Complete guide for integrating the multi-agent backend with the React frontend.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure API Key

Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3001`

### 4. Start Frontend (separate terminal)

```bash
cd ..
npm run dev
```

Frontend runs on `http://localhost:3000`

## Backend Architecture

### Agent System

The backend implements 8 specialized agents:

1. **NetworkAnalysisAgent** (Real LLM)
   - Uses Gemini to analyze network health
   - Returns dynamic status reports
   - Can incorporate historical RAG context

2. **SentimentAgent** (Real LLM)
   - Scores customer feedback sentiment (0-100)
   - Classifies as positive/negative
   - Provides trend analysis

3. **SelfHealingAgent** (Simulated)
   - Generates repair action plans
   - Simulates automated remediation
   - Returns verification status

4. **CustomerAnalyticsAgent** (LLM + RAG)
   - Extracts top 3 positive insights
   - Extracts top 3 negative insights
   - Combines RAG retrieval with sentiment analysis

5-8. **ResearchAgent, OutlineAgent, WriterAgent, EditorAgent** (Simulated)
   - Document processing pipeline
   - Content generation capabilities
   - Future extensibility

### RAG System

**Agentic Retrieval:**
- Automatically decides when to retrieve context
- Keyword-based triggering
- Not all queries need retrieval

**Knowledge Store:**
- `network_outage_patterns.txt` - Historical outage analysis
- `customer_sentiment_logs.txt` - Feedback patterns
- `device_telemetry.txt` - Infrastructure metrics
- `repair_outcomes.txt` - Remediation strategies

**Retrieval Process:**
1. Query analysis
2. Document chunking (500 char chunks, 100 char overlap)
3. Relevance scoring (BM25-like)
4. Top-K selection (default K=3)

### ReAct Workflow

**Reasoning → Acting Pattern:**

```
Query: "Analyze network and customer feedback"

Step 1:
  Thought: "Need to analyze network infrastructure health"
  Action: Run NetworkAnalysisAgent with RAG context
  Observation: "Network has 1 critical issue in US-East-1"

Step 2:
  Thought: "Should extract customer insights"
  Action: Run CustomerAnalyticsAgent
  Observation: "Found 3 positive, 3 negative insights"

Step 3:
  Thought: "Network issues detected, need remediation"
  Action: Run SelfHealingAgent
  Observation: "Generated 3 repair plans"

Result: Complete multi-agent analysis with recommendations
```

## API Endpoints

### Network Analysis

```bash
curl -X POST http://localhost:3001/api/analyze/network \
  -H "Content-Type: application/json" \
  -d '{
    "includeRAG": true,
    "focusRegion": "us-east-1"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallStatus": "warning",
    "regions": [...],
    "issues": [...],
    "recommendations": [...],
    "metrics": {
      "activeIssues": 1,
      "avgLatency": 15.2,
      "packetLoss": 0.03,
      "uptime": 99.94
    }
  },
  "executionTime": 2500
}
```

### Customer Analytics

```bash
curl -X POST http://localhost:3001/api/analytics/top \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "positive": [
      {
        "id": "insight-123",
        "type": "positive",
        "description": "New UI is much cleaner",
        "sentiment": 87,
        "mentions": 210,
        "trend": "up",
        "summary": "Users love the redesigned interface"
      }
    ],
    "negative": [
      {
        "id": "insight-456",
        "type": "negative",
        "description": "Slow loading times",
        "sentiment": 22,
        "mentions": 342,
        "trend": "up",
        "summary": "Dashboard lag during peak hours"
      }
    ]
  }
}
```

### Self-Healing

```bash
curl -X POST http://localhost:3001/api/agents/self-heal \
  -H "Content-Type: application/json" \
  -d '{
    "useRAG": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repairActions": [
      {
        "id": "repair-1",
        "name": "Full Traffic Reroute & Server Reboot",
        "estimatedCost": 12500,
        "estimatedDowntime": 15,
        "affectedCustomers": 8500,
        "steps": [...],
        "isRecommended": true,
        "confidence": 0.92
      }
    ],
    "verificationStatus": "requires_monitoring",
    "logs": [...]
  }
}
```

### ReAct Workflow

```bash
curl -X POST http://localhost:3001/api/analytics/react \
  -H "Content-Type: application/json" \
  -d '{
    "query": "analyze network and customer sentiment",
    "enableRAG": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "analyze network and customer sentiment",
    "steps": [
      {
        "stepNumber": 1,
        "thought": "Need to analyze network infrastructure",
        "action": "Run NetworkAnalysisAgent",
        "observation": "Network has issues...",
        "agentsInvolved": ["network_analysis"]
      }
    ],
    "finalAnswer": {...},
    "totalSteps": 4,
    "executionTime": 8500,
    "agentsUsed": ["network_analysis", "customer_analytics", "self_healing"],
    "ragUsed": true
  }
}
```

## Frontend Integration

### Fetching Network Analysis

```typescript
// In your React component
const analyzeNetwork = async () => {
  const response = await fetch('http://localhost:3001/api/analyze/network', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ includeRAG: true })
  });

  const result = await response.json();

  if (result.success) {
    setNetworkStatus(result.data);
  }
};
```

### Fetching Customer Insights

```typescript
const fetchCustomerInsights = async () => {
  const response = await fetch('http://localhost:3001/api/analytics/top', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topK: 3 })
  });

  const result = await response.json();

  if (result.success) {
    setPositiveInsights(result.data.positive);
    setNegativeInsights(result.data.negative);
  }
};
```

### Running ReAct Workflow

```typescript
const runAnalysis = async (query: string) => {
  const response = await fetch('http://localhost:3001/api/analytics/react', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, enableRAG: true })
  });

  const result = await response.json();

  if (result.success) {
    console.log('ReAct steps:', result.data.steps);
    console.log('Final answer:', result.data.finalAnswer);
  }
};
```

## Environment Configuration

### Development

```env
# Backend (.env in /backend)
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
PORT=3001
NODE_ENV=development

# Frontend (.env.local in root)
VITE_API_URL=http://localhost:3001
```

### Production

```env
# Backend
LLM_PROVIDER=nvidia  # Switch to NVIDIA NIM
NVIDIA_API_KEY=your_nvidia_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
PORT=3001
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend.com
```

## Troubleshooting

### Backend won't start

**Check Gemini API key:**
```bash
cat backend/.env
```

Ensure `GEMINI_API_KEY` is set correctly.

**Check port availability:**
```bash
lsof -ti:3001
```

If port is in use, change `PORT` in `.env` or kill the process.

### API requests failing

**CORS issues:**
Backend has CORS enabled for all origins in development.

**Network errors:**
Ensure backend is running on `http://localhost:3001`

### RAG not returning context

**Check documents exist:**
```bash
ls backend/src/rag/docs/
```

Should see 4 `.txt` files.

**Restart backend:**
Documents are loaded on server startup.

### LLM API errors

**Gemini rate limiting:**
Free tier has rate limits. Wait a moment between requests.

**Invalid API key:**
Check key at [Google AI Studio](https://makersuite.google.com/app/apikey)

## Switching to NVIDIA NIM

For the GitHub production version:

1. Get NVIDIA NIM API key
2. Update `backend/.env`:
```env
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=your_nvidia_key_here
```

3. Restart backend

No code changes needed! The LLM abstraction layer handles the switch.

## Performance Optimization

**Caching:**
- Consider caching RAG retrievals
- Cache network analysis for 30-60 seconds
- Implement request deduplication

**Rate Limiting:**
- Add rate limiting middleware
- Implement request queuing for LLM calls
- Use exponential backoff for retries

**Scaling:**
- Run multiple backend instances
- Use Redis for shared state
- Implement load balancing

## Development Tips

### Hot Reload

Backend uses `tsx watch` for auto-reload during development.

### Debugging

Enable verbose logging:
```typescript
// In any agent
this.log('debug', 'Detailed information', { data });
```

### Testing Agents

Test individual agents directly:
```bash
# In backend directory
npx tsx
```

```typescript
import { NetworkAnalysisAgent } from './src/agents/NetworkAnalysisAgent.js';

const agent = new NetworkAnalysisAgent();
const result = await agent.run({ includeRAG: true });
console.log(result);
```

## License

MIT
