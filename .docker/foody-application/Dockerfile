# Stage 1: Base image & dependencies
FROM node:lts-alpine AS base
WORKDIR /home/node/code/foody-application
COPY code/foody-application/package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 \
 && npm config set fetch-retries 5 \
 && npm ci

# Stage 2: Development (Used by local docker-compose)
FROM base AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 3: Production (Used by Render)
FROM base AS production
ENV NODE_ENV=production
COPY code/foody-application/ ./
RUN npm run build
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]
