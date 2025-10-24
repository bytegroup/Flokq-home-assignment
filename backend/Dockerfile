# Backend Dockerfile (Node 22 + Prisma + TypeScript)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency and environment files
COPY package*.json ./
COPY prisma ./prisma/
COPY .env .env

# Install all dependencies
RUN npm ci

# Copy all project files
COPY . .

# Build the TypeScript project
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine

WORKDIR /app

# Copy only necessary files for production
COPY package*.json ./
COPY prisma ./prisma/
COPY .env .env

RUN npm ci --omit=dev
RUN npm install -g tsx

# Copy built files and Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

# Generate Prisma client, apply DB schema, seed, then start
CMD npx prisma generate && \
    until npx prisma db push; do echo "⏳ Waiting for DB..."; sleep 3; done && \
    npx prisma db seed && \
    npm start