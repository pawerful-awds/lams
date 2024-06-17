FROM node:18-alpine AS base

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
RUN turbo prune --scope=lottie-api --docker

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
RUN pnpm turbo run build --filter=lottie-api...

# ---RUNNER
FROM base AS runner
WORKDIR /app
 
EXPOSE 3000

# Start the app
CMD pnpm run start
