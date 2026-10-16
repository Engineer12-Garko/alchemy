# Alchemy Academic Studio

## Local development

1. Install the backend dependencies with `python -m pip install -r backend/requirements.txt`.
2. Copy `backend/.env.example` to `backend/.env`. Authentication is enabled by default; use a private `JWT_SECRET` for any deployment.
3. From `backend`, run `uvicorn app.main:app --reload`. The development database defaults to `alchemy_local.db`; it is separate from the legacy `synapse.db` file, which is left untouched.
4. Copy `frontend/.env.example` to `frontend/.env.local`. Set `VITE_API_URL` to the backend API base URL (for example, `http://127.0.0.1:8000/api`).
5. From `frontend`, run `npm install` and `npm run dev`.
6. Open `http://localhost:5173` and register or sign in.

For a shared prototype workspace, set both `AUTH_ENABLED=false` in the backend environment and `VITE_AUTH_ENABLED=false` in the frontend environment. In that mode, all visitors share one workspace and its data; do not use it for private or real user data.

Run `npm run build` in `frontend` to run the TypeScript project build and create the production bundle.

## AI and multimodal features

The tutor, generated questions, AI grading for generated questions, worked solutions, image OCR, and audio transcription require a configured AI provider. By default, `AI_PROVIDER=auto` selects OpenAI when `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `OPENAI_MODEL` are complete; otherwise it uses Gemini when `GEMINI_API_KEY` and `GEMINI_MODEL` are set. In auto mode, an OpenAI authentication rejection falls back to a configured Gemini provider. Set `AI_PROVIDER=gemini` or `AI_PROVIDER=openai` to select a provider explicitly and disable automatic provider selection. Set `OPENAI_TRANSCRIPTION_MODEL` when the OpenAI-compatible provider uses a separate model for `/audio/transcriptions`. The configured provider must support the API endpoints used by the backend. Missing or failed provider configuration is returned as an API error; the app does not substitute mock answers.

Text, Markdown, CSV, and text-based PDF uploads are extracted by the backend. Image handwriting recognition uses the configured vision-capable chat model.

## Deploy the full app to Vercel

Keep the Vercel project **Root Directory** set to the repository root. Vercel builds the React frontend and deploys the FastAPI application from `api/index.py` using its built-in Python runtime; `api/requirements.txt` provides the backend dependencies. The same Vercel domain serves the UI and `/api` endpoints.

Add these environment variables in **Vercel → Project Settings → Environment Variables** for Production (and Preview if needed):

- `APP_ENV=production`
- `DATABASE_URL` set to a persistent PostgreSQL connection URL using SQLAlchemy's `postgresql+psycopg://` scheme. SQLite on a serverless filesystem is not persistent and must not be used for real accounts.
- `AUTH_ENABLED=true`
- `JWT_SECRET` set to a private random value of at least 32 characters.
- `VITE_AUTH_ENABLED=true` for the frontend build.

For authenticated accounts, set `AUTH_ENABLED=true`, `VITE_AUTH_ENABLED=true`, and provide a private random `JWT_SECRET` of at least 32 characters.

For tutor, generated-question, AI grading, worked-solution, image OCR, and audio transcription features, also set `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `OPENAI_MODEL`; set `OPENAI_TRANSCRIPTION_MODEL` if the provider uses a different transcription model. Redeploy after adding or changing environment variables. The frontend calls the API on the same Vercel domain by default, so `VITE_API_URL` is not required for this deployment.

## Implemented API-backed workflows

- Account registration, login, profile preferences, course creation, and per-account data access.
- Diagnosis summaries, deterministic method selection, study-step attempt gating, and solution access after an attempt.
- Built-in quiz grading and provider-generated question grading, with learner-history and spaced-review updates.
- Study task creation, completion, and deletion; mastery summaries and review scheduling.
- Document upload and text extraction, source-grounded tutor questions, persisted tutor conversation history, image transcription, and microphone recording/transcription.
