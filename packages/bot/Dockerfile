FROM node:14.5.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .
RUN yarn install
RUN yarn build:dockerfile

CMD ["/bin/bash", "-c", "yarn run start-for-dockerfile"]