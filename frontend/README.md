# Alchemy Academic Studio

## Local development

1. Install the backend dependencies with `python -m pip install -r backend/requirements.txt`.
2. Copy `backend/.env.example` to `backend/.env`. Set a private `JWT_SECRET` before deployment.
3. From `backend`, run `uvicorn app.main:app --reload`. The development database defaults to a local SQLite file.
4. Copy `frontend/.env.example` to `frontend/.env.local`. Set `VITE_API_URL` to the backend API base URL (for example, `http://127.0.0.1:8000/api`).
5. From `frontend`, run `npm install` and `npm run dev`.
6. Open `http://localhost:5173/auth`. Choose **Create an account** below the sign-in form, enter your name, email, and a password of at least 8 characters, then choose **Create account**. After registration, Alchemy signs you in automatically. On later visits, use the same email and password with **Sign in**.

Accounts are stored in the backend database. There is no pre-created demo account; create your own account first. If you already registered in this local database, sign in with those credentials.

Run `npm run build` in `frontend` to run the TypeScript project build and create the production bundle.

## AI and multimodal features

The tutor, generated questions, AI grading for generated questions, worked solutions, image OCR, and audio transcription require an OpenAI-compatible provider. Configure `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `OPENAI_MODEL` in the backend environment. Set `OPENAI_TRANSCRIPTION_MODEL` when the provider uses a separate model for `/audio/transcriptions`. The configured provider must support the API endpoints used by the backend. Missing or failed provider configuration is returned as an API error; the app does not substitute mock answers.

Text, Markdown, CSV, and text-based PDF uploads are extracted by the backend. Image handwriting recognition uses the configured vision-capable chat model.

## Deploy the full app to Vercel

Keep the Vercel project **Root Directory** set to the repository root. Vercel builds the React frontend and deploys the FastAPI application as a Python Function from the root `index.py`; the same Vercel domain serves both the UI and `/api` endpoints. The root `requirements.txt` installs the backend dependencies from `backend/requirements.txt`.

Before using account-backed features, add these environment variables in **Vercel → Project Settings → Environment Variables** for Production (and Preview if needed):

- `APP_ENV=production`
- `JWT_SECRET` set to a private random value of at least 32 characters.
- `DATABASE_URL` set to a persistent PostgreSQL connection URL using SQLAlchemy's `postgresql+psycopg://` scheme. SQLite on a serverless filesystem is not persistent and must not be used for real accounts.

For tutor, generated-question, AI grading, worked-solution, image OCR, and audio transcription features, also set `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `OPENAI_MODEL`; set `OPENAI_TRANSCRIPTION_MODEL` if the provider uses a different transcription model. Redeploy after adding or changing environment variables. The frontend calls the API on the same Vercel domain by default, so `VITE_API_URL` is not required for this deployment.

## Implemented API-backed workflows

- Account registration, login, profile preferences, course creation, and per-account data access.
- Diagnosis summaries, deterministic method selection, study-step attempt gating, and solution access after an attempt.
- Built-in quiz grading and provider-generated question grading, with learner-history and spaced-review updates.
- Study task creation, completion, and deletion; mastery summaries and review scheduling.
- Document upload and text extraction, source-grounded tutor questions, persisted tutor conversation history, image transcription, and microphone recording/transcription.
