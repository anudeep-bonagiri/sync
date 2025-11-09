# Sync Project Structure

Complete directory structure and organization guide.

## Overview

```
Sync/
├── frontend/              # React dashboard (Port 3000)
├── backend/               # Express API server (Port 3001)
├── README.md              # Main project documentation
├── BACKEND_INTEGRATION.md # Integration guide
├── STRUCTURE.md           # This file
├── package.json           # Root package.json with scripts
└── .gitignore            # Git ignore rules
```

## Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AISimulation.tsx           # Agent progress tracker
│   │   ├── CustomerPainPoints.tsx     # Pain points display
│   │   ├── Header.tsx                 # App header with theme toggle
│   │   ├── HistoricalPerformanceChart.tsx  # Recharts visualization
│   │   ├── LiveCustomerVoice.tsx      # Customer sentiment cards
│   │   ├── MainTabs.tsx               # Tab navigation
│   │   ├── MetricCard.tsx             # Dashboard metric cards
│   │   ├── NetworkMonitor.tsx         # Regional status monitor
│   │   ├── RepairRecommendations.tsx  # Repair action cards
│   │   ├── SentimentCard.tsx          # Expandable feedback cards
│   │   ├── Toast.tsx                  # Toast notifications
│   │   └── icons.tsx                  # SVG icon components
│   │
│   ├── hooks/
│   │   └── useMockData.ts             # Main state management hook
│   │
│   ├── App.tsx                        # Root component
│   ├── index.tsx                      # React entry point
│   ├── index.css                      # Global styles
│   └── types.ts                       # TypeScript types
│
├── index.html                         # HTML entry point
├── package.json                       # Frontend dependencies
├── tsconfig.json                      # TypeScript config
├── vite.config.ts                     # Vite configuration
├── CLAUDE.md                          # Frontend dev guide
└── node_modules/                      # Dependencies (gitignored)
```

### Frontend Dependencies

**Production:**
- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM renderer
- `recharts@3.3.0` - Data visualization

**Development:**
- `vite@6.2.0` - Build tool
- `typescript@5.8.2` - Type checking
- `@vitejs/plugin-react@5.0.0` - React plugin
- `@types/node@22.14.0` - Node type definitions

**Styling:**
- Tailwind CSS (CDN-loaded)
- Custom CSS in `index.css`

### Frontend Entry Point Flow

```
index.html
  ↓
src/index.tsx (ReactDOM.createRoot)
  ↓
src/App.tsx (Main component)
  ↓
Components (Header, Tabs, Metric Cards, etc.)
  ↓
useMockData hook (State management)
```

## Backend Structure

```
backend/
├── src/
│   ├── agents/
│   │   ├── BaseAgent.ts                # Abstract base class
│   │   ├── NetworkAnalysisAgent.ts     # Real LLM network analysis
│   │   ├── SentimentAgent.ts           # Real LLM sentiment scoring
│   │   ├── SelfHealingAgent.ts         # Simulated remediation
│   │   ├── CustomerAnalyticsAgent.ts   # LLM + RAG analytics
│   │   ├── ResearchAgent.ts            # RAG retrieval agent
│   │   ├── OutlineAgent.ts             # Simulated outline generator
│   │   ├── WriterAgent.ts              # Simulated content writer
│   │   └── EditorAgent.ts              # Simulated editor
│   │
│   ├── llm/
│   │   ├── llmClient.ts                # LLM abstraction layer
│   │   ├── geminiProvider.ts           # Google Gemini implementation
│   │   └── nvidiaProvider.ts           # NVIDIA NIM stub
│   │
│   ├── rag/
│   │   ├── docs/
│   │   │   ├── network_outage_patterns.txt     # Historical outages
│   │   │   ├── customer_sentiment_logs.txt     # Customer feedback
│   │   │   ├── device_telemetry.txt            # Infrastructure metrics
│   │   │   └── repair_outcomes.txt             # Remediation history
│   │   ├── ragSystem.ts                # RAG orchestrator
│   │   └── embeddings.ts               # Similarity scoring
│   │
│   ├── workflows/
│   │   └── reactWorkflow.ts            # ReAct orchestrator
│   │
│   ├── routes/
│   │   ├── analyzeRoutes.ts            # /api/analyze/*
│   │   ├── ragRoutes.ts                # /api/rag/*
│   │   ├── analyticsRoutes.ts          # /api/analytics/*
│   │   └── selfHealRoutes.ts           # /api/agents/self-heal
│   │
│   ├── types/
│   │   └── index.ts                    # TypeScript type definitions
│   │
│   └── server.ts                       # Express server entry point
│
├── dist/                               # Compiled JavaScript (gitignored)
├── package.json                        # Backend dependencies
├── tsconfig.json                       # TypeScript config
├── .env                                # Environment variables (gitignored)
├── .env.example                        # Environment template
├── .gitignore                          # Backend-specific ignores
├── README.md                           # Backend setup guide
├── ARCHITECTURE.md                     # Architecture documentation
└── node_modules/                       # Dependencies (gitignored)
```

### Backend Dependencies

**Production:**
- `express@4.21.2` - Web framework
- `cors@2.8.5` - CORS middleware
- `dotenv@16.4.5` - Environment variables
- `@google/generative-ai@0.21.0` - Gemini API
- `zod@3.24.1` - Schema validation

**Development:**
- `typescript@5.8.2` - Type checking
- `tsx@4.19.2` - TypeScript execution
- `@types/express@5.0.0` - Express types
- `@types/cors@2.8.17` - CORS types
- `@types/node@22.14.0` - Node types

### Backend API Flow

```
Client Request
  ↓
Express Server (server.ts)
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Request Logger
  ↓
Route Handler (routes/)
  ↓
Agent Execution (agents/)
  ├─ LLM Client (llm/)
  └─ RAG System (rag/)
  ↓
Response
```

## Root-Level Files

### package.json (Root)

Convenience scripts for managing both frontend and backend:

```json
{
  "scripts": {
    "install:all": "Install all dependencies",
    "dev:frontend": "Start frontend dev server",
    "dev:backend": "Start backend dev server",
    "build:frontend": "Build frontend for production",
    "build:backend": "Build backend for production",
    "build": "Build both frontend and backend",
    "clean": "Remove all node_modules and build outputs"
  }
}
```

### README.md (Root)

Main project documentation covering:
- Project overview and features
- Quick start guide
- API endpoints
- Development instructions
- Architecture highlights
- Troubleshooting

### BACKEND_INTEGRATION.md

Frontend-backend integration guide:
- API endpoint documentation
- Request/response examples
- Environment configuration
- Integration code examples

### STRUCTURE.md (This File)

Project structure documentation.

### .gitignore (Root)

Ignores:
- `node_modules/` (both frontend and backend)
- `dist/` (build outputs)
- `.env` (environment variables)
- `.DS_Store` (macOS)
- IDE files

## Development Workflow

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd Sync

# Install all dependencies (from root)
npm run install:all

# Or install individually
cd frontend && npm install
cd ../backend && npm install
```

### Running in Development

**Option 1: Using root scripts**

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

**Option 2: Direct execution**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

**From root:**
```bash
npm run build  # Builds both
```

**Or individually:**
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

### Cleaning

```bash
npm run clean  # From root
```

## Port Configuration

| Service  | Port | URL |
|----------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend  | 3001 | http://localhost:3001 |

Ports can be changed:
- **Frontend:** Edit `frontend/vite.config.ts`
- **Backend:** Edit `backend/.env` (PORT variable)

## Environment Variables

### Frontend

No environment variables required for development.

For production API connection:
```env
# frontend/.env.production
VITE_API_URL=https://your-backend-api.com
```

### Backend

**Required:**
```env
# backend/.env
GEMINI_API_KEY=your_gemini_api_key
LLM_PROVIDER=gemini
```

**Optional:**
```env
PORT=3001
NODE_ENV=development
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=100
RAG_TOP_K=3
```

## File Naming Conventions

### Frontend

- **Components:** PascalCase (`MetricCard.tsx`, `LiveCustomerVoice.tsx`)
- **Hooks:** camelCase with `use` prefix (`useMockData.ts`)
- **Utilities:** camelCase (`types.ts`, `index.css`)

### Backend

- **Agents:** PascalCase with `Agent` suffix (`NetworkAnalysisAgent.ts`)
- **Routes:** camelCase with `Routes` suffix (`analyzeRoutes.ts`)
- **Systems:** camelCase (`ragSystem.ts`, `llmClient.ts`)
- **Types:** lowercase (`index.ts`)

## Import Path Conventions

### Frontend

```typescript
// Relative imports
import { MetricCard } from './components/MetricCard';
import { useMockData } from './hooks/useMockData';
import type { NetworkRegion } from './types';
```

### Backend

```typescript
// ES modules with .js extension (required)
import { BaseAgent } from './BaseAgent.js';
import type { AgentResult } from '../types/index.js';
import { getLLMClient } from '../llm/llmClient.js';
```

## Key Architectural Decisions

### Why Separate frontend/ and backend/?

1. **Clear Separation of Concerns**
   - Frontend focuses on UI/UX
   - Backend focuses on agents and AI

2. **Independent Deployment**
   - Can deploy frontend and backend separately
   - Different scaling requirements

3. **Different Tech Stacks**
   - Frontend: React + Vite (browser)
   - Backend: Node + Express (server)

4. **Better Organization**
   - Each has its own dependencies
   - Easier to navigate
   - Clear ownership

### Why Keep Root package.json?

- Convenience scripts for developers
- Easy to install/build/run everything
- Good for monorepo-style management
- Doesn't conflict with sub-packages

## Adding New Features

### New Frontend Component

1. Create in `frontend/src/components/`
2. Import in `App.tsx`
3. Update types in `types.ts` if needed
4. Update `CLAUDE.md` documentation

### New Backend Agent

1. Create in `backend/src/agents/`
2. Extend `BaseAgent<TInput, TOutput>`
3. Implement `execute()` method
4. Add route in `routes/`
5. Update type definitions
6. Update `ARCHITECTURE.md`

### New API Endpoint

1. Create or update route file in `backend/src/routes/`
2. Register in `server.ts`
3. Add types in `types/index.ts`
4. Document in `README.md` and `BACKEND_INTEGRATION.md`

### New RAG Document

1. Add `.txt` file to `backend/src/rag/docs/`
2. Restart backend (auto-loads on startup)
3. No code changes needed

## Common Operations

### Change Ports

**Frontend (3000 → 3001):**
```typescript
// frontend/vite.config.ts
export default defineConfig({
  server: {
    port: 3001, // Change this
  }
});
```

**Backend (3001 → 3002):**
```env
# backend/.env
PORT=3002
```

### Switch LLM Provider

```env
# backend/.env
LLM_PROVIDER=nvidia  # Change from gemini to nvidia
NVIDIA_API_KEY=your_key
```

No code changes needed!

### Add Caching

Implement in `backend/src/llm/llmClient.ts` or create new `cache/` directory.

### Add Database

1. Create `backend/src/db/` directory
2. Add database client
3. Update agents to use DB instead of RAG
4. Add migrations if needed

## Troubleshooting

### Frontend won't start

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start

```bash
cd backend
# Check .env file
cat .env
# Rebuild
npm run build
npm run dev
```

### Import errors

Make sure all backend imports use `.js` extension:
```typescript
// ✅ Correct
import { BaseAgent } from './BaseAgent.js';

// ❌ Wrong
import { BaseAgent } from './BaseAgent';
```

### Port already in use

```bash
# Find process
lsof -ti:3000  # or 3001

# Kill process
kill -9 <PID>
```

## Next Steps

See individual documentation:
- `frontend/CLAUDE.md` - Frontend development
- `backend/README.md` - Backend setup
- `backend/ARCHITECTURE.md` - Architecture details
- `BACKEND_INTEGRATION.md` - API integration

---

**Well organized. Easy to navigate. Ready to ship.**
