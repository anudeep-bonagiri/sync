# Sync Backend

Multi-agent AI operations platform with agentic RAG and ReAct workflows.

## Architecture

### Core Components

1. **Multi-Agent System**: 8 specialized agents with common interface
2. **Agentic RAG**: Intelligent context retrieval from knowledge store
3. **ReAct Workflow**: Reasoning and Acting orchestrator
4. **LLM Abstraction**: Pluggable provider layer (Gemini/NVIDIA NIM)

### Agents

- **NetworkAnalysisAgent** (Real LLM): Dynamic network health analysis using Gemini
- **SentimentAgent** (Real LLM): Customer sentiment scoring using Gemini
- **SelfHealingAgent** (Simulated): Automatic remediation strategies
- **CustomerAnalyticsAgent** (LLM + RAG): Top positive/negative insights
- **ResearchAgent** (Simulated): Knowledge base retrieval
- **OutlineAgent** (Simulated): Structure generation
- **WriterAgent** (Simulated): Content generation
- **EditorAgent** (Simulated): Review and refinement

## Setup

### Prerequisites

- Node.js 18+ and npm
- Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_key_here
```

### Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Network Analysis

**POST** `/api/analyze/network`
```json
{
  "includeRAG": true,
  "focusRegion": "us-east-1"
}
```

### RAG Context Retrieval

**POST** `/api/rag/context`
```json
{
  "query": "network outage patterns",
  "topK": 3
}
```

**GET** `/api/rag/stats` - Get RAG system statistics

### Customer Analytics

**POST** `/api/analytics/top`
```json
{
  "topK": 3
}
```

**POST** `/api/analytics/react`
```json
{
  "query": "analyze customer sentiment",
  "enableRAG": true
}
```

### Self-Healing

**POST** `/api/agents/self-heal`
```json
{
  "networkAnalysis": {...},
  "useRAG": true
}
```

## RAG Knowledge Store

Documents in `/src/rag/docs/`:
- `network_outage_patterns.txt` - Historical outage data
- `customer_sentiment_logs.txt` - Customer feedback analysis
- `device_telemetry.txt` - Infrastructure metrics
- `repair_outcomes.txt` - Remediation strategies

### Adding Documents

1. Create `.txt` files in `/src/rag/docs/`
2. Restart server to load new documents
3. Documents are automatically chunked and indexed

## LLM Provider Configuration

### Using Gemini (Default)

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

### Using NVIDIA NIM (Future)

```env
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=your_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

## Architecture Details

### ReAct Workflow

The ReAct (Reasoning + Acting) workflow:

1. **Thought**: Analyze what needs to be done
2. **Action**: Select and run appropriate agent
3. **Observation**: Process agent results
4. **Repeat**: Continue until complete

Example flow:
```
Query: "Analyze network and customer sentiment"
→ Thought: Need network analysis
→ Action: Run NetworkAnalysisAgent
→ Observation: Network has issues
→ Thought: Need customer insights
→ Action: Run CustomerAnalyticsAgent
→ Observation: Found top complaints
→ Thought: Should remediate
→ Action: Run SelfHealingAgent
→ Result: Complete analysis with recommendations
```

### Agent Communication

Agents share a common interface:
```typescript
interface BaseAgent<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
  run(input: TInput): Promise<AgentResult<TOutput>>
  getState(): AgentState
  getLogs(): AgentLog[]
}
```

All agents:
- Return structured results
- Track execution state
- Generate detailed logs
- Support async execution

### Agentic RAG

The RAG system intelligently decides when retrieval is needed:

```typescript
shouldRetrieve(query): boolean
```

Retrieval keywords: history, past, previous, similar, outage, pattern, customer, feedback, sentiment, etc.

Not all queries need RAG - simple requests bypass retrieval.

## Development

### Project Structure

```
backend/
├── src/
│   ├── agents/          # Agent implementations
│   ├── llm/             # LLM abstraction layer
│   ├── rag/             # RAG system + docs
│   ├── workflows/       # ReAct orchestrator
│   ├── routes/          # Express routes
│   ├── types/           # TypeScript types
│   └── server.ts        # Main server
├── package.json
├── tsconfig.json
└── README.md
```

### Adding New Agents

1. Extend `BaseAgent<TInput, TOutput>`
2. Implement `execute()` method
3. Add to workflow if needed
4. Create route endpoint

Example:
```typescript
import { BaseAgent } from './BaseAgent.js';

export class MyAgent extends BaseAgent<MyInput, MyOutput> {
  constructor() {
    super('my_agent');
  }

  async execute(input: MyInput): Promise<MyOutput> {
    this.updateState('running', 'Processing...', 50);
    // Your logic here
    return result;
  }
}
```

## Hackathon → Production

This backend is designed for easy transition:

**Hackathon Mode (Current)**:
- Uses Gemini API (fast, free tier)
- Simulated agents for speed
- Local RAG with simple embeddings

**Production Mode (Future GitHub Version)**:
- Switch to NVIDIA NIM (change env var)
- Real agent implementations
- Advanced embeddings (NVIDIA)

No code changes needed - just configuration!

## Troubleshooting

### "GEMINI_API_KEY environment variable is required"

Make sure `.env` file exists with valid key:
```bash
cat .env
```

### RAG not loading documents

Check that documents exist:
```bash
ls src/rag/docs/
```

Restart server after adding documents.

### Port already in use

Change port in `.env`:
```env
PORT=3002
```

## Testing

Test the API:

```bash
# Health check
curl http://localhost:3001/health

# Network analysis
curl -X POST http://localhost:3001/api/analyze/network \
  -H "Content-Type: application/json" \
  -d '{"includeRAG": true}'

# Customer analytics
curl -X POST http://localhost:3001/api/analytics/top \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}'
```

## License

MIT
