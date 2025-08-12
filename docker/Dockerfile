ARG NODE_VERSION=20.14.0-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN npm install -g pnpm

# Build stage
FROM base AS builder

# Copy package files and prisma schema first
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install

# install node-prune (https://github.com/tj/node-prune)
RUN apk add curl bash --no-cache && \
	curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

# Copy remaining source code
COPY . .

# Set database URL placeholder for Prisma client generation
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client
RUN pnpm run generate-types

# Build the application
RUN pnpm run build

# Production stage
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Create app directory and set ownership
RUN mkdir -p /app && chown -R node:node /app

# Switch to non-root user
USER node:node

# Copy package files
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Copy build artifacts and prisma schema
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/node_modules ./node_modules

EXPOSE $PORT
CMD ["node", "dist/src/main"]
