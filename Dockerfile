FROM node:20-bullseye AS builder

WORKDIR /app

# Копируем package.json и prisma schema (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Устанавливаем зависимости (prisma generate выполнится в postinstall)
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# ===========================
# Production-образ
# ===========================
FROM node:20-bullseye AS runner

WORKDIR /app

# Устанавливаем OpenSSL 1.1 для Prisma (Debian Bullseye имеет libssl1.1)
RUN apt-get update && \
    apt-get install -y openssl libssl1.1 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000

# Копируем package.json и prisma schema (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Устанавливаем только production-зависимости (prisma generate выполнится в postinstall)
RUN npm ci --omit=dev

# Копируем собранное приложение
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

# Next.js сам читает PORT из окружения
CMD ["npm", "start"]

