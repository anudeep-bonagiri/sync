# Sync AI

> An adaptive AI that unifies T-Mobile's data, sentiment, and network health to sense, predict, and repair issues in real-time.

![Sync AI](https://img.shields.io/badge/Sync-AI-E20074?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?logo=tailwind-css)

## 🚀 Quick Start

**Use the unified app in `Sync-1/frontend/`:**

```bash
cd Sync-1/frontend
npm install
npm run dev
```

Then open: **http://localhost:3000**

- **Landing Page**: `http://localhost:3000/`
- **Dashboard**: `http://localhost:3000/dashboard`

> ⚠️ **Note**: The root `src/` folder is an old landing page. Use `Sync-1/frontend/` instead - it has everything unified with routing!

## 🎯 Overview

Sync AI is a self-healing network intelligence system that monitors live data streams, detects anomalies, predicts issues, and autonomously repairs network problems through GPU-accelerated simulation. Built for HackUTD 2025, Sync combines NVIDIA's multi-agent reasoning with real-time network monitoring to create a breakthrough in autonomous network management.

## ✨ Features

- **Real-time Monitoring** - Live network health and customer sentiment tracking
- **Anomaly Detection** - AI-powered detection of network issues before they impact users
- **Predictive Repair** - Simulation-driven repair planning with GPU acceleration
- **Autonomous Healing** - Self-healing network that fixes issues without human intervention
- **Interactive Dashboard** - Beautiful, responsive interface with real-time visualizations
- **Multi-Agent System** - Coordinated AI agents for sentiment analysis, technical detection, and simulation
- **Agentic RAG System** - Intelligent context retrieval from knowledge store
- **ReAct Workflows** - Reasoning and Acting loops for complex problem solving

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Lucide React** - Icons

### Backend/AI
- **Node.js + Express** - API server
- **TypeScript** - Type safety
- **Google Gemini** - LLM provider (with NVIDIA NIM support)
- **Agentic RAG** - Intelligent knowledge retrieval
- **ReAct Framework** - Reasoning and Acting workflows
- **Multi-Agent System** - 8 specialized AI agents

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Gemini API Key** (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anudeep-bonagiri/sync.git
cd sync
```

2. **Install Frontend Dependencies**
```bash
cd Sync-1/frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Backend**

Create `Sync-1/backend/.env`:
```bash
cd Sync-1/backend
cp .env.example .env  # If .env.example exists, or create manually
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
LLM_PROVIDER=gemini
PORT=3001
NODE_ENV=development
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd Sync-1/backend
npm run dev
```

Backend runs on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd Sync-1/frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

### Build for Production

**Frontend:**
```bash
cd Sync-1/frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd Sync-1/backend
npm run build
npm start
```

## 📁 Project Structure

```
sync/
├── Sync-1/                          # Main application directory
│   ├── frontend/                    # React dashboard (Port 3000)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── landing/        # Landing page components
│   │   │   │   │   ├── Hero.tsx
│   │   │   │   │   ├── ConceptSection.tsx
│   │   │   │   │   ├── Dashboard.tsx
│   │   │   │   │   ├── WhySection.tsx
│   │   │   │   │   ├── DemoFlow.tsx
│   │   │   │   │   ├── TechStack.tsx
│   │   │   │   │   ├── CompetitiveAdvantage.tsx
│   │   │   │   │   ├── Team.tsx
│   │   │   │   │   └── Footer.tsx
│   │   │   │   ├── DashboardPage.tsx      # Main dashboard
│   │   │   │   ├── AISimulation.tsx       # Agent progress tracker
│   │   │   │   ├── NetworkMap.tsx          # Interactive network map
│   │   │   │   ├── LiveCustomerVoice.tsx  # Customer sentiment
│   │   │   │   ├── ChurnLoyaltyBarChart.tsx # Analytics charts
│   │   │   │   ├── HistoricalPerformanceChart.tsx
│   │   │   │   ├── RepairRecommendations.tsx
│   │   │   │   └── ...                    # Other components
│   │   │   ├── hooks/
│   │   │   │   ├── useMockData.ts          # State management
│   │   │   │   └── useScrollAnimation.ts
│   │   │   ├── services/
│   │   │   │   └── apiClient.ts            # Backend API client
│   │   │   ├── App.tsx                     # Root component with routing
│   │   │   ├── index.tsx                   # Entry point
│   │   │   ├── index.css                   # Global styles
│   │   │   └── types.ts                    # TypeScript types
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   ├── backend/                     # Express API server (Port 3001)
│   │   ├── src/
│   │   │   ├── agents/              # 8 AI agents
│   │   │   │   ├── BaseAgent.ts
│   │   │   │   ├── NetworkAnalysisAgent.ts    # Real LLM
│   │   │   │   ├── SentimentAgent.ts          # Real LLM
│   │   │   │   ├── CustomerAnalyticsAgent.ts  # LLM + RAG
│   │   │   │   ├── SelfHealingAgent.ts
│   │   │   │   ├── ResearchAgent.ts
│   │   │   │   ├── OutlineAgent.ts
│   │   │   │   ├── WriterAgent.ts
│   │   │   │   └── EditorAgent.ts
│   │   │   ├── llm/                 # LLM abstraction layer
│   │   │   │   ├── llmClient.ts
│   │   │   │   ├── geminiProvider.ts
│   │   │   │   ├── nvidiaProvider.ts
│   │   │   │   └── nemotronProvider.ts
│   │   │   ├── rag/                 # RAG system
│   │   │   │   ├── docs/            # Knowledge documents
│   │   │   │   │   ├── network_outage_patterns.txt
│   │   │   │   │   ├── customer_sentiment_logs.txt
│   │   │   │   │   ├── device_telemetry.txt
│   │   │   │   │   └── repair_outcomes.txt
│   │   │   │   ├── data/            # JSON data files
│   │   │   │   ├── ragSystem.ts
│   │   │   │   └── embeddings.ts
│   │   │   ├── workflows/
│   │   │   │   └── reactWorkflow.ts # ReAct orchestrator
│   │   │   ├── routes/              # API routes
│   │   │   │   ├── analyzeRoutes.ts
│   │   │   │   ├── analyticsRoutes.ts
│   │   │   │   ├── ragRoutes.ts
│   │   │   │   ├── selfHealRoutes.ts
│   │   │   │   ├── regionRoutes.ts
│   │   │   │   └── externalRoutes.ts
│   │   │   ├── services/
│   │   │   │   ├── twitterService.ts
│   │   │   │   └── youtubeService.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── server.ts            # Express server
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── README.md                # Backend setup guide
│   │   └── ARCHITECTURE.md          # Architecture docs
│   │
│   ├── database/                    # Database schemas
│   │   ├── schema.sql
│   │   └── seed.sql
│   │
│   ├── "Sync Landing Page"/         # Standalone landing page
│   │   └── ...                      # Landing page components
│   │
│   ├── README.md                     # Sync-1 documentation
│   ├── STRUCTURE.md                  # Detailed structure guide
│   ├── QUICKSTART.md                 # Quick start guide
│   └── BACKEND_INTEGRATION.md        # Integration guide
│
├── src/                             # ⚠️ Old landing page (deprecated)
│   └── ...                          # Use Sync-1/frontend instead
│
├── README.md                         # This file
├── START_HERE.md                     # Quick start guide
├── package.json                     # Root package.json
└── .gitignore
```

## 🎨 Design Features

- **Dark Theme** - Modern dark UI with pink/purple accents
- **Smooth Animations** - Scroll-triggered fade-ins and transitions
- **Responsive Design** - Works seamlessly on all devices
- **Interactive Elements** - Hover effects and animated visualizations
- **Performance Optimized** - GPU-accelerated animations and efficient rendering

## 🔗 API Endpoints

### Network Analysis
```bash
POST http://localhost:3001/api/analyze/network
{
  "network_id": "us-east-1",
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

### RAG Context
```bash
POST http://localhost:3001/api/rag/context
{
  "query": "network outage patterns",
  "topK": 3
}
```

See `Sync-1/backend/README.md` for complete API documentation.

## 🏗️ Architecture

### Multi-Agent System

**Real LLM Agents:**
- **NetworkAnalysisAgent** - Dynamic network health analysis using Gemini
- **SentimentAgent** - Customer sentiment scoring (0-100)
- **CustomerAnalyticsAgent** - Combines RAG + LLM for insights

**Simulated Agents:**
- **SelfHealingAgent** - Automated remediation strategies
- **ResearchAgent, OutlineAgent, WriterAgent, EditorAgent** - Content pipeline

### Agentic RAG System

- **Intelligent Retrieval** - Automatically decides when context is needed
- **Knowledge Store** - Historical patterns, customer feedback, device metrics
- **BM25-like Scoring** - Relevance-based document retrieval

### ReAct Workflows

**Reasoning → Acting Pattern:**
```
Query: "Analyze network and customer feedback"

Step 1: Thought → Action → Observation
  "Need network analysis" → NetworkAnalysisAgent → "Found issues"

Step 2: Thought → Action → Observation
  "Need customer insights" → CustomerAnalyticsAgent → "Got insights"

Result: Complete multi-agent analysis
```

## 📚 Documentation

- **Quick Start**: `START_HERE.md`
- **Backend Setup**: `Sync-1/backend/README.md`
- **Architecture**: `Sync-1/backend/ARCHITECTURE.md`
- **Structure Guide**: `Sync-1/STRUCTURE.md`
- **Integration**: `Sync-1/BACKEND_INTEGRATION.md`

## 🔗 Links

- **Live Demo**: [Watch on YouTube](https://www.youtube.com/watch?v=hfMk-kjRv4c)
- **Devpost**: [View Project](https://devpost.com/software/sync-ai-gltbhz?ref_content=user-portfolio&ref_feature=in_progress)
- **Hackathon**: HackUTD 2025: Lost in the Pages

## 🏆 Accomplishments

- Built an agentic system that doesn't just analyze but acts
- Created a simulation-driven self-healing network concept
- Achieved full visibility into customer and system experience simultaneously
- Integrated multiple real-time data streams into a unified dashboard
- Implemented multi-agent AI with RAG and ReAct workflows

## 🐛 Troubleshooting

### Backend won't start
- Check that `.env` file exists with `GEMINI_API_KEY`
- Verify port 3001 is not in use: `lsof -ti:3001`
- Ensure dependencies are installed: `cd Sync-1/backend && npm install`

### Frontend can't reach backend
- Ensure backend is running on `http://localhost:3001`
- Check CORS is enabled (enabled by default in development)
- Verify API URL in `Sync-1/frontend/src/services/apiClient.ts`

### RAG not working
- Verify documents exist: `ls Sync-1/backend/src/rag/docs/*.txt`
- Restart backend after adding new documents

## 📝 License

This project was created for HackUTD 2025. All rights reserved.

## 👥 Team

- **Anudeep Bonagiri**
- **Cayden Hutcheson**

---

Made with ❤️ at HackUTD 2025
