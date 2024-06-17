# ---BASE
FROM node:18-alpine AS base

ENV COMMON_RATE_LIMIT_MAX_REQUESTS="1000"
ENV COMMON_RATE_LIMIT_WINDOW_MS="20"
ENV CORS_ORIGIN="*"
ENV HOST="localhost"
ENV PORT="4000"
ENV NODE_ENV="development"
# ENV FIREBASE_CLIENT_EMAIL="xxx"
# ENV FIREBASE_PROJECT_ID="xxx"
# ENV FIREBASE_SERVICE_PRIVATE_KEY="xxx"

RUN corepack enable pnpm
RUN apk add g++ make py3-pip
ENV PNPM_HOME="/root/.local/share/pnpm"

RUN SHELL=bash pnpm setup
RUN source /root/.bashrc
RUN pnpm config set store-dir /root/.local/share/pnpm/store
ENV PATH="$PATH:$PNPM_HOME/bin"

# ---BUILDER
FROM base AS builder
COPY . /app
WORKDIR /app
RUN npm install -g turbo
RUN turbo prune --scope=lams-api --docker

# ---INSTALLER
FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/apps/lottie-api/scripts ./apps/lottie-api/scripts
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> .npmrc \
    && echo "@pawerful-awds:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "auto-install-peers = true" >> .npmrc \
    && echo "node-linker=hoisted" >> .npmrc
RUN pnpm install
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=lams-api...

# ---RUNNER
FROM base AS runner
WORKDIR /app
# Don't run production as root
RUN addgroup --system --gid 1001 lams
RUN adduser --system --uid 1001 dev
USER dev

COPY --from=installer --chown=dev:lams /app/node_modules ./node_modules
COPY --from=installer --chown=dev:lams /app/apps/lottie-api/package.json ./package.json
COPY --from=installer --chown=dev:lams /app/apps/lottie-api/dist .

EXPOSE 4000

CMD ["node", "index"]
