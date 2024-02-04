FROM node:alpine as builder
WORKDIR /app

COPY ./package.json ./
RUN npm i
COPY . .

EXPOSE ${CLIENT_PORT}

CMD [ "npm", "run", "dev" ]