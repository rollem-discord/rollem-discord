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
# - https://docs.docker.com/build/building/multi-stage/
# - https://stackoverflow.com/questions/49754286/multiple-images-one-dockerfile
# - https://github.com/yarnpkg/berry/issues/1956
# - https://gitlab.com/Larry1123/yarn-contrib/-/tree/master/packages/plugin-production-install
# - https://ismayilkhayredinov.medium.com/orchestrating-and-dockerizing-a-monorepo-with-yarn-3-and-turborepo-e26241a285cb
# - https://github.com/vercel/next.js/issues/36386
# - https://depot.dev/docs/languages/node-pnpm-dockerfile
# - https://www.reddit.com/r/typescript/comments/1ainj58/pnpm_vs_yarn_v4/
# - https://gist.github.com/vanxh/0c3a62cc6bd6b8aa143c2e278d9e9dfa

####################################################################################################
# Notes on running
# - must be run from root dir

####################################################################################################
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS workspace

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

# TODO: Delete this -- aliasing so the rest of this file makes sense
FROM workspace AS deps
FROM workspace AS builder

####################################################################################################
## I think we can skip this Builder stage?
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

# # ###################################################################################################
# # # Production image, copy all the files and run next
# # FROM base AS runner
# # WORKDIR /app

# # ENV NODE_ENV production
# # # Uncomment the following line in case you want to disable telemetry during runtime.
# # # ENV NEXT_TELEMETRY_DISABLED 1

# # RUN addgroup --system --gid 1001 nodejs
# # RUN adduser --system --uid 1001 nextjs

# # ## Copy Language
# # COPY --from=builder /app/packages/language/package.json /app/packages/language/package.json
# # COPY --from=builder /app/packages/language/dist/ /app/packages/language/dist/

# # ## Copy Common
# # COPY --from=builder /app/packages/common/package.json /app/packages/common/package.json
# # COPY --from=builder /app/packages/common/dist/ /app/packages/common/dist/

# # ## Special nextjs
# # # Set the correct permission for prerender cache
# # RUN mkdir .next
# # RUN chown nextjs:nodejs .next
# # COPY --from=builder /app/packages/ui/package.json /app/packages/ui/package.json

# # # Automatically leverage output traces to reduce image size
# # # https://nextjs.org/docs/advanced-features/output-file-tracing
# # WORKDIR /app/packages/ui/
# # COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/.next/standalone /app/packages/ui/
# # COPY --from=builder --chown=nextjs:nodejs /app/packages/ui/.next/static /app/packages/ui/.next/static

# # ## Copy baseline
# # COPY package.json .
# # COPY yarn.lock .
# # COPY .pnp.* .
# # COPY .yarnrc* .
# # RUN yarn install --pure-lockfile --non-interactive --production

# # ARG CACHEBUST=1 
# # RUN echo "$CACHEBUST"
# # RUN tree -aL 4 .

# # USER nextjs

# # EXPOSE 3000

# # ENV PORT 3000

# # # server.js is created by next build from the standalone output
# # # https://nextjs.org/docs/pages/api-reference/next-config-js/output
# # CMD HOSTNAME="0.0.0.0" node server.js