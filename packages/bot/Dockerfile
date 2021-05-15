FROM node:15.8.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .
RUN yarn install
RUN yarn run tsc --version
RUN yarn build:dockerfile

CMD ["/bin/bash", "-c", "yarn run start-for-dockerfile"]