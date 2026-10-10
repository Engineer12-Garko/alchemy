# Alchemy System Requirements

## 1. Purpose and scope

Alchemy is a learner-facing academic study application. It helps an individual learner organize courses and materials, assess understanding, practice with guided methods, ask an AI tutor questions, schedule study and review work, and track learning progress.

This document defines the expected behavior of the complete system and records implementation gaps found during a critical review. Requirements describe intended behavior; the audit section distinguishes those expectations from behavior verified in the current code.

## 2. Users and system boundary

### 2.1 Users

- **Learner:** creates and manages an account, studies course concepts, uploads personal study material, uses practice and planning tools, and reviews progress.
- **Operator/deployer:** configures the backend, database, frontend origin, and optional AI provider.
- **AI provider:** an externally configured OpenAI-compatible service used for tutor responses, generated questions, AI grading, worked solutions, image recognition, and audio transcription.

The current product is learner-facing. Teacher, administrator, organization, billing, and multi-tenant course-management workflows are not part of this scope unless separately approved.

### 2.2 System components

- React and TypeScript frontend, built and served as a web application.
- FastAPI backend exposing JSON and multipart HTTP endpoints.
- SQLAlchemy persistence, with SQLite suitable for local development and PostgreSQL available for deployment.
- Optional OpenAI-compatible API for AI-dependent workflows.

## 3. Functional requirements

### FR-01: Account access

1. A learner MUST be able to register with a valid email, password, and display name, and sign in with the registered credentials.
2. Passwords MUST be stored as password hashes, never as plaintext.
3. Successful registration and sign-in MUST issue an expiring bearer token.
4. Protected API operations MUST reject missing, invalid, expired, or unknown-account tokens.
5. A learner MUST be able to read and update their display name and learning preferences.
6. Sign-out or an invalid/expired session MUST clear the locally stored token and return the learner to the sign-in screen.
7. After trimming input, required names and labels MUST remain non-empty; whitespace-only values MUST be rejected.

### FR-02: Learner and course data isolation

1. A learner MUST be able to create and list their own courses.
2. Every learner-owned record MUST be scoped to the authenticated account on reads, writes, updates, and deletes.
3. A learner MUST NOT be able to use another learner's course, material, study session, task, conversation, or learning history by changing an identifier.
4. Unique course codes MUST be enforced per learner, without preventing different learners from using the same code.

### FR-03: Diagnosis and placement

1. The learner MUST be able to complete a placement activity and save each answer against the relevant concept and optional course.
2. The system MUST calculate a placement result from the submitted answers and make the resulting learning history available to diagnosis and progress views.
3. Diagnosis MUST summarize attempts, errors, and mastery per concept, with an explicit unassessed state when no scored activity exists.
4. Invalid or incomplete placement submissions MUST return a clear validation error and MUST NOT be partially persisted.

### FR-04: Study-method selection and guided modules

1. The system MUST select a supported study method using the learner's confidence, stated preference, and recent error context.
2. Each supported method MUST expose its ordered steps and indicate which steps are locked.
3. A learner MUST complete a step with a non-empty response before advancing to the next step.
4. The backend MUST enforce the step order and prerequisites; frontend-only locks are not sufficient.
5. A worked solution MUST remain unavailable until the required attempt steps are complete.
6. A study session and its completed steps MUST be scoped to the learner who created it.

### FR-05: Practice questions and grading

1. The learner MUST be able to load and answer a built-in practice question without AI-provider configuration.
2. The learner MUST be able to request a generated question when an AI provider is configured.
3. Grading MUST assess the learner's submitted answer and work against a trusted reference answer and explanation.
4. Trusted question content MUST be bound to a server-issued question identifier and MUST NOT be accepted as authoritative merely because the client submitted it.
5. The learner MUST receive a score and useful feedback; the system MUST persist the attempt and update the learner's progress and review schedule.
6. A generated question MUST be associated with its creator and must not be usable to forge another learner's progress.
7. A response that cannot be graded because of invalid provider output or provider failure MUST return an explicit error and MUST NOT create a successful-looking or fabricated grade.

### FR-06: Spaced review

1. A graded attempt MUST create or update a review item for the relevant concept.
2. A learner MUST be able to submit a review quality from 0 to 5.
3. The system MUST update the review interval, repetition count, ease factor, due date, and learning history consistently.
4. Review records MUST be scoped to the learner; their course association MUST be preserved when one is selected.
5. The progress view MUST distinguish review results from quiz and placement scores where their scales or meanings differ.

### FR-07: Study planner

1. A learner MUST be able to create, list, complete, and delete study tasks.
2. Tasks MUST support a title, optional description, due date/time, estimated duration, and optional course.
3. Date/time values MUST be persisted and displayed consistently across client time zones.
4. Task operations MUST be limited to the owning learner.

### FR-08: Study materials

1. A learner MUST be able to upload PDF, plain text, Markdown, and CSV materials within the configured upload-size limit.
2. The system MUST extract text from supported files and clearly reject unsupported, empty, malformed, or unreadable files with an appropriate client error.
3. A learner MUST be able to list and read only their own uploaded material.
4. Uploads MUST be validated by content as well as filename and declared MIME type where necessary; a client-provided content type alone MUST NOT establish that a file is safe or supported.
5. Image-only PDFs MUST receive a clear explanation that text extraction is unavailable and that OCR is required.

### FR-09: AI tutor and conversation history

1. When configured, the tutor MUST answer learner questions and persist both sides of each exchange.
2. The learner MUST be able to list and retrieve their own conversations.
3. A learner MUST be able to ground a tutor request in their own uploaded material.
4. Uploaded material and learner messages MUST be treated as untrusted content, not as instructions that can override the tutor's system policy.
5. Missing provider configuration, network failures, and invalid provider responses MUST be surfaced as actionable errors without saving a successful-looking answer.

### FR-10: Multimodal input

1. When a vision-capable provider is configured, the learner MUST be able to submit a supported image and receive a transcription of visible text or math.
2. When an audio-transcription provider is configured, the learner MUST be able to submit a supported recording and receive its transcription.
3. Both workflows MUST enforce the configured upload-size limit and reject unsupported or empty input clearly.
4. Provider errors MUST be explicit and MUST NOT be presented as successful transcriptions.

### FR-11: Progress and learner insights

1. The learner MUST be able to view saved activity, concept mastery, and reviews due.
2. Counts and labels MUST match the data represented: quiz attempts, placement answers, guided-module steps, and reviews MUST not be conflated.
3. Mastery MUST be calculated only from comparable scored events, with the score scale and included event types defined consistently.
4. A learner with no activity MUST see an empty state rather than a misleading zero-score assessment.

### FR-12: Frontend workflow and feedback

1. All supported features MUST be reachable through the authenticated application navigation.
2. The interface MUST show loading, empty, success, and failure states for network-backed workflows.
3. API failures MUST be visible and actionable; the interface MUST NOT silently substitute mock data for failed live requests.
4. Forms MUST provide required-field and range validation consistent with backend validation.
5. Core workflows MUST be usable with keyboard navigation and expose status and validation feedback to assistive technology.

## 4. Security, privacy, and operational requirements

### NFR-01: Authentication and authorization

- Protected routes and API operations MUST enforce authentication server-side.
- Every database query involving learner data MUST apply owner scoping.
- Tokens MUST expire, be validated on every protected request, and be removed client-side after an authentication failure.
- Production MUST use a private, high-entropy JWT secret and HTTPS.

### NFR-02: Input and file safety

- API inputs MUST be length- and range-bounded and normalized before persistence.
- Uploaded content MUST be size-limited, type-checked, and parsed with malformed-file errors converted to safe client responses.
- Provider credentials MUST remain server-side and MUST never be returned to the browser.
- Learner-provided text and uploaded material MUST be considered untrusted when sent to AI services.

### NFR-03: Data lifecycle and migrations

- Learner data MUST persist across application restarts.
- Database schema changes MUST be managed by versioned migrations; application startup MUST NOT rely on `create_all()` as a substitute for migrating an existing production database.
- Backups and restoration MUST be defined for production data.

### NFR-04: Reliability and observability

- Expected validation, authorization, provider, and parsing failures MUST return clear, appropriate HTTP errors.
- Failed operations MUST NOT leave partial learning events, review updates, or tasks.
- Production deployments MUST expose health checks and log operational failures without logging passwords, tokens, or provider credentials.

### NFR-05: Configuration and deployment

- Local development MUST work with documented commands and a local SQLite database.
- Production MUST configure a persistent supported database, frontend origins, secure JWT secret, and HTTPS.
- AI-dependent features MUST clearly document and validate the required provider URL, key, compatible model, and any separate transcription model.
- A release MUST include repeatable frontend build/lint checks and backend automated tests.

## 5. Acceptance criteria for core journeys

1. **Account journey:** register, sign out, sign in, update preferences, and verify that a whitespace-only name is rejected.
2. **Isolation journey:** create two learners and verify that each cannot read or modify the other's courses, materials, tasks, conversations, sessions, or progress.
3. **Practice journey:** load the built-in question with no AI credentials, verify its reference answer is not present in the response, submit a correct and an incorrect response, and verify persisted scores and feedback.
4. **Generated-question integrity journey:** generate a question, submit it for grading, then alter the client-supplied reference answer or question identifier; the backend must reject the alteration or grade against its own stored reference.
5. **Study-module journey:** attempt a locked step before its prerequisites and attempt to request the solution before completing the required attempt; both must be denied. Complete the steps in order and verify the solution becomes available only afterward.
6. **Review journey:** submit quality values at the valid boundaries and verify schedule updates; reject values outside 0–5.
7. **Planner journey:** create a task using a non-UTC browser timezone, reload it, and verify the displayed instant is unchanged; verify cross-account edits and deletes fail.
8. **Upload journey:** upload a supported text file and PDF; verify unsupported, oversized, empty, and malformed files return clear client errors rather than server errors.
9. **AI journey:** with valid provider configuration, verify tutor, generation, grading, solution, OCR, and transcription flows; with missing or failing configuration, verify explicit errors and no success-shaped records.
10. **Session journey:** expire a token, make an API request, and verify the token is cleared and the learner is returned to sign-in.

## 6. Critical review: implementation gaps and fixes

Quiz answer keys are now stored server-side and scoped to the authenticated owner. The sample and generated-question endpoints return only the opaque question ID, concept, and prompt; grading loads the reference answer from the owned server record. The quiz UI and grading-result shape remain unchanged.

The following remaining issues were confirmed by inspection of the backend and frontend source:

| Priority | Area | Current behavior | Required outcome |
|---|---|---|---|
| P1 | Modular assessment integrity | `/api/v1/assessment/submit` accepts the canonical answer and per-step correctness flags from the client, so a caller can fabricate assessment outcomes. | Grade against server-owned question data and evaluate submitted work server-side. |
| P1 | Study-step enforcement | The step endpoint checks that a step ID exists, but does not require earlier steps. Any valid step marks `has_attempt=True`, which unlocks the solution endpoint. | Enforce ordered prerequisites on the backend and unlock solutions only after the required attempt steps. |
| P2 | Session expiry UX | The route guard checks only whether a token exists in session storage. API 401 responses do not clear the token or redirect to sign-in. | Clear invalid/expired tokens and transition the frontend to sign-in when the API returns 401. |
| P2 | Schema upgrades | API import calls `Base.metadata.create_all()`. The backend has no configured migration revisions, so an existing database is not safely upgraded when models change. | Add and use versioned schema migrations before production schema changes. |
| P2 | Required text normalization | Several request models validate minimum string length before handlers strip whitespace. A whitespace-only display name or course label can therefore be stored as an empty string. | Normalize before validation or reject values that are empty after trimming. |
| P2 | Malformed document handling | The material upload handler translates UTF-8 decoding failures, but does not translate PDF parser failures into a client validation response. | Convert malformed/unreadable PDF parser errors to a documented 4xx response without persisting a material. |
| P2 | Tutor source trust | Uploaded material text is concatenated into the tutor's system-role content. Instructions embedded in a document therefore share the same message authority as the tutor policy. | Keep trusted policy separate and explicitly treat material as quoted, untrusted source data. |

## 7. Test and release requirements

- Add backend tests for all acceptance journeys above, especially quiz-answer integrity, step ordering, owner isolation, token expiry, and malformed uploads.
- Use an isolated temporary test database; tests MUST NOT modify the developer's or production database.
- Add frontend tests for auth-session transitions, quiz request shape, and visible API failure states.
- CI MUST run backend tests, frontend lint, and the production frontend build.
- A release MUST NOT be considered complete while a P1 issue in Section 6 remains open.

## 8. Existing setup notes

- The Python dependency manifest already exists at [`backend/requirements.txt`](./backend/requirements.txt).
- Backend settings and example environment values are in [`backend/.env.example`](./backend/.env.example).
- Frontend setup and AI-provider prerequisites are documented in [`frontend/README.md`](./frontend/README.md).
- AI-dependent features require valid provider configuration; the application currently returns explicit provider errors when configuration is missing rather than supplying mock responses.
