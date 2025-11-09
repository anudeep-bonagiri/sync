# Sync

Multi-agent AI operations platform with agentic RAG and ReAct workflows.

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Node.js%2018-339933?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%7C%20NVIDIA-4285F4" alt="AI" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</div>

## Overview

Sync is a **simulated multi-agent AI operations platform** inspired by NVIDIA's agentic architecture. It features:

- 🤖 **8 Specialized AI Agents** with distinct roles
- 🧠 **Agentic RAG System** with intelligent context retrieval
- 🔄 **ReAct Workflows** (Reasoning + Acting loops)
- ⚡ **Real-time Network Analysis** using Gemini LLM
- 📊 **Customer Sentiment Analysis** with LLM scoring
- 🔧 **Self-Healing Automation** for network remediation

## Project Structure

```
Sync/
├── frontend/              # React + Vite dashboard
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── App.tsx        # Main app
│   │   └── index.tsx      # Entry point
│   ├── package.json
│   └── CLAUDE.md          # Frontend development guide
│
├── backend/               # Node.js + Express API
│   ├── src/
│   │   ├── agents/        # 8 AI agents
│   │   ├── llm/           # Gemini/NVIDIA abstraction
│   │   ├── rag/           # RAG system + knowledge docs
│   │   ├── workflows/     # ReAct orchestrator
│   │   ├── routes/        # Express API routes
│   │   └── server.ts      # Main server
│   ├── package.json
│   ├── README.md          # Backend setup guide
│   └── ARCHITECTURE.md    # Architecture documentation
│
├── BACKEND_INTEGRATION.md # Integration guide
└── README.md              # This file
```

## Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Gemini API Key** (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Sync

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Backend

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
LLM_PROVIDER=gemini
PORT=3001
NODE_ENV=development
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Dashboard runs on `http://localhost:3000`

## Features

### Frontend Dashboard

- **Real-time Network Monitoring** with regional status
- **Customer Voice Analytics** (positive/negative insights)
- **AI Simulation Tracker** showing agent progress
- **Repair Recommendations** with cost/impact analysis
- **Historical Performance Charts** with time-range selection
- **Dark Mode** support

### Backend Multi-Agent System

#### Real LLM Agents (Using Gemini)

1. **NetworkAnalysisAgent**
   - Dynamic network health analysis
   - Regional infrastructure assessment
   - Issue detection and recommendations
   - Optional RAG context integration

2. **SentimentAgent**
   - Customer feedback sentiment scoring (0-100)
   - Positive/negative classification
   - Trend analysis
   - Summary generation

#### Simulated Agents

3. **SelfHealingAgent**
   - Automated remediation strategies
   - Repair action planning
   - Cost/downtime/impact estimation
   - Verification simulation

4. **CustomerAnalyticsAgent**
   - Combines RAG + LLM
   - Extracts top 3 positive insights
   - Extracts top 3 negative insights
   - Real sentiment analysis per insight

5-8. **ResearchAgent, OutlineAgent, WriterAgent, EditorAgent**
   - Content processing pipeline
   - Future extensibility

### Agentic RAG System

**Knowledge Store** (`backend/src/rag/docs/`):
- `network_outage_patterns.txt` - Historical outage data
- `customer_sentiment_logs.txt` - Customer feedback patterns
- `device_telemetry.txt` - Infrastructure metrics
- `repair_outcomes.txt` - Remediation strategies

**Intelligent Retrieval:**
- Automatically decides when context is needed
- Keyword-based triggering
- Not all queries require retrieval
- BM25-like relevance scoring

### ReAct Workflow

**Reasoning → Acting Pattern:**

```
Query: "Analyze network and customer feedback"

Step 1: Thought → Action → Observation
  "Need network analysis" → Run NetworkAnalysisAgent → "Found issues"

Step 2: Thought → Action → Observation
  "Need customer insights" → Run CustomerAnalyticsAgent → "Got insights"

Step 3: Thought → Action → Observation
  "Need remediation" → Run SelfHealingAgent → "Generated plans"

Result: Complete multi-agent analysis
```

## API Endpoints

### Network Analysis
```bash
POST http://localhost:3001/api/analyze/network
{
  "includeRAG": true,
  "focusRegion": "us-east-1"
}
```

### Customer Analytics
```bash
POST http://localhost:3001/api/analytics/top
{
  "topK": 3
}
```

### Self-Healing
```bash
POST http://localhost:3001/api/agents/self-heal
{
  "useRAG": true
}
```

### ReAct Workflow
```bash
POST http://localhost:3001/api/analytics/react
{
  "query": "analyze network and customer sentiment",
  "enableRAG": true
}
```

### RAG Context
```bash
POST http://localhost:3001/api/rag/context
{
  "query": "network outage patterns",
  "topK": 3
}
```

## Development

### Frontend Development

```bash
cd frontend
npm run dev      # Development server with HMR
npm run build    # Production build
npm run preview  # Preview production build
```

See `frontend/CLAUDE.md` for component architecture.

### Backend Development

```bash
cd backend
npm run dev      # Development server with auto-reload
npm run build    # TypeScript compilation
npm start        # Production mode
```

See `backend/README.md` and `backend/ARCHITECTURE.md` for details.

## Switching to NVIDIA NIM

The backend is designed for easy provider switching:

**Current (Hackathon):**
```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_key
```

**Future (Production):**
```env
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=your_nvidia_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```

**No code changes needed!** The LLM abstraction layer handles everything.

## Architecture Highlights

### Frontend
- React 19 with TypeScript
- Vite for blazing-fast HMR
- Tailwind CSS for styling
- Recharts for data visualization
- Custom hooks for state management

### Backend
- Node.js + Express + TypeScript
- Modular agent architecture
- Pluggable LLM providers (Gemini/NVIDIA)
- File-based RAG with chunking
- ReAct workflow orchestration
- Comprehensive logging

### Design Patterns
- **Template Method** (BaseAgent)
- **Strategy** (LLM providers)
- **Singleton** (RAG system, LLM client)
- **Chain of Responsibility** (ReAct workflow)

## Documentation

- **Frontend:** `frontend/CLAUDE.md`
- **Backend:** `backend/README.md`
- **Architecture:** `backend/ARCHITECTURE.md`
- **Integration:** `BACKEND_INTEGRATION.md`

## Testing

### Backend API

```bash
# Health check
curl http://localhost:3001/health

# Network analysis
curl -X POST http://localhost:3001/api/analyze/network \
  -H "Content-Type: application/json" \
  -d '{"includeRAG": true}'

# Customer insights
curl -X POST http://localhost:3001/api/analytics/top \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}'
```

### Frontend

Open http://localhost:3000 and explore:
- Overview tab: Network status + customer voice
- Live AI Analysis tab: Agent simulation + repair plans
- Performance Analytics tab: Historical trends

## Troubleshooting

### Backend won't start

**Check API key:**
```bash
cat backend/.env | grep GEMINI_API_KEY
```

**Check port:**
```bash
lsof -ti:3001  # Kill with: kill -9 <PID>
```

### Frontend can't reach backend

Ensure backend is running on `http://localhost:3001`

Check CORS is enabled (it is by default in development)

### RAG not working

Verify documents exist:
```bash
ls backend/src/rag/docs/*.txt
```

Should show 4 `.txt` files. Restart backend if you add new documents.

## Contributing

This is a hackathon/demo project. For production use:

1. Implement real NVIDIA NIM provider
2. Add vector database for RAG (Pinecone, Weaviate)
3. Implement caching layer (Redis)
4. Add comprehensive tests
5. Implement rate limiting
6. Add authentication/authorization
7. Deploy with proper monitoring

## License

MIT

## Acknowledgments

- Inspired by NVIDIA's agentic AI architecture
- Built with Google Gemini API
- Designed for easy migration to NVIDIA NIM

---

**Built for hackathons. Ready for production.**
