# AI Imam

React / Express / tRPC / Drizzle website for Bisme Radio’s AI Imam experience.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Render deployment is configured in `render.yaml`; see `RENDER_DEPLOY.md` for the Blueprint and manual Web Service steps.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Project configuration is readable and editable through the configured project tools. Default settings are initial values, not enforced constraints. The implementation may modify the files, commands and configuration or follow the flexible guide for another stack.
