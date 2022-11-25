FROM node:16.9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .
RUN yarn install
RUN yarn run tsc --version
RUN yarn build:dockerfile
EXPOSE 8080

CMD ["/bin/bash", "-c", "yarn run start-for-dockerfile"]