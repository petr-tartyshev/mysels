# 🔧 Финальное исправление Dockerfile

Проблема: В production stage (runner) `prisma` не копируется до `npm ci --omit=dev`.

## Решение: Скопируй исправленный Dockerfile на сервер

На Mac выполни:

```bash
cd /Users/petr/sels
scp Dockerfile root@45.130.8.3:/root/sels/Dockerfile
```

Затем на сервере пересобери БЕЗ кеша:

```bash
ssh root@45.130.8.3
cd /root/sels
docker compose build --no-cache
docker compose up -d
docker ps
```

---

## Или одной командой:

```bash
cd /Users/petr/sels
scp Dockerfile root@45.130.8.3:/root/sels/Dockerfile && ssh root@45.130.8.3 "cd /root/sels && docker compose build --no-cache && docker compose up -d && docker ps"
```

---

## Что должно быть в Dockerfile (строки 26-31):

```dockerfile
# Копируем package.json и prisma schema (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Устанавливаем только production-зависимости (prisma generate выполнится в postinstall)
RUN npm ci --omit=dev
```

**Важно:** `COPY prisma ./prisma` ДОЛЖЕН быть ДО `RUN npm ci --omit=dev`!

---

**Выполни команды и напиши, что получилось!**
