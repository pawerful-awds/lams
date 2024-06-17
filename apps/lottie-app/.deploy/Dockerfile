# ---BASE
FROM node:18-alpine AS base

ENV VITE_API_BASE_URL="https://dev-api.lams.appwwwards.com"

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
RUN turbo prune --scope=lottie-app --docker

# ---INSTALLER
FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> .npmrc \
    && echo "@pawerful-awds:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "auto-install-peers = true" >> .npmrc \
    && echo "node-linker=hoisted" >> .npmrc
RUN pnpm install
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=lottie-app...

# ---RUNNER
FROM base AS runner
WORKDIR /app
RUN npm install -g serve
# Don't run production as root
RUN addgroup --system --gid 1001 lams
RUN adduser --system --uid 1001 dev
USER dev

COPY --from=installer --chown=dev:lams /app/node_modules ./node_modules
COPY --from=installer --chown=dev:lams /app/apps/lottie-app/package.json ./package.json
COPY --from=installer --chown=dev:lams /app/apps/lottie-app/dist ./dist

CMD ["serve", "dist", "-l", "3000"]
