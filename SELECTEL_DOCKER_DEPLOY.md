# 🚀 Деплой SELS на Selectel Cloud с Docker (Supabase как БД)

Этот файл — пошаговая инструкция, как поднять твой текущий проект на российском сервере Selectel с Docker, при этом база остаётся в Supabase.

---

## 1. Что уже готово в репозитории

- `Dockerfile` — сборка и продакшн-образ Next.js.
- `docker-compose.yml` — сервис `web`, который:
  - билдит образ из текущего репозитория,
  - читает переменные окружения из `.env.production`,
  - слушает порт `3000`.
- `env.production.example` — пример нужных переменных окружения.
- `.dockerignore` — чтобы образ не раздувался лишними файлами.

---

## 2. Подготовь `.env.production` локально (или сразу на сервере)

Создай файл `.env.production` рядом с `docker-compose.yml`:

```bash
cd /Users/petr/sels
cp env.production.example .env.production
```

Открой `.env.production` и заполни:

- `DATABASE_URL=` — возьми из Supabase:
  - Supabase Dashboard → Settings → Database → Connection string → URI
  - Пример:
    ```txt
    postgresql://postgres:Пароль@db.dkikrvlaqencbgjlvqpx.supabase.co:5432/postgres
    ```
- `NODE_ENV=production`
- `NEXT_PUBLIC_ENV=production`

**Этот файл не коммить!** (он уже в `.gitignore` через `.env*`).

---

## 3. Подготовь сервер в Selectel Cloud

1. В панели Selectel:
   - Создай виртуальный сервер (Ubuntu 22.04, 2–4 GB RAM).
   - Назначь публичный IP.
2. Зайди по SSH:

```bash
ssh root@IP_СЕРВЕРА
```

---

## 4. Установи Docker и docker compose на сервере

На сервере (Ubuntu):

```bash
apt update
apt install -y docker.io docker-compose-plugin
systemctl enable docker --now
```

Проверь:

```bash
docker --version
docker compose version
```

---

## 5. Склонируй проект с GitHub на сервер

На сервере:

```bash
cd /root
git clone https://github.com/petr-tartyshev/mysels.git sels
cd sels
```

Затем создай `.env.production` **уже на сервере**:

```bash
cp env.production.example .env.production
nano .env.production
```

Вставь актуальный `DATABASE_URL` из Supabase.

---

## 6. Собери и запусти контейнер

На сервере в папке `sels`:

```bash
docker compose build
docker compose up -d
```

Проверь, что контейнер запущен:

```bash
docker ps
```

Проверь, что приложение отвечает:

```bash
curl http://localhost:3000
```

Если видишь HTML страницы — всё ок.

---

## 7. Настрой Nginx + HTTPS (mysels.ru → Docker)

### Установи Nginx и certbot

```bash
apt install -y nginx
apt install -y certbot python3-certbot-nginx
```

### Создай конфиг Nginx

```bash
nano /etc/nginx/sites-available/mysels.ru
```

Вставь:

```nginx
server {
    listen 80;
    server_name mysels.ru www.mysels.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируй сайт и перезапусти Nginx:

```bash
ln -s /etc/nginx/sites-available/mysels.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Выпусти HTTPS-сертификаты

```bash
certbot --nginx -d mysels.ru -d www.mysels.ru
```

Выбери автоматический редирект HTTP → HTTPS.

---

## 8. Настрой DNS на REG.RU

В панели REG.RU для домена `mysels.ru`:

- **A-запись**:
  - Имя: `@`
  - Тип: `A`
  - Значение: IP твоего сервера Selectel.
- **www**:
  - Либо A-запись на тот же IP,
  - Либо CNAME → `mysels.ru`.

Подожди 5–30 минут для обновления DNS.

Проверь:

```bash
nslookup mysels.ru
nslookup www.mysels.ru
```

Должен вернуться IP сервера.

---

## 9. Как обновлять приложение (деплой новых версий)

На сервере:

```bash
cd /root/sels
git pull
docker compose build
docker compose up -d
```

Это:
- подтянет новые коммиты,
- пересоберёт образ,
- перезапустит контейнер без потери данных (БД в Supabase).

---

## 10. Если что-то идёт не так

- Посмотреть логи контейнера:

```bash
docker logs -f sels_web
```

- Проверить статус Nginx:

```bash
systemctl status nginx
```

- Проверить, что порт 3000 слушается:

```bash
ss -tulpn | grep 3000
```

Если будет какая-то конкретная ошибка на любом шаге — скопируй текст/скрин, и я помогу её разобрать.

