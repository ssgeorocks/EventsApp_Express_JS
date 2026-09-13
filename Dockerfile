# Dockerfile for Events application

FROM node:24-alpine AS deps
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY public ./public

USER node
EXPOSE 8080
CMD ["node", "src/app.js"]