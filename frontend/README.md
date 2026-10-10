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

Text, Markdown, CSV, and text-based PDF uploads are extracted by the backend. Image handwriting recognition uses the configured vision-capable chat model. For a deployed frontend, configure `VITE_API_URL` to the deployed API base URL in the frontend hosting environment, and configure the matching `FRONTEND_ORIGINS` and AI credentials on the backend.

For Vercel, set `VITE_API_URL` in **Project Settings → Environment Variables** to the public FastAPI backend URL ending in `/api` (for example, `https://your-backend.example.com/api`) for each deployment environment, then redeploy. This repository's Vercel configuration builds the static frontend only; it does not route `/api` requests to the FastAPI backend. If the variable is missing, the frontend reports the configuration problem instead of displaying Vercel's generic 404 page.

## Implemented API-backed workflows

- Account registration, login, profile preferences, course creation, and per-account data access.
- Diagnosis summaries, deterministic method selection, study-step attempt gating, and solution access after an attempt.
- Built-in quiz grading and provider-generated question grading, with learner-history and spaced-review updates.
- Study task creation, completion, and deletion; mastery summaries and review scheduling.
- Document upload and text extraction, source-grounded tutor questions, persisted tutor conversation history, image transcription, and microphone recording/transcription.
