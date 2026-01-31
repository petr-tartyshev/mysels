# 🔧 Исправление Dockerfile на сервере

Проблема: Dockerfile на сервере не обновился, поэтому `prisma/schema.prisma` не копируется до `npm ci`.

## Решение: Исправь Dockerfile на сервере вручную

### На сервере выполни:

```bash
cd /root/sels
nano Dockerfile
```

### Найди строки (примерно строки 5-10):

```dockerfile
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm ci
```

### Замени на:

```dockerfile
WORKDIR /app

# Копируем package.json и prisma schema (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Устанавливаем зависимости (prisma generate выполнится в postinstall)
RUN npm ci
```

### Сохрани:
- `Ctrl+O`, Enter
- `Ctrl+X`

### Затем пересобери:

```bash
docker compose build
docker compose up -d
docker ps
```

---

## Альтернатива: Обнови через git

Если изменения уже запушены в GitHub:

```bash
cd /root/sels
git pull origin main
docker compose build
docker compose up -d
```

---

**Выполни исправление и напиши, что получилось!**
