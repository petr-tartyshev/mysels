# ⚡ Быстрый деплой mysels.ru

Краткая версия инструкции для тех, кто уже знаком с деплоем.

---

## 1. Создайте Production БД

**Supabase (рекомендую):**
1. https://supabase.com → New Project → `mysels-production`
2. Скопируйте `DATABASE_URL` из Settings → Database

**Или Neon:**
1. https://neon.tech → New Project → `mysels-production`
2. Скопируйте Connection String

---

## 2. Деплой на Vercel

1. https://vercel.com → Add Project → выберите репозиторий `petr-tartyshev/mysels`
2. Environment Variables:
   ```
   DATABASE_URL = [ваш DATABASE_URL]
   NODE_ENV = production
   NEXT_PUBLIC_ENV = production
   ```
3. Deploy

---

## 3. Примените миграции

```bash
export DATABASE_URL="[ваш DATABASE_URL]"
npx prisma migrate deploy
npx prisma db seed  # опционально
```

---

## 4. Подключите домен

1. Vercel → Project → Settings → Domains → добавьте `mysels.ru`
2. Скопируйте DNS-записи из Vercel
3. В панели регистратора домена добавьте DNS-записи:
   - `@` → A или CNAME (значение из Vercel)
   - `www` → CNAME (значение из Vercel)
4. Ждите 1-2 часа (обновление DNS)

---

## 5. Staging (опционально)

1. Создайте вторую БД: `mysels-staging`
2. В Vercel создайте второй проект из того же репозитория
3. Environment Variables:
   ```
   DATABASE_URL = [staging DATABASE_URL]
   NODE_ENV = production
   NEXT_PUBLIC_ENV = staging
   ```
4. Примените миграции к staging БД

---

## ✅ Готово!

Сайт будет доступен на `https://mysels.ru`

**Подробная инструкция:** см. `DEPLOY_MYSELS_RU.md`
