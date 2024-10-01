####################################################################################################
# Source: https://nextjs.org/docs/pages/building-your-application/deploying#docker-image
# -> https://github.com/vercel/next.js/tree/v14.2.13/examples/with-docker
# -> https://github.com/vercel/next.js/blob/v14.2.13/examples/with-docker/Dockerfile
#
# Referenced:
# - https://docs.docker.com/build/concepts/context/#dockerignore-files
# - https://stackoverflow.com/questions/74456545/i-am-getting-error-while-converting-yarn-berry-nextjs-project-to-standalone
# - https://dev.to/siddharthvenkatesh/docker-setup-for-yarn-workspaces-4pnj
# - https://github.com/vercel/next.js/discussions/33567
# - https://xfor.medium.com/yarn-workspaces-and-docker-39e30402b69b
# - https://stackoverflow.com/questions/49754286/multiple-images-one-dockerfile

####################################################################################################
# Notes on running
# - must be run from root dir

####################################################################################################
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ADDED RUN apk add --no-cache tree
RUN apk add --no-cache tree
COPY package.json yarn.lock .yarnrc.yml .
COPY .yarn/ .yarn/
COPY packages/ packages/
RUN tree -aL 4 .

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock .pnp.* .yarnrc.* ./
RUN yarn set version berry
RUN yarn --version
RUN yarn install
RUN yarn build

# Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN \
#   if [ -f yarn.lock ]; then yarn run build; \
#   elif [ -f package-lock.json ]; then npm run build; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# # Set the correct permission for prerender cache
# RUN mkdir .next
# RUN chown nextjs:nodejs .next

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT 3000

# # server.js is created by next build from the standalone output
# # https://nextjs.org/docs/pages/api-reference/next-config-js/output
# CMD HOSTNAME="0.0.0.0" node server.js