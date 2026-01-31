# 🔧 Исправление Dockerfile на сервере вручную

Я не могу напрямую выполнить команды на сервере через SSH (команды не возвращают вывод).

## Выполни на сервере:

### Вариант 1: Скопировать исправленный Dockerfile

На Mac:

```bash
cd /Users/petr/sels
scp Dockerfile root@45.130.8.3:/root/sels/Dockerfile
```

На сервере:

```bash
cd /root/sels
docker compose build
docker compose up -d
docker ps
```

---

### Вариант 2: Исправить вручную через nano

На сервере:

```bash
cd /root/sels
nano Dockerfile
```

Найди строки (примерно 5-10):

```dockerfile
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json* ./
RUN npm ci
```

Замени на:

```dockerfile
WORKDIR /app

# Копируем package.json и prisma schema (нужен для postinstall)
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Устанавливаем зависимости (prisma generate выполнится в postinstall)
RUN npm ci
```

Сохрани: `Ctrl+O`, Enter, `Ctrl+X`

Затем:

```bash
docker compose build
docker compose up -d
docker ps
```

---

### Вариант 3: Использовать GitHub Actions

Я создал коммит, который должен запустить GitHub Actions. Проверь:

1. Открой: https://github.com/petr-tartyshev/mysels/actions
2. Должен быть новый запуск workflow
3. После завершения на сервере выполни:

```bash
cd /root/sels
git pull origin main
docker compose build
docker compose up -d
```

---

**Выполни один из вариантов и напиши, что получилось!**
