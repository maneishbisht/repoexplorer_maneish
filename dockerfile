FROM node:20-alpine AS builder
WORKDIR /app

# Declare the build argument (can be left blank or dummy for runtime injection)
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Dynamically writes the runtime config file from container env vars, then starts your app
CMD sh -c "echo \"window.env = { VITE_BASE_URL: '$VITE_BASE_URL' };\" > ./dist/env-config.js && npm start"