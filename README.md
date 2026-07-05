# GeMUNi.ai

**AI-powered, source-backed research for Model United Nations delegates.**

GeMUNi.ai automatically gathers information from hundreds of trusted websites, compiles it into concise research reports, cites every factual statement, and presents delegates with comprehensive briefing material for any MUN committee and agenda.

## Features

- **AI-Generated Research Reports** — Country-specific, committee-tailored reports
- **Source-Backed Summaries** — Every claim includes clickable citations
- **Multi-Step Research Flow** — Country → Committee → Agenda → Report
- **RAG Pipeline** — Retrieval-Augmented Generation with Chroma vector store
- **Dashboard** — Save, bookmark, and export reports
- **AI Chat** — Ask follow-up questions with RAG-powered responses
- **Markdown Export** — Download reports for position papers
- **Image Retrieval** — Relevant images with attribution
- **Trusted Sources** — UN, WHO, HRW, Amnesty International, and 50+ organizations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Next.js API Routes |
| AI Engine | FastAPI, LangChain, Chroma, Sentence-Transformers |
| Database | PostgreSQL (Prisma ORM) |
| Cache | Redis (Upstash) |
| LLM | OpenRouter (DeepSeek, Qwen, Llama — free models) |
| Hosting | Vercel (frontend) + Render (AI engine) |

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Python 3.11+
- Docker (for local Postgres + Redis)

### 1. Clone & Install

```bash
git clone <repo-url> gemuni-ai
cd gemuni-ai

# Install frontend dependencies
pnpm install

# Set up Python AI engine
cd services/ai-engine
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### 2. Start Local Dependencies

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379

### 3. Set Up Environment Variables

```bash
cp apps/web/.env.local.example apps/web/.env.local
cp services/ai-engine/.env.example services/ai-engine/.env
```

Edit `apps/web/.env.local`:
```
DATABASE_URL="postgresql://gemuni:gemuni_dev@localhost:5432/gemuni"
AUTH_SECRET="generate-a-random-secret-at-least-32-chars-long"
AI_ENGINE_URL=""  # Leave empty to use mock data
```

Edit `services/ai-engine/.env`:
```
OPENROUTER_API_KEY=""  # Sign up at https://openrouter.ai (free)
LLM_MODEL=deepseek/deepseek-chat
```

### 4. Set Up Database

```bash
cd apps/web
npx prisma generate
npx prisma db push
cd ../..
```

### 5. Run Development

```bash
# Terminal 1: Next.js frontend
pnpm --filter web dev

# Terminal 2: FastAPI AI engine
cd services/ai-engine
uvicorn src.main:app --reload --port 8000
```

Open http://localhost:3000

## Free Tier Setup

### Getting Free API Keys (No Credit Card Required)

1. **OpenRouter** (https://openrouter.ai) — Free LLM access
   - Sign up → Add billing (may require card verification even for free models, but no charges)
   - Generate API key
   - Free models: DeepSeek R1/V3, Qwen 2.5, Llama 3.x, Mistral
   - **Note:** Some OpenRouter accounts require adding a payment method even for free-tier models (typically a $0 authorization hold). Without billing configured, the AI engine falls back to informative mock content — the platform still works end-to-end with realistic sample data.

2. **Supabase** (https://supabase.com) — Free PostgreSQL + Auth
   - Sign up → Create project
   - Copy the database connection string

3. **Upstash** (https://upstash.com) — Free Redis
   - Sign up → Create Redis DB
   - Copy the REST URL and token

### Deployment

**Frontend (Vercel):**
```bash
pnpm --filter web build  # Verify build passes
# Then connect your GitHub repo to Vercel
```

**AI Engine (Render):**
1. Push to GitHub
2. In Render Dashboard → New Web Service → Connect repo
3. Set root directory to `services/ai-engine`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from `.env`

## Project Structure

```
gemuni-ai/
├── apps/
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # Pages & API routes
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities, auth, prisma
│       │   └── hooks/
│       ├── prisma/             # Database schema
│       └── ...
├── services/
│   └── ai-engine/              # FastAPI AI pipeline
│       ├── src/
│       │   ├── api/            # HTTP routes
│       │   ├── core/           # Pipeline, search, crawler
│       │   ├── rag/            # Vector store, embeddings
│       │   ├── llm/            # LLM router & providers
│       │   └── news/           # RSS feeds & scheduler
│       └── ...
├── packages/
│   └── shared/                 # Shared types & constants
├── docker-compose.yml          # Postgres + Redis
└── README.md
```

## Architecture

```
User → Next.js (Vercel)
         ├── Auth (NextAuth v5)
         ├── Research Form → API Route → FastAPI AI Engine
         ├── Report Display
         └── Dashboard

FastAPI AI Engine (Render)
         ├── RAG Pipeline
         │   ├── Web Crawler → Chroma Vector Store
         │   ├── Embeddings (Sentence-Transformers)
         │   └── LLM (OpenRouter)
         ├── RSS News Scheduler (every 1hr)
         └── Chat API

Database: PostgreSQL (Supabase)
Cache: Redis (Upstash)
```

## License

MIT
