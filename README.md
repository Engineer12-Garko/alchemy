Synapse Academic Studio
Synapse Academic Studio is an adaptive learning platform that integrates deterministic cognitive science engines—including Spaced Repetition (FSRS-4.5) and Bayesian Knowledge Tracing (BKT)—with document intelligence and LLM-assisted Socratic tutoring to optimize student mastery and retention.

Architecture Overview
The system is split into two complementary backend domains and a React frontend:

Developer 1 Domain (Deterministic Core & State Modeling):

Authentication & Profile: JWT issuance, bcrypt hashing, and academic profile state management.

Spaced Repetition Scheduler: Free Spaced Repetition Scheduler (FSRS-4.5) powering memory stability, difficulty modeling, and due review intervals.

Learner Modeling: Bayesian Knowledge Tracing (BKT) tracking latent skill mastery and logging cognitive misconceptions.

Assessment & Step-Level Grading: Deterministic derivation evaluation weighting step accuracy and target solutions.

Planner & Progress Analytics: Calibrated daily study agendas, milestone tracking, and aggregate learning analytics.

Developer 2 Domain (Generative Intelligence & Ingestion):

Source Ingestion: Document parsing and syllabus processing.

Multimodal Scratchpad: Real-time visual and mathematical derivation assistance.

Socratic LLM Layer: Contextual prompting and guided tutoring interactions.

Diagnostic Assessment: Initial student calibration and placement.

Frontend:

Interactive UI built with React, Vite, and Tailwind CSS, communicating with the FastAPI backend via RESTful endpoints.

Tech Stack
Backend Framework: FastAPI (Python 3.10+)

Database & ORM: SQLAlchemy with SQLite (Local Development) / PostgreSQL (Production)

Authentication: PyJWT, Passlib (Bcrypt)

Validation: Pydantic v2, email-validator

Frontend: React, Vite, Tailwind CSS

API Server: Uvicorn (ASGI)


alchemy/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entry point & router mounting
│   │   ├── core/                    # Infrastructure configs
│   │   │   ├── database.py          # SQLAlchemy engine, SessionLocal, Base, get_db
│   │   │   └── security.py          # JWT creation/verification & password hashing
│   │   ├── shared/                  # Cross-module data contracts
│   │   │   └── review_event.py      # Standardized ReviewEvent Pydantic schema
│   │   ├── modules_dev1/            # Developer 1: Deterministic Engines
│   │   │   ├── auth/                # User authentication & profile management
│   │   │   ├── learner_model/       # Bayesian mastery tracking & misconception logs
│   │   │   ├── scheduler/           # FSRS-4.5 spaced repetition scheduler
│   │   │   ├── assessment/          # Step-derivation grading engine
│   │   │   ├── planner/             # Daily timetable & recommendation generation
│   │   │   └── progress/            # Aggregate dashboard analytics & KPIs
│   │   └── modules_dev2/            # Developer 2: Generative & Ingestion Layer
│   │       ├── diagnosis/           # Onboarding assessment logic
│   │       ├── llm_layer/           # Socratic LLM orchestration
│   │       ├── method_modules/      # Pedagogical delivery strategies
│   │       ├── method_router/       # Adaptive instructional routing
│   │       ├── multimodal/          # Canvas & visual input handlers
│   │       └── source_ingestion/    # Syllabus & textbook parsing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/              # Shared UI components
│   │   ├── features/                # Domain-specific pages (Dashboard, Practice, Progress)
│   │   ├── hooks/                   # Custom React hooks
│   │   └── services/                # API client integration
│   ├── package.json
│   └── vite.config.js
└── README.md
