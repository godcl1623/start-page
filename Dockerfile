## Layer 1: Base image layer for dependencies
# base image
FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
# set working directory
WORKDIR /app
# app dependencies, install, caching
# COPY package.json yarn.lock* ./
# COPY .pnp.cjs ./.pnp.cjs
# COPY .yarnrc.yml ./.yarnrc.yml
# COPY .pnp.loader.mjs ./.pnp.loader.mjs
# COPY .yarn ./.yarn
COPY . .
RUN \
    if [ -f yarn.lock ]; then yarn install --immutable; \
    else echo "Lockfile not found." && exit 1; \
    fi

## Layer 2: Copy all files except in .dockerignore && build
# FROM node:alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/.yarn ./.yarn
# COPY . .
COPY .env.production .env.production
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

## Layer 3: Run server
# FROM node:alpine AS runner
# WORKDIR /app
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# COPY --from=deps /app/.pnp.cjs ./.pnp.cjs
# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY .next/static .next/standalone/.next/static
COPY public .next/standalone/public
# USER nextjs

EXPOSE 3000

CMD ["node", "-r", "./.pnp.cjs", ".next/standalone/server.js"]