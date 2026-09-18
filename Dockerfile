# syntax=docker/dockerfile:1
FROM node:22-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npx next telemetry disable
RUN npm run build

# ---- production ----
FROM node:22-slim
USER node
WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
EXPOSE 3000
CMD ["./node_modules/.bin/next", "start"]
