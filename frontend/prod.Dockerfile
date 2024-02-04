FROM node:alpine as builder
WORKDIR /usr/src/app

COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build

FROM nginx
EXPOSE ${CLIENT_PORT}
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html