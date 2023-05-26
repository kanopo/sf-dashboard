# FROM node:18.14.0
FROM --platform=linux/amd64 node:18.14.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

EXPOSE 3000

RUN npm run build

CMD [ "npm", "run", "start" ]
