FROM node:18-alpine AS base

ARG ENVIRONMENT
ARG VITE_API_BASE_URL

ENV ENVIRONMENT=${ENVIRONMENT}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"

RUN npm install --global pnpm@v7

# ---BUILDER
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune --scope=lottie-app --docker

# ---INSTALLER
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ARG NPM_TOKEN=""
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" >> .npmrc \
    && echo "@pawerful-awds:registry=https://npm.pkg.github.com" >> .npmrc \
    && echo "auto-install-peers = true" >> .npmrc
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=lottie-app...

# ---RUNNER
FROM base AS runner
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 lams
RUN adduser --system --uid 1001 dev
USER dev

COPY --from=installer --chown=dev:lams /app/apps/lottie-app/package.json .
COPY --from=installer --chown=dev:lams /app/apps/lottie-app/dist ./dist

RUN pnpm add -g serve
EXPOSE 3000

# serve the app using Vite's static file server
CMD ["serve", "-s", "dist", "-l", "3000"]
