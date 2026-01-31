# 🌐 Настройка Nginx + домен mysels.ru

## Шаг 1: Установи Nginx и Certbot

На сервере:

```bash
apt update
apt install -y nginx certbot python3-certbot-nginx
```

---

## Шаг 2: Настрой Nginx

Создай конфигурацию:

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
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Сохрани: `Ctrl+O`, Enter, `Ctrl+X`

---

## Шаг 3: Включи сайт

```bash
ln -s /etc/nginx/sites-available/mysels.ru /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Шаг 4: Выпусти SSL сертификат

```bash
certbot --nginx -d mysels.ru -d www.mysels.ru
```

Следуй инструкциям:
- Email: введи свой email
- Согласись с условиями (A)
- Редирект HTTP → HTTPS: выбери 2 (Redirect)

---

## Шаг 5: Настрой DNS в REG.RU

1. Зайди в REG.RU → DNS управление
2. Для `mysels.ru`:
   - Тип: **A**
   - Значение: `45.130.8.3`
3. Для `www.mysels.ru`:
   - Тип: **A**
   - Значение: `45.130.8.3`

Подожди 5-30 минут для обновления DNS.

---

## Шаг 6: Проверь

После обновления DNS:

1. Открой `https://mysels.ru` в браузере
2. Должен открыться сайт с SSL сертификатом

---

**Выполни шаги 1-4 на сервере и напиши, что получилось!**
