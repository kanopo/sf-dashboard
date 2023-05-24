FROM --platform=linux/amd64 node:14.18.2-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

CMD [ "npm", "start" ]

