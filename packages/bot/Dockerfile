FROM node:18-alpine

# https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL "org.opencontainers.image.title"="Rollem Discord Bot"
LABEL "org.opencontainers.image.ref.name"="rollem/bot"
LABEL "org.opencontainers.image.url"="https://rollem.rocks"
LABEL "org.opencontainers.image.documentation"="https://github.com/rollem-discord/rollem-discord"
LABEL "org.opencontainers.image.source"="https://github.com/rollem-discord/rollem-discord"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY ./dist ./dist
COPY package.json package.json

EXPOSE 8080

CMD ["/bin/sh", "-c", "yarn run container:start"]