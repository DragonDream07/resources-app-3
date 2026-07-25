# resources-app-3 — backend (express, generated scaffold)
FROM node:20.19.1-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

USER node

CMD ["node", "src/server.js"]
