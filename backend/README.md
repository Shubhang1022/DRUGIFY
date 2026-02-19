# PharmaGuard — Backend Reference Code

> **Important**: The files in this `backend/` directory are **reference code** for running the Python/FastAPI backend locally or deploying it externally. They do **not** execute within Lovable — Lovable only runs the React frontend.

## Local Development

```bash
# 1. Start everything with Docker Compose
docker-compose up --build

# 2. API available at http://localhost:8000
# 3. Frontend dev server at http://localhost:5173
# 4. PostgreSQL at localhost:5432
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── config.py            # Settings & env vars
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic v2 schemas
│   ├── database.py          # DB session management
│   ├── services/
│   │   ├── vcf_parser.py    # VCF v4.2 parser
│   │   └── pgx_engine.py    # CPIC-style analysis engine
│   └── routers/
│       └── analysis.py      # API endpoints
├── alembic/                  # DB migrations
├── requirements.txt
├── Dockerfile
└── tests/
```

## Render Deployment (Backend)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `CORS_ORIGINS` — your frontend URL

## Vercel Deployment (Frontend)

1. Import repo to [Vercel](https://vercel.com)
2. Framework: **Vite**
3. Set env var `VITE_API_URL` to your Render backend URL
4. Deploy
