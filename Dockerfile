FROM node:lts
COPY package.json yarn.lock ./

RUN yarn install

COPY . ./

RUN yarn build

RUN mkdir -p /app

WORKDIR /app

COPY . /app/

EXPOSE 8081

CMD ["yarn", "start:prod"]