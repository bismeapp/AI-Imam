# AI Imam — Project Structure

## Frontend

- `client/index.html` — browser document, metadata, and Inter font loading.
- `client/src/pages/Home.tsx` — main AI Imam interface, text input, voice input, loading state, answer card, citations, and scholar guidance.
- `client/src/index.css` — Figma-matched cream, green, and gold visual system.
- `client/src/components/` — reusable UI components.
- `client/public/` — local Bisme Radio artwork, microphone icon, donation artwork, and the route manifest.

## Backend

- `server/_core/index.ts` — Express server entry point and static serving.
- `server/routers.ts` — tRPC procedures, including the AI Imam answer endpoint.
- `server/_core/` — authentication, AI service, storage, voice, and platform helpers.

## Data and shared code

- `drizzle/` — database schema and migrations.
- `shared/` — constants, shared types, and shared error definitions.

## Deployment and configuration

- `Dockerfile` — production container build and start command.
- `render.yaml` — Render Blueprint for a Docker web service.
- `RENDER_DEPLOY.md` — Render deployment instructions and environment setup.
- `package.json` and `pnpm-lock.yaml` — scripts and pinned dependencies.
- `app.config.ts` — project branding metadata.
- `plan.md` and `TODO.md` — implementation plan and completed outcomes.

The root layout is intentionally kept runnable: Render can deploy directly from the ZIP after extracting it and connecting the repository, without moving frontend or backend folders.
