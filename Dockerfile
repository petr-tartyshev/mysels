FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# ===========================
# Production-образ
# ===========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Устанавливаем только production-зависимости
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Копируем собранное приложение
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Next.js сам читает PORT из окружения
CMD ["npm", "start"]

