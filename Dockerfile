# Stage 1: Build the Next.js application
FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install

# Enable standalone output for a smaller production image
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 2: Run the Next.js application
FROM node:24-alpine AS runner

WORKDIR /app

# Create a non-root user for security
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 80

CMD ["node", "server.js"]
