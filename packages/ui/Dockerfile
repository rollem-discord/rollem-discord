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
# - must be run from root dir ie `docker build -f Dockerfile --label='rollem-ui' -t rollem-ui ../..`
####################################################################################################

####################################################################################################
# Builds the 
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS workspace

# Tree is a useful inspection tool
RUN apk add --no-cache tree

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy yarn support files (see https://gist.github.com/vanxh/0c3a62cc6bd6b8aa143c2e278d9e9dfa)
COPY .yarn/ ./.yarn
COPY package.json .pnp.cjs .yarnrc.yml yarn.lock* ./

# Copy packages
COPY packages/ packages/

# Install packages
RUN corepack enable
RUN yarn set version berry
RUN yarn --version
RUN yarn install --immutable

# Build everything (packages/* will over-build some stuff
RUN yarn build

# TODO for standalone UI build?
# # Manually copy standalone files
# # See https://www.reddit.com/r/nextjs/comments/18t6ltd/404s_for_public_and_static_content_in_standalone/
# # See https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files
# COPY --from=workspace /app/packages/ui/public /app/packages/ui/.next/standalone/packages/ui/public
# COPY --from=workspace /app/packages/ui/styles /app/packages/ui/.next/standalone/packages/ui/styles
# COPY --from=workspace /app/packages/ui/public /app/packages/ui/.next/standalone/packages/ui/public
# COPY --from=workspace /app/packages/ui/styles /app/packages/ui/.next/standalone/packages/ui/styles

####################################################################################################
# Builds the Rollem UI minimal runner
FROM base AS rollem-ui
WORKDIR /app

RUN corepack enable
RUN yarn set version berry

# Copying core yarn files
COPY --from=workspace /app/.yarn ./.yarn
COPY --from=workspace /app/package.json /app/.pnp.cjs /app/.yarnrc.yml /app/yarn.lock* ./

# Copying package dependencies
COPY --from=workspace /app/packages/ui /app/packages/ui
COPY --from=workspace /app/packages/common /app/packages/common
COPY --from=workspace /app/packages/language /app/packages/language

# Focused install of dependencies
RUN yarn workspaces focus @rollem/ui

# Env setup
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Execute within directory
WORKDIR /app/packages/ui
CMD yarn start