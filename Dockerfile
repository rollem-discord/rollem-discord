FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ONBUILD
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . /usr/src/app
RUN yarn install
RUN yarn build

CMD [ "yarn", "start-for-dockerfile" ]