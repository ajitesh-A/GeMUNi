FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl ca-certificates libssl-dev && apt-get clean && rm -rf /var/lib/apt/lists/*
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && pnpm --version

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web
RUN npx prisma generate
RUN npx next build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
CMD npx prisma db push && node_modules/.bin/next start
