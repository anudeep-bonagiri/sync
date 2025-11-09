# Quick Start Guide

Get Sync running in 5 minutes.

## Prerequisites

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **Gemini API key** ([Get one free](https://makersuite.google.com/app/apikey))

## Installation

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Sync

# Install all dependencies
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:

```env
GEMINI_API_KEY=paste_your_actual_key_here
LLM_PROVIDER=gemini
PORT=3001
```

**Get API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste it in `.env`

### 3. Start Backend

```bash
# From backend directory
npm run dev
```

You should see:
```
🚀 Sync Backend running on http://localhost:3001
📡 Health check: http://localhost:3001/health
```

Keep this terminal running!

### 4. Start Frontend (New Terminal)

```bash
# From root directory
cd frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000/
```

Keep this terminal running too!

### 5. Open Dashboard

Open your browser to **http://localhost:3000**

You should see the Sync dashboard with:
- Network status metrics
- Customer voice analytics
- AI simulation tracker
- Performance charts

## Verify Everything Works

### Test Backend API

In a new terminal:

```bash
# Health check
curl http://localhost:3001/health

# Network analysis
curl -X POST http://localhost:3001/api/analyze/network \
  -H "Content-Type: application/json" \
  -d '{"includeRAG": true}'
```

You should see JSON responses.

### Test Frontend

In the browser at http://localhost:3000:

1. **Overview Tab**: See network status and customer feedback
2. **Live AI Analysis Tab**: Watch the AI simulation
3. **Performance Analytics Tab**: View historical charts

## That's It!

You now have:
- ✅ Frontend running on **http://localhost:3000**
- ✅ Backend running on **http://localhost:3001**
- ✅ All 8 agents ready
- ✅ RAG system loaded
- ✅ LLM integration working

## Next Steps

### Explore the API

Try different endpoints:

```bash
# Customer analytics
curl -X POST http://localhost:3001/api/analytics/top \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}'

# ReAct workflow
curl -X POST http://localhost:3001/api/analytics/react \
  -H "Content-Type: application/json" \
  -d '{"query": "analyze network and customer sentiment", "enableRAG": true}'

# Self-healing
curl -X POST http://localhost:3001/api/agents/self-heal \
  -H "Content-Type: application/json" \
  -d '{"useRAG": true}'
```

### Read the Docs

- **Main README**: `/README.md` - Project overview
- **Frontend Guide**: `/frontend/CLAUDE.md` - Component architecture
- **Backend Setup**: `/backend/README.md` - Detailed backend docs
- **Architecture**: `/backend/ARCHITECTURE.md` - System design
- **Integration**: `/BACKEND_INTEGRATION.md` - API integration
- **Structure**: `/STRUCTURE.md` - Project organization

### Customize

- **Add RAG documents**: Put `.txt` files in `backend/src/rag/docs/`
- **Modify UI**: Edit components in `frontend/src/components/`
- **Add agents**: Create new agents in `backend/src/agents/`
- **Add routes**: Create new routes in `backend/src/routes/`

## Troubleshooting

### "GEMINI_API_KEY environment variable is required"

Make sure `backend/.env` exists and has your key:

```bash
cat backend/.env | grep GEMINI_API_KEY
```

Should show: `GEMINI_API_KEY=your_key_here`

### "Port 3000 already in use"

Kill the process:

```bash
lsof -ti:3000 | xargs kill -9
```

Then restart frontend.

### "Port 3001 already in use"

Kill the process:

```bash
lsof -ti:3001 | xargs kill -9
```

Then restart backend.

### Frontend can't reach backend

1. Make sure backend is running on port 3001
2. Check backend terminal for errors
3. Verify CORS is enabled (it is by default)

### RAG not loading documents

```bash
ls backend/src/rag/docs/*.txt
```

Should show 4 files. If not, they may not have been created. Restart backend after adding documents.

## Development Tips

### Hot Reload

Both frontend and backend have auto-reload:
- **Frontend**: Edit any `.tsx` file → instant refresh
- **Backend**: Edit any `.ts` file → auto-restart

### Logs

Watch backend logs in the terminal for:
- API requests
- Agent execution
- LLM calls
- RAG retrievals

### Testing API

Use Postman, Insomnia, or curl to test API endpoints while developing.

## Production Deployment

### Build Both

```bash
# From root
npm run build
```

This creates:
- `frontend/dist/` - Static files for hosting
- `backend/dist/` - Compiled JavaScript for Node

### Deploy Frontend

Upload `frontend/dist/` to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static host

### Deploy Backend

Run `backend/dist/server.js` on:
- Railway
- Heroku
- AWS EC2
- Google Cloud Run
- Any Node.js host

Set environment variables in your hosting platform.

## Switching to NVIDIA NIM

When ready for production:

1. Get NVIDIA API key
2. Edit `backend/.env`:
```env
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=your_nvidia_key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
```
3. Restart backend

No code changes needed!

## Getting Help

- Check `/README.md` for detailed docs
- Read `/backend/ARCHITECTURE.md` for system design
- Review `/STRUCTURE.md` for file organization
- Look at code comments for implementation details

## Summary

You've successfully set up Sync! You have:

✅ Multi-agent AI system with 8 specialized agents
✅ Agentic RAG with 4 knowledge documents
✅ ReAct workflow orchestrator
✅ Real-time React dashboard
✅ Full API with Express
✅ Gemini LLM integration

**Now start building!** 🚀
