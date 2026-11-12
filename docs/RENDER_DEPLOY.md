# Deploy AI Imam on Render

This project is ready to deploy as a Render Docker web service. The repository includes `render.yaml`, which configures the Dockerfile, free web-service plan, automatic deploys from the linked branch, and the `/api/health` health check.

## Recommended setup

1. Push the project repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose **New → Blueprint** and connect the repository.
3. Select the branch containing `render.yaml` and deploy the Blueprint.
4. In the service’s Environment page, provide the values for `MANUS_API_URL` and `MANUS_API_KEY`. Keep these values in Render’s secret environment settings; do not commit them to the repository.
5. Trigger a deploy after saving the environment values.

Render builds the image from the root `Dockerfile`. The image runs `node dist/index.js`, and the server listens on the `PORT` value supplied by Render. The health endpoint is `/api/health`.

## Manual Web Service option

If you prefer not to use a Blueprint, create a new Web Service from the repository, choose **Docker** as the runtime, leave the Dockerfile path as `./Dockerfile`, and set the health check path to `/api/health`. Add the same two AI-service environment variables in the Render dashboard.

## Local verification before deployment

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Official references: [Render Web Services](https://render.com/docs/web-services), [Docker on Render](https://render.com/docs/docker), [Render environment variables](https://render.com/docs/configure-environment-variables), and [Render Blueprints](https://render.com/docs/infrastructure-as-code).
