FROM node:22-bookworm-slim
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.18.0 --activate
COPY config/package.json config/pnpm-lock.yaml config/pnpm-workspace.yaml ./
COPY config/patches ./patches
RUN CI=1 pnpm install --frozen-lockfile
# Rebuild the conventional layout the build scripts expect
COPY config/ ./
COPY frontend ./client
COPY backend/server ./server
COPY backend/shared ./shared
COPY backend/drizzle ./drizzle
RUN pnpm build
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
