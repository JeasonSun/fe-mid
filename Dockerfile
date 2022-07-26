FROM node:lts
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app/

ARG PORT=8081

EXPOSE ${PORT}

CMD ["yarn", "start:prod"]