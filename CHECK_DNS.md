# 🔍 Проверка DNS для www.mysels.ru

## Проблема

DNS записи настроены правильно в REG.RU, но `www.mysels.ru` всё ещё не резолвится.

## Решения

### 1. Очисти кеш DNS на Mac

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

### 2. Проверь DNS с разных серверов

```bash
# Google DNS
nslookup www.mysels.ru 8.8.8.8

# Cloudflare DNS
nslookup www.mysels.ru 1.1.1.1

# Yandex DNS
nslookup www.mysels.ru 77.88.8.8
```

### 3. Проверь через онлайн-сервисы

- https://dnschecker.org/#A/www.mysels.ru
- https://www.whatsmydns.net/#A/www.mysels.ru

### 4. Попробуй выпустить сертификат снова

Даже если локально DNS не видно, Let's Encrypt может видеть записи:

```bash
ssh root@45.130.8.3
certbot --nginx -d mysels.ru -d www.mysels.ru
```

### 5. Если всё ещё не работает

Попробуй временно использовать только `mysels.ru`:

```bash
certbot --nginx -d mysels.ru
```

Потом можно добавить `www.mysels.ru` позже.

---

**Выполни проверки и напиши, что получилось!**
