# Sync Backend Architecture

Complete architectural documentation for the multi-agent AI operations platform.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Express Server                          │
│                     (Port 3001, CORS enabled)                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │ Routes  │   │   RAG   │   │   LLM   │
   │ Layer   │   │ System  │   │ Client  │
   └────┬────┘   └────┬────┘   └────┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  Agent  │   │  Agent  │   │  Agent  │
   │  Pool   │   │  Pool   │   │  Pool   │
   └─────────┘   └─────────┘   └─────────┘
```

## Core Components

### 1. LLM Abstraction Layer

**Location:** `/src/llm/`

**Purpose:** Pluggable interface for LLM providers

**Files:**
- `llmClient.ts` - Main abstraction interface
- `geminiProvider.ts` - Google Gemini implementation
- `nvidiaProvider.ts` - NVIDIA NIM stub (future)

**Design Pattern:** Strategy Pattern + Singleton

```typescript
interface ILLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>
  getName(): string
}

// Singleton access
const llm = getLLMClient();
const response = await llm.generate({
  prompt: "...",
  temperature: 0.7
});
```

**Provider Switching:**
```env
LLM_PROVIDER=gemini  # or nvidia
```

No code changes required to switch providers.

### 2. RAG System

**Location:** `/src/rag/`

**Purpose:** Agentic Retrieval Augmented Generation

**Components:**

#### Knowledge Store (`/src/rag/docs/`)
- Plain text documents (.txt)
- Historical patterns
- Customer feedback
- Telemetry data
- Repair outcomes

#### Embeddings (`embeddings.ts`)
- Simplified TF-IDF approach
- Cosine similarity scoring
- BM25-like relevance
- Future: Real embeddings (Gemini/NVIDIA)

#### RAG System (`ragSystem.ts`)
- Document loading
- Chunking (500 chars, 100 overlap)
- Relevance scoring
- Top-K retrieval

**Agentic Behavior:**
```typescript
shouldRetrieve(query: string): boolean {
  // Decides if query needs RAG
  // Based on keyword analysis
}
```

**Keywords that trigger retrieval:**
- history, past, previous
- pattern, similar
- customer, feedback, sentiment
- outage, issue, problem
- telemetry, data, analysis

### 3. Agent System

**Location:** `/src/agents/`

**Architecture:** Template Method Pattern

**Base Class:**
```typescript
abstract class BaseAgent<TInput, TOutput> {
  abstract execute(input: TInput): Promise<TOutput>

  async run(input: TInput): Promise<AgentResult<TOutput>> {
    // State management
    // Logging
    // Error handling
    // Timing
  }

  protected log(level, message, data)
  protected updateState(status, message, progress)
  protected delay(ms)
}
```

**Agent Lifecycle:**
```
idle → running → complete/error
  0%  →  1-99%  →     100%
```

#### Agent Implementations

**NetworkAnalysisAgent** (Real LLM)
- Input: `{ includeRAG?: boolean, focusRegion?: string }`
- Output: `NetworkAnalysis`
- LLM: Gemini (temperature: 0.8 for variety)
- RAG: Optional historical context
- Duration: ~2-4 seconds

**SentimentAgent** (Real LLM)
- Input: `{ text: string, source?: string }`
- Output: `CustomerInsight`
- LLM: Gemini (temperature: 0.3 for consistency)
- Returns: Type, score (0-100), summary, trend
- Duration: ~1-2 seconds

**SelfHealingAgent** (Simulated)
- Input: `{ networkAnalysis, useRAG?: boolean }`
- Output: `{ repairActions[], verificationStatus, logs[] }`
- Simulates: 2 seconds of processing
- Generates: 3 repair action plans
- Returns: Recommended plan + alternatives

**CustomerAnalyticsAgent** (LLM + RAG)
- Input: `{ query: string, topK?: number }`
- Output: `{ positiveInsights[], negativeInsights[] }`
- Workflow:
  1. Retrieve customer feedback from RAG
  2. Extract feedback items
  3. Run SentimentAgent on each
  4. Sort and categorize
  5. Return top K of each type

**ResearchAgent** (Simulated)
- Input: `{ topic: string, depth?: 'quick' | 'thorough' }`
- Output: `RAGContext`
- Delegates to RAG system

**OutlineAgent, WriterAgent, EditorAgent** (Simulated)
- Document processing pipeline
- Future extensibility
- Content generation capabilities

### 4. ReAct Workflow

**Location:** `/src/workflows/reactWorkflow.ts`

**Pattern:** Reasoning + Acting Loop

**Architecture:**
```typescript
class ReActWorkflow {
  async execute(input: ReActInput): Promise<ReActResult> {
    // Loop: Thought → Action → Observation
  }

  private reason(query, step): string
  private determineAction(thought, query): string
  private synthesizeFinalAnswer(): any
}
```

**Execution Flow:**
```
1. Analyze query
2. Reason about what's needed
3. Determine which agent to invoke
4. Execute agent
5. Observe result
6. Repeat until complete
7. Synthesize final answer
```

**Example:**
```
Query: "Analyze network and customer issues"

Step 1:
  Thought: "Query mentions network, need analysis"
  Action: NetworkAnalysisAgent
  Observation: "Found 1 critical issue"

Step 2:
  Thought: "Query mentions customer, need insights"
  Action: CustomerAnalyticsAgent
  Observation: "Found 3 positive, 3 negative"

Step 3:
  Thought: "Critical issue detected, need remediation"
  Action: SelfHealingAgent
  Observation: "Generated 3 repair plans"

Final Answer: Complete analysis with all data
```

### 5. API Routes

**Location:** `/src/routes/`

**Pattern:** Express Router

#### Analyze Routes (`/api/analyze/*`)
- `POST /network` - Network analysis

#### RAG Routes (`/api/rag/*`)
- `POST /context` - Retrieve context
- `GET /stats` - RAG statistics

#### Analytics Routes (`/api/analytics/*`)
- `POST /top` - Top customer insights
- `POST /react` - ReAct workflow

#### Self-Heal Routes (`/api/agents/*`)
- `POST /self-heal` - Automated remediation

**Middleware Stack:**
```
Request
  → CORS
  → JSON Parser
  → Logger
  → Route Handler
  → Error Handler
  → Response
```

## Data Flow

### Network Analysis Flow

```
Client Request
  ↓
POST /api/analyze/network { includeRAG: true }
  ↓
analyzeRoutes.ts
  ↓
NetworkAnalysisAgent.run()
  ↓
├─ Optional: RAG retrieval
│  └─ ragSystem.retrieve("network patterns")
│     └─ Scores all document chunks
│        └─ Returns top 3
│
└─ LLM generation
   └─ getLLMClient().generate()
      └─ GeminiProvider.generate()
         └─ Google Gemini API
            ↓
         Response
            ↓
Parse + structure data
  ↓
Return NetworkAnalysis
  ↓
Client Response
```

### Customer Analytics Flow

```
Client Request
  ↓
POST /api/analytics/top { topK: 3 }
  ↓
analyticsRoutes.ts
  ↓
CustomerAnalyticsAgent.run()
  ↓
RAG retrieval
  └─ ragSystem.retrieve("customer sentiment")
     └─ Returns customer feedback chunks
        ↓
Extract feedback items
  ↓
For each item:
  └─ SentimentAgent.run({ text: item })
     └─ LLM sentiment analysis
        ↓
     CustomerInsight
  ↓
Categorize (positive/negative)
  ↓
Sort by sentiment score
  ↓
Return top K of each
  ↓
Client Response { positive: [], negative: [] }
```

## Scalability Considerations

### Horizontal Scaling

**Stateless Design:**
- No in-memory session state
- RAG system reloads on each instance
- LLM client is singleton per instance

**Load Balancing:**
```
Client → Load Balancer → Backend Instance 1
                      → Backend Instance 2
                      → Backend Instance 3
```

**Shared Resources:**
- RAG documents on shared storage (S3)
- Redis for caching LLM responses
- Distributed rate limiting

### Vertical Scaling

**Resource Intensive Operations:**
- LLM API calls (I/O bound)
- RAG similarity calculations (CPU bound)
- JSON parsing (CPU bound)

**Optimization:**
- Cache frequent queries
- Batch similar requests
- Use connection pooling
- Implement request queuing

### Caching Strategy

**Layer 1: LLM Response Cache**
```typescript
const cacheKey = hash(prompt + systemPrompt);
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

**Layer 2: RAG Retrieval Cache**
```typescript
const cacheKey = hash(query);
if (cache.has(cacheKey) && !isStale(cache.get(cacheKey))) {
  return cache.get(cacheKey);
}
```

**Layer 3: Agent Result Cache**
```typescript
// For deterministic agents only
const cacheKey = hash(input);
```

## Security Considerations

### API Key Management

**Never commit:**
- `.env` file (git ignored)
- API keys in code
- Credentials in logs

**Best practices:**
- Use environment variables
- Rotate keys regularly
- Implement key expiration
- Monitor usage

### Input Validation

```typescript
// Validate all inputs
if (!query || typeof query !== 'string') {
  return res.status(400).json({ error: 'Invalid query' });
}

// Sanitize inputs
const sanitized = sanitizeInput(query);

// Rate limiting
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
});
```

### CORS Configuration

**Development:**
```typescript
app.use(cors()); // Allow all origins
```

**Production:**
```typescript
app.use(cors({
  origin: ['https://your-frontend.com'],
  credentials: true
}));
```

## Monitoring & Observability

### Logging

**Levels:**
- `debug` - Detailed diagnostic info
- `info` - General informational messages
- `warn` - Warning messages
- `error` - Error messages

**Structured Logging:**
```typescript
this.log('info', 'Agent completed', {
  agent: 'network_analysis',
  duration: 2500,
  status: 'success'
});
```

### Metrics

**Key Metrics:**
- Request count by endpoint
- Response time percentiles (p50, p95, p99)
- Error rate
- LLM API latency
- RAG retrieval time
- Agent execution time

**Implementation:**
```typescript
const startTime = Date.now();
// ... operation ...
const duration = Date.now() - startTime;
metrics.record('agent.execution_time', duration, {
  agent: 'network_analysis'
});
```

### Health Checks

```typescript
GET /health
{
  status: 'healthy',
  checks: {
    llm: 'connected',
    rag: 'loaded',
    disk: 'ok',
    memory: 'ok'
  }
}
```

## Testing Strategy

### Unit Tests

**Agent Testing:**
```typescript
import { NetworkAnalysisAgent } from './agents/NetworkAnalysisAgent';

describe('NetworkAnalysisAgent', () => {
  it('should analyze network', async () => {
    const agent = new NetworkAnalysisAgent();
    const result = await agent.run({ includeRAG: false });

    expect(result.success).toBe(true);
    expect(result.data.overallStatus).toBeDefined();
  });
});
```

### Integration Tests

**API Testing:**
```typescript
import request from 'supertest';
import app from './server';

describe('POST /api/analyze/network', () => {
  it('should return network analysis', async () => {
    const response = await request(app)
      .post('/api/analyze/network')
      .send({ includeRAG: true });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### Load Testing

```bash
# Apache Bench
ab -n 1000 -c 10 http://localhost:3001/api/analyze/network

# K6
k6 run load-test.js
```

## Deployment

### Development

```bash
npm run dev  # Auto-reload
```

### Production

```bash
npm run build
npm start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/server.js"]
```

### Environment Variables

**Required:**
- `GEMINI_API_KEY` or `NVIDIA_API_KEY`
- `LLM_PROVIDER`

**Optional:**
- `PORT` (default: 3001)
- `NODE_ENV` (default: development)
- `RAG_CHUNK_SIZE` (default: 500)
- `RAG_CHUNK_OVERLAP` (default: 100)
- `RAG_TOP_K` (default: 3)

## Future Enhancements

### Short Term

1. **Real Embeddings**
   - Switch from BM25 to vector embeddings
   - Use Gemini Embedding API or NVIDIA
   - Store in vector database (Pinecone, Weaviate)

2. **Caching Layer**
   - Redis for LLM response caching
   - RAG retrieval caching
   - Configurable TTL

3. **Rate Limiting**
   - Per-endpoint limits
   - Per-user limits
   - LLM API quota management

### Long Term

1. **NVIDIA NIM Integration**
   - Complete NvidiaProvider implementation
   - Multi-model support
   - Model routing logic

2. **Agent Orchestration**
   - Complex multi-agent workflows
   - Parallel agent execution
   - Agent-to-agent communication

3. **Advanced RAG**
   - Hybrid retrieval (dense + sparse)
   - Re-ranking
   - Query expansion
   - Contextual compression

4. **Observability**
   - OpenTelemetry integration
   - Distributed tracing
   - APM integration

## License

MIT
