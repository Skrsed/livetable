FROM node:alpine as builder
WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i
COPY . .

CMD [ "npm", "run", "dev" ]