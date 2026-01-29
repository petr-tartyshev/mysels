#!/bin/bash

# Скрипт для применения миграций к production базе данных

echo "🔍 Проверка и применение миграций к Supabase..."

# Проверка DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Ошибка: DATABASE_URL не установлен"
  echo ""
  echo "Установите DATABASE_URL из Supabase:"
  echo "export DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres\""
  echo ""
  echo "Где взять DATABASE_URL:"
  echo "1. Supabase Dashboard → твой проект"
  echo "2. Settings → Database → Connection string → URI"
  echo "3. Скопируй строку подключения"
  exit 1
fi

echo "✅ DATABASE_URL установлен"
echo ""

# Проверка статуса миграций
echo "📊 Проверка статуса миграций..."
npx prisma migrate status

echo ""
echo "🔄 Применение миграций..."
npx prisma migrate deploy

echo ""
echo "✅ Готово! Миграции применены."
echo ""
echo "Проверь таблицы в Supabase Dashboard → Table Editor"
