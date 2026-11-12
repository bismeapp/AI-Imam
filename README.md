# AI Imam — Bisme Radio

## Folder layout

- `frontend/` contains the complete React frontend: pages, components, hooks, styles, browser entrypoint, public assets, and route manifest.
- `backend/` contains the Express server, tRPC procedures, AI answer route, authentication helpers, database schema, migrations, and shared types.
- `config/` contains package metadata, lockfile, TypeScript/Vite configuration, deployment settings, and patches.
- `docs/` contains the product README, implementation plan, completed TODO, Render deployment guide, and structure notes.
- `render.yaml` and `Dockerfile` are at the root for deployment reference.

The source is separated for review and handoff. The original runnable project uses the conventional `client/` and `server/` paths; the root ZIP from the previous delivery remains the direct Render deployment package.
