FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
COPY .env.production .env

COPY wait-for-it.sh .

RUN npm run build

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]

RUN useradd -m node
USER node

