# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install TypeScript globally in the builder stage
RUN npm install -g typescript

# Copy package files and prisma schema
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies including TypeScript
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npx tsc

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm install --only=production

# Generate Prisma Client for production
RUN npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "./dist/server.js"]
