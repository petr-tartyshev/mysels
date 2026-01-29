# ⚡ Быстрое применение миграций

## 📋 Выполни эти команды в терминале:

```bash
# 1. Перейди в корень проекта
cd /Users/petr/sels

# 2. Установи DATABASE_URL (скопируй из Vercel или Supabase)
# Из Vercel: Settings → Environment Variables → DATABASE_URL → скопируй значение
# Или из Supabase: Settings → Database → Connection string → URI
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.dkikrvlaqencbgjlvqpx.supabase.co:5432/postgres"

# 3. Проверь статус миграций
npx prisma migrate status

# 4. Примени миграции (если нужно)
npx prisma migrate deploy
```

---

## ✅ Что должно получиться

После выполнения `npx prisma migrate deploy` должно вывести:

```
✅ All migrations have been successfully applied.
```

---

## 🔍 Проверка таблиц

После применения миграций проверь в Supabase:

1. Supabase Dashboard → твой проект → **Table Editor**
2. Должны быть таблицы:
   - ✅ `users`
   - ✅ `posts`
   - ✅ `events`
   - ✅ `locations`
   - ✅ `conversations`
   - ✅ `conversation_participants`
   - ✅ `messages`
   - ✅ `notifications`
   - ✅ `bookings`
   - ✅ `event_requests`

---

**Готово!** После этого можно регистрировать пользователей 🚀
