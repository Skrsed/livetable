FROM node:alpine
WORKDIR /app
COPY ./package.json .
RUN npm i

RUN npm run build
COPY ./dist ./dist

# TODO: make it doublestage
CMD ["npm", "run", "start"]