FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY ./dist ./dist
COPY package.json package.json

EXPOSE 8080

CMD ["/bin/bash", "-c", "yarn run container:start"]