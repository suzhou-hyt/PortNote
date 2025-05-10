# Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY ./prisma ./prisma

# Install dependencies and generate Prisma client
RUN npm install && npx prisma generate

COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js* ./

# Prune dev dependencies
RUN npm prune --production

EXPOSE 3000

# Run Prisma migration and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
