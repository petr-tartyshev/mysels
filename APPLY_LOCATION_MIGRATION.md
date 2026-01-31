# Применение миграции для локаций

## Вариант 1: Через Supabase SQL Editor (рекомендуется)

1. Открой Supabase Dashboard → SQL Editor
2. Выполни следующий SQL:

```sql
-- Добавляем поля isPublic и userId в таблицу locations
ALTER TABLE "locations" 
  ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- Обновляем значение по умолчанию для type
ALTER TABLE "locations" 
  ALTER COLUMN "type" SET DEFAULT 'outdoor';

-- Добавляем внешний ключ (если еще нет)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'locations_userId_fkey'
  ) THEN
    ALTER TABLE "locations" 
    ADD CONSTRAINT "locations_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "users"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Добавляем индексы (если еще нет)
CREATE INDEX IF NOT EXISTS "locations_userId_idx" ON "locations"("userId");
CREATE INDEX IF NOT EXISTS "locations_isPublic_idx" ON "locations"("isPublic");
```

3. После выполнения SQL, пометь миграцию как примененную:

```bash
cd /root/sels
docker compose exec web npx prisma migrate resolve --applied 20260131000000_add_location_public_and_user
```

---

## Вариант 2: Использовать prisma db push (быстро, но не рекомендуется для production)

```bash
cd /root/sels
docker compose exec web npx prisma db push
```

Это синхронизирует схему Prisma с базой данных без использования миграций.

---

## Вариант 3: Baseline миграций (если нужно пометить все существующие миграции)

Если база данных уже содержит все таблицы, но Prisma не знает о примененных миграциях:

```bash
cd /root/sels
# Пометь все существующие миграции как примененные
docker compose exec web npx prisma migrate resolve --applied 20260121212220_init
docker compose exec web npx prisma migrate resolve --applied 20260122163516_add_images_to_events
docker compose exec web npx prisma migrate resolve --applied 20260122164521_make_description_optional
docker compose exec web npx prisma migrate resolve --applied 20260122170718_add_event_requests
docker compose exec web npx prisma migrate resolve --applied 20260123135819_add_level_to_events

# Затем примени новую миграцию
docker compose exec web npx prisma migrate deploy
```
